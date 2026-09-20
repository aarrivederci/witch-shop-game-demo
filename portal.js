/* Room arrival only: no save, economy or gameplay state. */
const RoomPortal=(()=>{
  const clamp=x=>Math.max(0,Math.min(1,x));
  function sample(ms,reduced=false){
    const duration=reduced?420:1250,p=clamp(ms/duration);
    const q=clamp((p-.12)/.76),solid=q*q*(3-2*q);
    return {p,solid,ghost:(1-solid)*(.28+.3*Math.sin(Math.PI*p)),spark:Math.sin(Math.PI*p),done:p===1,reduced};
  }
  function draw(ctx,x,y,a,time){
    if(a.done||a.reduced)return;
    ctx.save();ctx.globalAlpha=a.spark*.7;ctx.strokeStyle='#ceb3ff';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.ellipse(x,y+1,24+12*a.p,8+4*a.p,0,0,Math.PI*2);ctx.stroke();
    for(let i=0;i<12;i++){
      const angle=i*2.399+time/1100,rx=18+18*(1-a.p);
      const sx=x+Math.cos(angle)*rx,sy=y-8-(i*19+a.p*90)%142;
      const size=2+2.5*(.5+.5*Math.sin(i+time/140));
      ctx.globalAlpha=a.spark*(.35+.5*Math.sin(i+time/350)**2);
      ctx.fillStyle=i%3?'#e9d9ff':'#fff2bc';ctx.beginPath();
      ctx.moveTo(sx,sy-size*1.8);ctx.lineTo(sx+size*.45,sy-size*.45);
      ctx.lineTo(sx+size,sy);ctx.lineTo(sx+size*.45,sy+size*.45);
      ctx.lineTo(sx,sy+size*1.8);ctx.lineTo(sx-size*.45,sy+size*.45);
      ctx.lineTo(sx-size,sy);ctx.lineTo(sx-size*.45,sy-size*.45);ctx.closePath();ctx.fill();
    }
    ctx.restore();
  }
  return {sample,draw};
})();
if(typeof module!=='undefined')module.exports=RoomPortal;
