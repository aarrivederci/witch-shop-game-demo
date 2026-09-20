const RoomScene = (() => {
  const rooms={
    shop:{title:'经营空间',offset:0,start:[360,565],floor:[[52,525],[411,370],[798,550],[435,712]],
      blocks:[[[310,425],[390,425],[408,470],[334,492]],[[354,358],[526,368],[529,431],[412,446]],[[422,497],[695,549],[694,627],[514,657],[422,565]],[[718,461],[795,489],[798,534],[718,505]],[[132,555],[230,542],[246,611],[183,614]]],
      foreground:[{line:[422,565,694,627],poly:[[422,450],[503,427],[696,509],[695,629],[621,653],[517,652],[422,565]]},{line:[132,605,240,610],poly:[[137,559],[174,552],[183,497],[239,525],[246,610],[185,615],[138,589]]}],
      spots:[
        {id:'pot',name:'魔药锅',at:[350,400],foot:[293,492],panel:'modules',module:'potions'},
        {id:'bench',name:'调配台',at:[467,335],foot:[549,446],panel:'modules',module:'charms'},
        {id:'shelf',name:'药剂架',at:[749,346],foot:[714,503],panel:'shop',shop:'unlock'},
        {id:'counter',name:'柜台 · 营业',at:[458,492],foot:[551,490],service:true},
        {id:'orb',name:'占卜',at:[657,510],foot:[718,569],panel:'modules',module:'divination'},
        {id:'chest',name:'样品箱',at:[577,608],foot:[494,652],panel:'shop',shop:'inventory'},
        {id:'ledger',name:'店务账簿',at:[476,449],foot:[395,502],panel:'shop',shop:'upgrades'},
        {id:'guest',name:'熟客名册',at:[624,493],foot:[718,569],panel:'shop',shop:'bond'},
        {id:'door',name:'休息室 ↗',at:[631,350],foot:[616,472],door:'rest'}]},
    rest:{title:'休息空间',offset:836,start:[318,581],floor:[[48,535],[420,350],[787,548],[420,714]],
      blocks:[[[130,440],[268,414],[273,518],[169,538]],[[300,418],[457,352],[558,400],[451,521]],[[548,520],[617,494],[696,517],[704,555],[668,590],[621,605],[550,569]],[[547,425],[630,441],[627,479],[608,486],[545,460]]],
      foreground:[{line:[169,534,271,516],poly:[[132,408],[248,382],[281,416],[272,520],[166,538]]},{line:[300,483,450,520],poly:[[300,416],[362,365],[422,311],[529,344],[556,410],[451,522],[300,481]]},{line:[552,579,653,611],poly:[[552,513],[609,442],[651,433],[694,455],[690,550],[718,562],[709,608],[639,627],[560,587]]}],
      spots:[
        {id:'door',name:'↙ 回到小店',at:[80,390],foot:[110,547],door:'shop'},        {id:'journal',name:'日记 · 成就',at:[226,414],foot:[238,549],panel:'stats',records:true},
        {id:'tea',name:'沙发 · 茶歇阅读',at:[618,510],foot:[562,584],text:'茶壶轻轻倾斜，杯沿升起一缕热气。这里可以停一会儿，再回小店。'},
        {id:'window',name:'窗沿 · 望月',at:[717,400],foot:[724,518],text:'坐到窗沿，看一会儿月亮。'},
        {id:'bed',name:'床 · 床沿小憩',at:[437,434],foot:[444,536],text:'月光落在被角上。今晚的小店，也有了新的故事。'}]}
  };
  let room='shop',pos=[360,565],path=[],arrival=null,paused=true,readyFlag=false,canvas,ctx,last=0,t=0,selected='',lastFeedback=0;
  let reviewRate=1,reviewMs=null;
  let portalStart=null,portalState=null,portalNext=null;
  let facing=0,walkClock=0,hover='',demo=false,demoIndex=0,demoWait=0;
  const reducedMotion=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  const interaction=RoomInteractions.create();let actionState=null,exitMotion=null,afterExit=null;
  const seated=new Image();seated.src='assets/witch-seated-clean.png';let seatedFrames=[];
  seated.onload=()=>{const sc=document.createElement('canvas');sc.width=seated.width;sc.height=seated.height;const c=sc.getContext('2d',{willReadFrequently:true});c.drawImage(seated,0,0);const data=c.getImageData(0,0,sc.width,sc.height).data;for(let row=0;row<3;row++)for(let col=0;col<2;col++){const x0=col*sc.width/2,y0=row*sc.height/3,x1=x0+sc.width/2,y1=y0+sc.height/3;let l=x1,r=x0,top=y1,b=y0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(data[(y*sc.width+x)*4+3]>128){l=Math.min(l,x);r=Math.max(r,x);top=Math.min(top,y);b=Math.max(b,y);}seatedFrames.push({x:l,y:top,w:r-l+1,h:b-top+1});}};
  const readingBook=new Image();readingBook.src='assets/reading-book-open.png';let readingBounds=null;
  readingBook.onload=()=>{const c=document.createElement('canvas');c.width=readingBook.width;c.height=readingBook.height;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(readingBook,0,0);const d=g.getImageData(0,0,c.width,c.height).data;let l=c.width,r=0,top=c.height,b=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>128){l=Math.min(l,x);r=Math.max(r,x);top=Math.min(top,y);b=Math.max(b,y);}readingBounds=[l,top,r-l+1,b-top+1];};
  const image=new Image();image.src='assets/rooms-clean.png';
  const night=new Image();night.src='assets/window-night.png';
  const architecture=new Image();architecture.src='assets/architecture.png';
  const witch=new Image();witch.src='assets/witch-sheet.png';
  let frames=[];
  witch.onload=()=>{
    // Read alpha bounds only to register generated frame sizes to a common foot anchor.
    const scratch=document.createElement('canvas');scratch.width=witch.width;scratch.height=witch.height;
    const s=scratch.getContext('2d',{willReadFrequently:true});s.drawImage(witch,0,0);
    const pixels=s.getImageData(0,0,witch.width,witch.height).data;
    for(let row=0;row<3;row++)for(let col=0;col<4;col++){
      const x0=Math.floor(col*witch.width/4),x1=Math.floor((col+1)*witch.width/4),y0=Math.floor(row*witch.height/3),y1=Math.floor((row+1)*witch.height/3);
      let left=x1,right=x0,top=y1,bottom=y0;
      for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(pixels[(y*witch.width+x)*4+3]>128){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
      frames.push({x:left,y:top,w:right-left+1,h:bottom-top+1});
    }
  };
  for(const r of Object.values(rooms))r.nav=RoomNavigation.create(r.floor,r.blocks);
  const el=id=>document.getElementById(id);
  function setPaused(value){paused=value;Orders.setPaused(value);value?Keyboard.disable():Keyboard.enable();el('service-status').textContent=value?'休业 · 订单计时已暂停':'营业中 · 按单词提示打字';el('service-toggle').textContent=value?'去柜台营业':'暂停营业';el('typing-status').textContent=value?'阅读、走动时订单保留并暂停；回到柜台继续。':'可以直接敲键盘，或点击输入框输入英文。';el('touch-typing').disabled=value;document.body.classList.toggle('is-serving',!value);}
  function openSpot(s){selected=s.id;el('station-title').textContent=s.name;el('scene-hint').textContent='已打开'+s.name+'；阅读时订单暂停。';
    if(s.door){room=s.door;pos=rooms[room].start.slice();facing=0;portalStart=t;portalState=RoomPortal.sample(0,reducedMotion);portalNext=null;selected='';renderSpots();el('scene-hint').textContent='星光聚拢 · 正在另一间房间显形…';Layout.close(false);el('station-title').textContent=room==='rest'?'茶歇故事':'配方手册';return;}
    if(s.service){setPaused(false);Layout.close(false);el('scene-hint').textContent='正在柜台接待客人；点击其他家具即可暂停。';el('service-toggle').focus();return;}
    if(s.id==='tea'||s.id==='bed'||s.id==='window'){interaction.start(s.id,t,pos);if(s.id==='tea')UI.switchPanel('story');el('interaction-exit').hidden=false;el('scene-hint').textContent=s.id==='tea'?'坐一会儿 · 茶壶正在替你准备热茶。':s.id==='bed'?'坐在床沿 · 歇一会儿，轻轻晃腿。':'坐在窗沿 · 看一会儿月亮，轻轻晃腿。';return;}
    UI.switchPanel(s.panel);
    if(s.module){if(State.modules[s.module]){State.activeModule=s.module;Modules.render();}else{UI.switchPanel('shop');State.activeShopTab='unlock';Shop.render();el('scene-hint').textContent='这门技艺尚未解锁，可以先查看解锁条件。';}}
    if(s.shop){State.activeShopTab=s.shop;Shop.render();}
    if(s.id==='pot')interaction.start('pot',t,pos);
    if(s.records)document.querySelector('[data-stats-view="achievements"]')?.click();
    
  }
  function walkRoute(start,end){
    const nav=rooms[room].nav;
    if(room!=='rest')return nav.route(start,end);
    // Window access is behind the chair, reached via its left-hand aisle.
    const atWindow=p=>p[0]>700&&p[1]<545;
    const gate=[[530,530],[570,495],[630,490],[670,500],[710,520]];
    const points=atWindow(start)&&!atWindow(end)?[start,...gate.slice().reverse(),end]:!atWindow(start)&&atWindow(end)?[start,...gate,end]:[start,end];
    const route=[];for(let i=1;i<points.length;i++){const segment=nav.route(points[i-1],points[i]);if(!segment.length)return [];route.push(...segment);}
    return route;
  }
  function go(s){if(!readyFlag)return;if(portalStart!==null){portalNext=()=>go(s);return;}if(requestExit(()=>go(s)))return;cancelInteraction();setPaused(true);selected=s.id;path=walkRoute(pos,s.foot);arrival=()=>{facing=s.id==='pot'||s.id==='books'?2:s.id==='door'?3:0;openSpot(s);};el('scene-hint').textContent='前往'+s.name+'…';if(!path.length){arrival=null;el('scene-hint').textContent='这里暂时走不过去。';}}
  function renderSpots(){el('room-title').textContent=rooms[room].title;el('door-shortcut').textContent=room==='shop'?'前往休息室 ↗':'↙ 返回经营空间';el('scene-hint').textContent='点击地板走动 · 指向家具查看入口';el('scene-hotspots').replaceChildren();for(const s of rooms[room].spots){const b=document.createElement('button');b.className='room-hotspot';b.style.left=(s.at[0]/836*100)+'%';b.style.top=(s.at[1]/760*100)+'%';b.innerHTML='<span class="hotspot-dot">✦</span><span class="hotspot-label"></span>';b.querySelector('.hotspot-label').textContent=s.name;b.setAttribute('aria-label',s.name);b.dataset.spot=s.id;b.addEventListener('click',()=>{stopDemo();go(s);});b.addEventListener('mouseenter',()=>hover=s.id);b.addEventListener('mouseleave',()=>hover='');el('scene-hotspots').append(b);}}
  function init(){if(new URLSearchParams(location.search).has('review')){const b=document.createElement('button');b.id='review-speed';b.textContent='动作慢放：关';b.onclick=()=>{reviewRate=reviewRate===1?.2:1;b.textContent=reviewRate===1?'动作慢放：关':'动作慢放：5 倍';};document.querySelector('.scene-footer').append(b);const select=document.createElement('select');select.setAttribute('aria-label','动作关键帧检查');for(const [label,value] of [['实时',''],['传送虚影','200'],['传送凝实','650'],['传送完成','1250'],['翻页','900'],['开窗中','500'],['开窗完成','1100'],['窗沿入座','1700'],['倒茶','2000'],['送杯','4200'],['阅读静止','7300'],['翻页起','5800'],['翻页中','6250'],['翻页落','6700'],['晃腿前','1300'],['晃腿后','2100']]){const option=document.createElement('option');option.textContent=label;option.value=value;select.append(option);}select.onchange=()=>reviewMs=select.value===''?null:Number(select.value);document.querySelector('.scene-footer').append(select);}
    canvas=el('scene-canvas');ctx=canvas.getContext('2d');canvas.addEventListener('contextrestored',resetTextures);window.addEventListener('pageshow',resetTextures);window.addEventListener('focus',resetTextures);renderSpots();
    canvas.addEventListener('click',e=>{if(!readyFlag)return;const r=canvas.getBoundingClientRect(),p=[(e.clientX-r.left)*836/r.width,(e.clientY-r.top)*760/r.height];stopDemo();if(!rooms[room].nav.valid(p))return;const walk=()=>{cancelInteraction();setPaused(true);arrival=null;selected='';path=walkRoute(pos,p);el('scene-hint').textContent='在房间里走走。';};if(portalStart!==null){portalNext=walk;return;}if(!requestExit(walk))walk();});
    el('interaction-exit').onclick=()=>requestExit(()=>{el('scene-hint').textContent='已起身 · 可以继续走动或选择家具。';});
    el('service-toggle').onclick=()=>{if(requestExit(()=>el('service-toggle').onclick()))return;cancelInteraction();stopDemo();if(!paused){setPaused(true);return;}if(room!=='shop'){go(rooms.rest.spots.find(s=>s.door));return;}go(rooms.shop.spots.find(s=>s.service));};
    el('door-shortcut').onclick=()=>{stopDemo();go(rooms[room].spots.find(s=>s.door));};
    el('walk-tour').onclick=()=>{if(portalStart!==null){portalNext=()=>el('walk-tour').onclick();return;}if(requestExit(()=>el('walk-tour').onclick()))return;cancelInteraction();if(demo){stopDemo();return;}setPaused(true);arrival=null;path=[];demo=true;demoIndex=0;demoWait=0;el('walk-tour').textContent='停止走动展示';};
    el('hotspot-toggle').setAttribute('aria-pressed','false');
    el('hotspot-toggle').onclick=()=>{const shown=el('scene-hotspots').classList.toggle('show-labels');el('hotspot-toggle').setAttribute('aria-pressed',String(shown));};
    el('touch-typing').addEventListener('input',e=>{if(!e.isComposing)for(const c of e.target.value)Keyboard.input(c);e.target.value='';});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)resetTextures();if(document.hidden&&readyFlag){cancelInteraction();stopDemo();setPaused(true);}});
    document.addEventListener('click',e=>{if(readyFlag&&e.target.closest('#right-column,[data-panel]')){stopDemo();setPaused(true);if(e.target.closest('[data-panel]')){const b=e.target.closest('[data-panel]');el('station-title').textContent=b.textContent;}}},true);
    window.addEventListener('pagehide',()=>{if(readyFlag)saveState();});
    requestAnimationFrame(frame);
  }
  function ready(){readyFlag=true;setPaused(true);el('station-title').textContent='配方手册';}
  function stopDemo(){if(demo)el('scene-hint').textContent='走动展示已停止 · 可以继续点击家具';demo=false;path=[];arrival=null;el('walk-tour').textContent='看一段走动';}
  function requestExit(next){if(exitMotion){afterExit=next;return true;}if(!actionState||actionState.kind==='pot')return false;exitMotion={state:{...actionState},start:t};afterExit=next;interaction.cancel();el('interaction-exit').hidden=true;el('scene-hint').textContent='轻轻起身…';return true;}
  function cancelInteraction(){exitMotion=null;afterExit=null;interaction.cancel();actionState=null;if(el('interaction-exit'))el('interaction-exit').hidden=true;}
  function actor(){if(actionState&&actionState.kind!=='pot'&&seatedFrames.length){drawSeated();return;}if(!frames.length)return;const moving=path.length>0;
    const phase=moving&&!reducedMotion?[0,1,0,2][Math.floor(walkClock/125)%4]:0;
    const f=frames[phase*4+facing],h=140,w=h*f.w/f.h;
    ctx.imageSmoothingEnabled=false;
    const draw=()=>ctx.drawImage(witch,f.x,f.y,f.w,f.h,Math.round(pos[0]-w/2),Math.round(pos[1]-h),Math.round(w),h);
    if(portalState){ctx.save();ctx.globalAlpha=portalState.ghost;ctx.filter='brightness(1.7) sepia(.4) hue-rotate(205deg)';ctx.shadowColor='#cfafff';ctx.shadowBlur=14;draw();ctx.restore();ctx.save();ctx.globalAlpha=portalState.solid;draw();ctx.restore();RoomPortal.draw(ctx,pos[0],pos[1],portalState,t);}else draw();
  }
  function polygon(points){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();}
  function glow(x,y,rx,ry,color){ctx.save();ctx.translate(x,y);ctx.scale(1,ry/rx);const g=ctx.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,color);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,rx,0,Math.PI*2);ctx.fill();ctx.restore();}
  function resetTextures(){for(const list of Object.values(RoomLayers))for(const layer of list)layer.surface=null;RoomVisuals.resetTextures();}
  function drawLayer(layer,current){
    if(layer.surface?.getContext('2d').isContextLost?.())layer.surface=null;
    if(!layer.surface){
      const xs=layer.poly.map(p=>p[0]),ys=layer.poly.map(p=>p[1]);layer.x=Math.min(...xs);layer.y=Math.min(...ys);
      const surface=document.createElement('canvas');surface.width=Math.max(...xs)-layer.x+1;surface.height=Math.max(...ys)-layer.y+1;
      const c=surface.getContext('2d',{willReadFrequently:true});c.translate(-layer.x,-layer.y);c.beginPath();layer.poly.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();for(const hole of layer.holes||[]){c.moveTo(...hole[0]);for(const p of hole.slice(1))c.lineTo(...p);c.closePath();}c.clip('evenodd');c.drawImage(image,current.offset,0,836,760,0,0,836,760);layer.surface=surface;
    }
    const dy=layer.float&&!reducedMotion?Math.sin(t/900+(layer.phase||0))*layer.float:0;
    ctx.save();ctx.imageSmoothingEnabled=true;let dx=0,dyAction=0;if(actionState?.kind==='tea'){const shift=layer.id==='cup'?actionState.cupShift:layer.id==='teapot'?actionState.potShift:null;if(shift){[dx,dyAction]=shift;}}
    if(actionState?.kind==='window'&&(layer.id==='teapot'||layer.id==='cup')){const offset=layer.id==='teapot'?[-35,65]:[-5,70];dx=offset[0]*Math.max(actionState.windowOpen,actionState.seat);dyAction=offset[1]*Math.max(actionState.windowOpen,actionState.seat);}
    ctx.translate(layer.x+dx,layer.y+dy+dyAction);
    if((layer.id==='book'&&actionState?.kind==='pot')||(layer.id==='teapot'&&actionState?.kind==='tea')){ctx.shadowColor=layer.id==='book'?'#e9caff':'#ffe3ae';ctx.shadowBlur=actionState.glow*24;ctx.filter='brightness('+(1+actionState.glow*.4)+')';}
    if(layer.id==='teapot'&&(!reducedMotion||actionState?.kind==='tea')){const cx=layer.surface.width/2,cy=layer.surface.height/2;ctx.translate(cx,cy);ctx.rotate(actionState?.kind==='tea'?actionState.potAngle:Math.sin(t/1700)*.055);ctx.translate(-cx,-cy);}
    if(layer.id==='book')RoomVisuals.book(ctx,image,layer,actionState?.kind==='pot'?actionState.flip:0);else ctx.drawImage(layer.surface,0,0);ctx.restore();
    if(layer.id==='cup'&&actionState?.kind==='tea'&&actionState.ms>2800){ctx.fillStyle='#a96935';ctx.beginPath();ctx.ellipse(707+dx,499+dy+dyAction,7,2,0,0,Math.PI*2);ctx.fill();}
  }
  function drawSeated(){
    const a=actionState,bed=a.kind==='bed'||a.kind==='window',f=seatedFrames[bed?a.legFrame*2+1:0];
    const seat=a.kind==='window'?[706,419]:bed?[418,451]:[614,530],p=a.seat;
    const x=RoomInteractions.lerp(a.origin[0],seat[0],p),y=RoomInteractions.lerp(a.origin[1]-36,seat[1],p);
    // Register by the hat and hip, never by the moving boot's bottom edge.
    const scale=.32,hipY=292,hipSourceX=bed?254:272,colX=bed?512:0;
    ctx.save();ctx.imageSmoothingEnabled=false;
    if(p<1&&frames.length){const walk=frames[1],h=140,w=h*walk.w/walk.h;ctx.globalAlpha=1-p;ctx.drawImage(witch,walk.x,walk.y,walk.w,walk.h,x-w/2,y+36-h,w,h);}
    ctx.globalAlpha=p;const base=seatedFrames[bed?1:0];
    const drawPart=(frame,sy,sh)=>ctx.drawImage(seated,frame.x,frame.y+sy,frame.w,sh,Math.round(x+(frame.x-colX-hipSourceX)*scale),Math.round(y+(sy-hipY)*scale),Math.round(frame.w*scale),Math.round(sh*scale));
    // The entire seated body is in front of the sill; only the near sash occludes it.
    drawPart(base,0,310);drawPart(f,310,f.h-310);ctx.restore();
  }
  function drawInteraction(){
    const a=actionState;if(!a)return;
    if(a.kind==='window'&&a.stage==='opening')el('scene-hint').textContent='先打开窗户，让晚风进来…';
    if(a.kind==='window'&&a.stage==='seating')el('scene-hint').textContent='窗户打开了 · 轻轻坐上窗沿。';
    if(a.kind==='window'&&a.stage==='swinging')el('scene-hint').textContent='坐在窗沿 · 看一会儿月亮。';
    if(a.kind==='tea'){
      if(a.stream>0){
        const dy=reducedMotion?0:Math.sin(t/900)*5,cy=reducedMotion?0:Math.sin(t/900+1.2)*3;
        ctx.save();ctx.globalAlpha=a.stream;ctx.strokeStyle='#f4ca7b';ctx.lineWidth=2.5;ctx.shadowColor='#ffe5bb';ctx.shadowBlur=5;
        ctx.beginPath();ctx.moveTo(719,473+dy);ctx.quadraticCurveTo(709,481+dy,707,498+cy);ctx.stroke();ctx.restore();
        glow(707,498+cy,12,4,'#ffe6aa55');
      }
      if(a.book>0&&readingBounds){const float=reducedMotion?0:Math.sin(t/1300)*2;
        ctx.save();ctx.globalAlpha=a.book;glow(586,515+float,38,14,'#c6a3de33');
        const width=82,height=width*readingBounds[3]/readingBounds[2];
        RoomVisuals.reading(ctx,readingBook,readingBounds,540,468+float,width,height,a.flip);
        ctx.restore();
      }
      if(a.ms>5000&&a.stage==='reading')el('scene-hint').textContent='茶已斟好 · 书页偶尔翻动；点击地板或「起身离开」结束茶歇。';
    }
  }
  function atmosphere(current){
    ctx.save();polygon(current.floor);ctx.clip();
    const shadows=room==='shop'?[[461,429,73,19],[351,465,42,13],[738,501,57,15],[557,598,124,25],[578,643,55,15],[194,601,47,15]]:[[200,518,65,18],[376,491,94,23],[321,466,57,15],[602,575,57,19],[679,602,28,10]];
    for(const [x,y,rx,ry] of shadows)glow(x+6,y+3,rx,ry,'#140e2460');
    if(room==='shop'){
      glow(351,466,64,22,'#aa72cb55');ctx.strokeStyle='#dca8ea80';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(351,465,37+(reducedMotion?0:Math.sin(t/850)*2),12,0,0,Math.PI*2);ctx.stroke();
    }
    // Foot shadow stays on the floor while the artwork sorts between furniture layers.
    if(!actionState||actionState.kind==='pot')glow(pos[0]+7,pos[1]+2,27,9,'#130d22b0');
    ctx.restore();
  }
  function magic(){if(reducedMotion)return;const origin=room==='shop'?[353,375]:[707,493];
    for(let i=0;i<7;i++){const a=t/1900+i*1.4,x=origin[0]+Math.sin(a)*25,y=origin[1]-((t/45+i*9)%55);ctx.globalAlpha=.18+Math.sin(i+t/1200)**2*.38;ctx.fillStyle=room==='shop'?'#d7b5ed':'#f4dfc5';ctx.fillRect(Math.round(x),Math.round(y),2,3);}ctx.globalAlpha=1;
  }
  function frame(now){const dt=Math.min(200,now-last||16);last=now;t+=dt*reviewRate;const r=rooms[room];
    if(portalStart!==null){portalState=RoomPortal.sample(reviewMs===null?t-portalStart:reviewMs,reducedMotion);if(portalState.done){portalStart=null;portalState=null;el('scene-hint').textContent='已抵达 · 点击家具或地板继续。';const next=portalNext;portalNext=null;if(next)next();}}
    if(demo&&!path.length&&now>demoWait){const tours=room==='shop'?[[290,500],[421,465],[560,490],[700,533],[725,560],[501,668],[365,566]]:[[106,551],[282,536],[462,557],[533,626],[330,586]];path=r.nav.route(pos,tours[demoIndex++%tours.length]);demoWait=now+2400;el('scene-hint').textContent='走动展示 · 观察角色转身、绕行和家具前后遮挡';}
    if(path.length){const p=path[0],dx=p[0]-pos[0],dy=p[1]-pos[1],dist=Math.hypot(dx,dy*1.85),speed=dt*.15*reviewRate;
      if(Math.hypot(dx,dy)>1){facing=dy<-1?(dx<0?3:2):(dx<0?1:0);walkClock+=dt*reviewRate;}
      if(dist<=speed){pos=p.slice();path.shift();}else{pos[0]+=dx*speed/dist;pos[1]+=dy*speed/dist;}if(!path.length&&arrival){const action=arrival;arrival=null;action();}}
    if(exitMotion){const q=1-RoomInteractions.ease((t-exitMotion.start)/650);actionState={...exitMotion.state,stage:'leaving',windowOpen:exitMotion.state.windowOpen*RoomInteractions.ease(q*2),seat:exitMotion.state.seat*Math.max(0,(q-.5)*2),book:exitMotion.state.book*q,stream:0,glow:0,flip:0,potAngle:exitMotion.state.potAngle*q,potShift:exitMotion.state.potShift.map(v=>v*q),cupShift:exitMotion.state.cupShift.map(v=>v*q)};if(q===0){const next=afterExit;cancelInteraction();if(next)next();}}else {actionState=interaction.read(t,reducedMotion);if(actionState&&reviewMs!==null)actionState={...actionState,...RoomInteractions.sample(actionState.kind,reviewMs,reducedMotion)};}if(actionState?.finished){interaction.cancel();actionState=null;}
    ctx.clearRect(0,0,836,760);const current=rooms[room];
    if(image.complete&&image.naturalWidth&&architecture.complete&&architecture.naturalWidth){
      ctx.imageSmoothingEnabled=true;ctx.drawImage(architecture,current.offset,0,836,760,0,0,836,760);if(room==='rest')RoomVisuals.window(ctx,image,actionState?.kind==='window'?actionState.windowOpen:0,night,actionState?.kind==='window'&&actionState.seat>0?'back':'all');atmosphere(current);
      const ordered=RoomLayers[room].map(layer=>({layer,depth:actionState?.kind==='tea'&&layer.id==='chair-front'?594:RoomVisuals.depth(layer,pos[0])}));
      if(readyFlag)ordered.push({depth:actionState?.kind==='tea'?592:actionState?.kind==='bed'?550:actionState?.kind==='window'?510:pos[1],person:true});if(actionState?.kind==='window'&&actionState.seat>0)ordered.push({depth:511,windowFront:true});ordered.sort((a,b)=>a.depth-b.depth);
      for(const item of ordered){if(item.person)actor();else if(item.windowFront)RoomVisuals.window(ctx,image,actionState.windowOpen,night,'front');else drawLayer(item.layer,current);}drawInteraction();magic();
    }
    if(path.length){const p=path[path.length-1];ctx.strokeStyle='#e3c88799';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(...p,10,4,0,0,Math.PI*2);ctx.stroke();}
    if(now-lastFeedback<700){ctx.fillStyle='#ebd395';ctx.font='17px serif';ctx.fillText('✦',pos[0]+22,pos[1]-70-(now-lastFeedback)/55);}
    canvas.dataset.portal=portalState?portalState.solid.toFixed(3):'none';canvas.dataset.windowOpen=String(actionState?.windowOpen||0);canvas.dataset.seat=String(actionState?.seat||0);canvas.dataset.interaction=actionState?.kind||'none';canvas.dataset.actionStage=actionState?.stage||'idle';canvas.dataset.actionMs=String(Math.round(actionState?.ms||0));canvas.dataset.legFrame=String(actionState?.legFrame||0);
    canvas.dataset.position=pos.map(v=>v.toFixed(1)).join(',');canvas.dataset.frame=String(Math.round(now));canvas.dataset.moving=String(path.length>0);canvas.dataset.facing=String(facing);
    requestAnimationFrame(frame);
  }
  return {init,ready,pause:()=>{stopDemo();setPaused(true);},isPaused:()=>paused,feedback:()=>{lastFeedback=performance.now();},rooms};
})();
const Renderer={init:RoomScene.init,setWitchState:()=>RoomScene.feedback()};
