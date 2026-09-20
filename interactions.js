/* Pure, elapsed-time choreography; no timers survive an interrupted action. */
const RoomInteractions = (() => {
  const clamp=x=>Math.max(0,Math.min(1,x));
  const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
  const lerp=(a,b,p)=>a+(b-a)*p;
  function sample(kind,ms,reduced=false){
    const s={kind,ms,finished:false,stage:'idle',glow:0,flip:0,seat:0,potAngle:0,potShift:[0,0],cupShift:[0,0],stream:0,book:0,legFrame:0,windowOpen:0};
    if(kind==='pot'){
      s.finished=ms>=1800;s.stage=s.finished?'done':'pages';
      s.glow=s.finished?0:Math.sin(Math.PI*clamp(ms/1800))*.8;
      s.flip=!reduced&&!s.finished?(ms%260)/260:0;return s;
    }
    s.seat=ease(ms/850);
    if(kind==='tea'){
      s.stage=ms<850?'seating':ms<1450?'warming':ms<2950?'pouring':ms<3550?'settling':ms<5000?'serving':'reading';
      const tilt=ease((ms-850)/600)*(1-ease((ms-2950)/600));
      s.potAngle=-.62*tilt;s.potShift=[20*tilt,-1*tilt];
      s.glow=.65*ease((ms-700)/500)*(1-ease((ms-3400)/650));
      s.stream=ms>=1450&&ms<2950?Math.min(1,(ms-1450)/180,(2950-ms)/160):0;
      const travel=ease((ms-3550)/1450);s.cupShift=[-40*travel,12*travel];
      s.book=ease((ms-4700)/650);
      const phase=(ms-5600)%4200;s.flip=!reduced&&ms>5600&&phase<1400?phase/1400:0;
      return s;
    }
    if(kind==='bed'||kind==='window'){
      const delay=kind==='window'?1200:0;
      if(kind==='window'){s.windowOpen=ease(ms/1100);s.seat=ease((ms-delay)/850);}
      s.stage=ms<delay?'opening':ms<delay+850?'seating':'swinging';
      if(!reduced&&ms>=delay+850)s.legFrame=[0,1,0,2][Math.floor((ms-delay-850)/380)%4];
    }
    return s;
  }
  function create(){let active=null;
    return {start(kind,now,origin){active={kind,start:now,origin:origin.slice()};},cancel(){active=null;},
      read(now,reduced=false){if(!active)return null;return {...sample(active.kind,Math.max(0,now-active.start),reduced),origin:active.origin};},
      get active(){return !!active;}};
  }
  return {sample,create,ease,lerp};
})();
if(typeof module!=='undefined')module.exports=RoomInteractions;
