/* Shop-hour choice and window transition. Gameplay save remains in state.js. */
const ShopHours = (() => {
  const key = 'witchShopDaypart_v1';
  const labels = {day:'白天',dusk:'傍晚',night:'夜晚'};
  const icons = {day:'☀',dusk:'✧',night:'☾'};
  const favored = {
    day:new Set(['student','merchant','farmer']),
    dusk:new Set(['traveler','knight','bard']),
    night:new Set(['knight','ghost','vampire','witch_hunter'])
  };
  const palettes = {
    day:{upper:'#9cc7dd',lower:'#e2d6b1',hill:'#6c8790',tree:'#365c59',doorUpper:'#7fb5d2'},
    dusk:{upper:'#685e94',lower:'#ed9c80',hill:'#62536f',tree:'#36304d',doorUpper:'#9c7196'}
  };
  const windowPanes = [
    [[234,210],[263,202],[263,249],[234,257]],
    [[270,200],[300,192],[300,240],[270,249]],
    [[234,264],[263,256],[263,312],[234,320]],
    [[270,255],[300,246],[300,302],[270,311]]
  ];
  const doorPanes = [
    [[103,257],[125,250],[125,278],[103,285]],
    [[131,249],[157,242],[157,271],[131,278]],
    [[101,317],[126,309],[126,365],[101,373]],
    [[132,307],[157,300],[157,357],[132,365]],
    [[101,379],[126,372],[126,416],[101,423]],
    [[132,371],[157,364],[157,407],[132,415]]
  ];
  let selected = 'night';
  try { const saved = localStorage.getItem(key); if(labels[saved])selected=saved; } catch {}
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const overlays = {};
  let from = null, start = 0, animating = false;

  function polygon(ctx, points) {
    ctx.moveTo(...points[0]);
    for(const point of points.slice(1))ctx.lineTo(...point);
    ctx.closePath();
  }
  function pine(ctx,x,baseY,height,color) {
    const top=baseY-height;
    ctx.fillStyle=color;
    ctx.fillRect(Math.round(x-1),Math.round(top+height*.35),2,Math.round(height*.65));
    for(let row=0;row<3;row++){
      const y=top+height*(.26+row*.22),half=height*(.14+row*.075);
      ctx.beginPath();polygon(ctx,[[x,top+row*height*.12],[x-half,y+height*.1],[x+half,y+height*.1]]);ctx.fill();
    }
  }
  function glass(ctx,panes,bounds,cfg,period,isDoor) {
    const [x,y,w,h]=bounds;
    ctx.save();ctx.beginPath();panes.forEach(points=>polygon(ctx,points));ctx.clip();
    const sky=ctx.createLinearGradient(x,y,x,y+h);
    sky.addColorStop(0,isDoor?cfg.doorUpper:cfg.upper);sky.addColorStop(1,cfg.lower);
    ctx.fillStyle=sky;ctx.fillRect(x,y,w,h);
    if(!isDoor){
      ctx.fillStyle=period==='day'?'#fff5d5':'#ffe2ac';
      ctx.beginPath();ctx.arc(x+w*.72,y+h*(period==='dusk'?.47:.18),period==='day'?6:8,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle=cfg.hill;ctx.beginPath();
    polygon(ctx,[[x,y+h*.69],[x+w*.17,y+h*.58],[x+w*.43,y+h*.7],[x+w*.72,y+h*.62],[x+w,y+h*.68],[x+w,y+h],[x,y+h]]);ctx.fill();
    const trunks=isDoor?[[.06,.33],[.4,.48],[.81,.42]]:[[.02,.41],[.21,.55],[.55,.45],[.88,.57]];
    trunks.forEach(([tx,th])=>pine(ctx,x+w*tx,y+h*1.07,h*th,cfg.tree));
    const shine=ctx.createLinearGradient(x,y,x+w,y);
    shine.addColorStop(0,'rgba(210,235,255,.18)');shine.addColorStop(.3,'rgba(210,235,255,0)');shine.addColorStop(1,'rgba(210,235,255,.08)');
    ctx.fillStyle=shine;ctx.fillRect(x,y,w,h);ctx.restore();
  }
  function glow(ctx,x,y,radius,color) {
    const gradient=ctx.createRadialGradient(x,y,0,x,y,radius);
    gradient.addColorStop(0,color);gradient.addColorStop(.5,color.replace(/,[\d.]+\)$/,',0.035)'));
    gradient.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=gradient;ctx.fillRect(x-radius,y-radius,radius*2,radius*2);
  }
  function ensureOverlays() {
    if(overlays.night)return;
    for(const period of Object.keys(labels)){
      const canvas=document.createElement('canvas');canvas.width=836;canvas.height=760;
      const ctx=canvas.getContext('2d');
      if(period!=='night'){
        if(period==='day'){
          glow(ctx,276,306,210,'rgba(227,242,232,.13)');
          glow(ctx,335,470,250,'rgba(255,237,202,.075)');
        }else{
          glow(ctx,278,308,220,'rgba(250,175,151,.14)');
          glow(ctx,342,461,290,'rgba(237,148,124,.10)');
        }
        glass(ctx,windowPanes,[232,189,71,135],palettes[period],period,false);
        glass(ctx,doorPanes,[99,239,61,189],palettes[period],period,true);
      }
      overlays[period]=canvas;
    }
  }
  function progress(now) { return Math.min(1,Math.max(0,(now-start)/1400)); }
  function blend(ctx,oldCanvas,newCanvas,amount) {
    ctx.save();
    ctx.globalAlpha=1-amount;ctx.drawImage(oldCanvas,0,0);
    ctx.globalAlpha=amount;ctx.drawImage(newCanvas,0,0);
    ctx.restore();
  }
  function snapshot(now) {
    const canvas=document.createElement('canvas');canvas.width=836;canvas.height=760;
    const ctx=canvas.getContext('2d');
    if(animating){const p=progress(now),ease=p*p*(3-2*p);blend(ctx,from,overlays[selected],ease);}
    else ctx.drawImage(overlays[selected],0,0);
    return canvas;
  }
  function updatePanel() {
    document.querySelectorAll('[data-daypart]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.daypart===selected)));
    const status=document.getElementById('daypart-status');
    if(status)status.textContent=`当前时段：${labels[selected]}${animating?' · 窗景正在变化':''}`;
    const visitors=document.getElementById('daypart-visitors');
    if(visitors&&typeof CUSTOMER_TYPES!=='undefined'&&typeof State!=='undefined'){
      const names=CUSTOMER_TYPES.filter(customer=>customer.phase<=State.phase&&favored[selected].has(customer.id)).map(customer=>customer.name);
      visitors.textContent=names.length?names.join('、'):'这一阶段还没有时段偏好的来客';
    }
  }
  function choose(period) {
    if(!labels[period]||period===selected)return;
    ensureOverlays();
    const now=performance.now();from=snapshot(now);
    selected=period;start=now;animating=!reducedMotion;
    try{localStorage.setItem(key,period);}catch{}
    updatePanel();
    const hint=document.getElementById('scene-hint');
    if(hint)hint.textContent=`营业时刻牌翻到${labels[period]} · 新来的客人会随之改变。`;
  }
  function draw(ctx,now) {
    ensureOverlays();
    if(!animating){ctx.drawImage(overlays[selected],0,0);return;}
    const p=progress(now),ease=p*p*(3-2*p);
    blend(ctx,from,overlays[selected],ease);
    if(selected==='night'&&p<1){
      ctx.save();ctx.globalAlpha=Math.sin(Math.PI*p)*.7;ctx.fillStyle='#dbe9ff';
      for(const [x,y,s] of [[245,221,3],[287,182,4],[297,263,2],[117,296,2]]){
        ctx.fillRect(x-s,y,2*s+1,1);ctx.fillRect(x,y-s,1,2*s+1);
      }
      ctx.restore();
    }
    if(p===1){animating=false;from=null;updatePanel();}
  }
  function drawSign(ctx) {
    ctx.save();ctx.fillStyle='#f4d4a0';ctx.font='14px serif';ctx.fillText(icons[selected],205,533);ctx.restore();
  }
  function open() { updatePanel(); }
  function init() {
    document.querySelectorAll('[data-daypart]').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.daypart)));
    updatePanel();
  }
  document.addEventListener('DOMContentLoaded',init);
  return {current:()=>selected,weightFor:customer=>favored[selected].has(customer.identityId||customer.id)?2.5:1,draw,drawSign,open,choose};
})();
