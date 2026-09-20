/* Texture deformation uses the approved artwork, not a second book drawing. */
const RoomVisuals = (() => {
  function depth(layer,x){
    const edge=layer.edge || (layer.line?[[layer.line[0],layer.line[1]],[layer.line[2],layer.line[3]]]:null);
    if(!edge)return layer.depth;
    // Never extrapolate a short furniture edge across the whole room.
    x=Math.max(edge[0][0],Math.min(edge[edge.length-1][0],x));
    for(let i=1;i<edge.length;i++)if(x<=edge[i][0]){const a=edge[i-1],b=edge[i];return a[1]+(x-a[0])*(b[1]-a[1])/(b[0]-a[0]);}
    return layer.depth;
  }
  function triangle(ctx,img,s,d){
    const [a,b,c]=s,[p,q,r]=d,det=(b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]);
    if(Math.abs(det)<.001)return;
    const A=((q[0]-p[0])*(c[1]-a[1])-(r[0]-p[0])*(b[1]-a[1]))/det;
    const C=((r[0]-p[0])*(b[0]-a[0])-(q[0]-p[0])*(c[0]-a[0]))/det;
    const B=((q[1]-p[1])*(c[1]-a[1])-(r[1]-p[1])*(b[1]-a[1]))/det;
    const D=((r[1]-p[1])*(b[0]-a[0])-(q[1]-p[1])*(c[0]-a[0]))/det;
    ctx.save();ctx.beginPath();d.forEach((v,i)=>i?ctx.lineTo(...v):ctx.moveTo(...v));ctx.closePath();ctx.clip();
    ctx.transform(A,B,C,D,p[0]-A*a[0]-C*a[1],p[1]-B*a[0]-D*a[1]);ctx.drawImage(img,0,0);ctx.restore();
  }
  function quad(ctx,img,src,dest){triangle(ctx,img,[src[0],src[1],src[2]],[dest[0],dest[1],dest[2]]);triangle(ctx,img,[src[0],src[2],src[3]],[dest[0],dest[2],dest[3]]);}
  const pages={left:[[285,337],[302,334],[313,355],[297,360]],right:[[303,334],[324,329],[334,350],[313,355]]};
  function book(ctx,img,layer,flip){
    // Cover/spine and both resting page stacks are distinct masks of ONE source book.
    ctx.save();ctx.beginPath();ctx.rect(0,0,layer.surface.width,layer.surface.height);
    for(const poly of Object.values(pages)){ctx.moveTo(poly[0][0]-layer.x,poly[0][1]-layer.y);for(const p of poly.slice(1))ctx.lineTo(p[0]-layer.x,p[1]-layer.y);ctx.closePath();}
    ctx.clip('evenodd');ctx.drawImage(layer.surface,0,0);ctx.restore();
    ctx.save();ctx.translate(-layer.x,-layer.y);
    for(const poly of Object.values(pages))quad(ctx,img,poly,poly);
    if(flip>0){
      const p=pages.right,c=Math.cos(flip*Math.PI),lift=Math.sin(flip*Math.PI)*19;
      const moved=[p[0],[p[0][0]+21*c,p[0][1]-5*c-lift],[p[3][0]+21*c,p[3][1]-5*c-lift],p[3]];
      quad(ctx,img,p,moved);
    }
    ctx.restore();
  }
  let casements;
  function readingPageGeometry(phase){
    const q=(1-Math.cos(phase*Math.PI))/2,lift=Math.sin(phase*Math.PI)*340;
    const h0=[585,528],h1=[443,693],r0=[1130,332],r1=[1215,409],l0=[250,145],l1=[148,184];
    const outer=(a,b)=>[a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q];
    const e0=outer(r0,l0),e1=outer(r1,l1);
    // Preserve the page width as its free edge curls towards the camera.
    e1[0]-=230*Math.sin(phase*Math.PI);e1[1]+=70*Math.sin(phase*Math.PI);
    const point=(h,e,r)=>[h[0]+(e[0]-h[0])*r,h[1]+(e[1]-h[1])*r-lift*Math.sin(r*Math.PI/2)-Math.sin(r*Math.PI)*35*Math.sin(phase*Math.PI)];
    return Array.from({length:9},(_,i)=>[point(h0,e0,i/8),point(h1,e1,i/8)]);
  }
  function reading(ctx,img,bounds,x,y,w,h,phase){
    ctx.drawImage(img,...bounds,x,y,w,h);
    if(phase<=0)return;
    ctx.save();ctx.translate(x,y);ctx.scale(w/bounds[2],h/bounds[3]);ctx.translate(-bounds[0],-bounds[1]);
    const strips=readingPageGeometry(phase),source=[[585,528],[250,145],[148,184],[443,693]];
    const mix=(a,b,p)=>a.map((v,i)=>v+(b[i]-v)*p);
    for(let i=0;i<8;i++){
      const a=i/8,b=(i+1)/8;
      quad(ctx,img,[mix(source[0],source[1],a),mix(source[0],source[1],b),mix(source[3],source[2],b),mix(source[3],source[2],a)],
        [strips[i][0],strips[i+1][0],strips[i+1][1],strips[i][1]]);
    }
    ctx.strokeStyle='#b39776';ctx.lineWidth=8;ctx.beginPath();strips.forEach((p,i)=>i?ctx.lineTo(...p[0]):ctx.moveTo(...p[0]));ctx.lineTo(...strips[8][1]);for(let i=7;i>=0;i--)ctx.lineTo(...strips[i][1]);ctx.stroke();ctx.restore();
  }
  function casementGeometry(index,open){
    const hinge=index===0?[675,251]:[749,276];
    const angle=open*Math.PI*(index===0?102:108)/180;
    // Both leaves rotate INTO the same room, about vertical hinges. Screen-space
    // room axes: wall=(1,.338), inward=(-.85,.55), up=(0,-1).
    const direction=index===0?1:-1;
    const dx=37*(direction*Math.cos(angle)-.85*Math.sin(angle));
    const dy=37*(direction*.338*Math.cos(angle)+.55*Math.sin(angle));
    const h=index===0?154:155;
    const free=[hinge[0]+dx,hinge[1]+dy];
    return index===0?[hinge,free,[free[0],free[1]+h],[hinge[0],hinge[1]+h]]:
      [free,hinge,[hinge[0],hinge[1]+h],[free[0],free[1]+h]];
  }
  function windowSill(ctx,part='top'){
    const points=part==='lip'?[[667,411],[744,438],[744,444],[667,417]]:[[672,404],[750,431],[744,438],[667,411]];
    ctx.fillStyle=part==='lip'?'#4d3447':'#886174';ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill();
    ctx.strokeStyle='#b18a99';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(...points[0]);ctx.lineTo(...points[1]);ctx.stroke();
  }
  function window(ctx,img,open,night,pass='all'){
    if(open<=0)return;
    const outline=[[675,251],[749,276],[749,431],[675,405]];
    if(pass!=='front'){ctx.save();ctx.beginPath();outline.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.clip();
    ctx.fillStyle='#192d4b';ctx.fillRect(674,250,77,184);
    if(night?.naturalWidth)quad(ctx,night,[[night.width/2,0],[night.width,0],[night.width,night.height],[night.width/2,night.height]],outline);
    ctx.restore();}
    const middleTop=[712,263.5],middleBottom=[712,418];
    const leaves=[[outline[0],middleTop,middleBottom,outline[3]],[middleTop,outline[1],outline[2],middleBottom]];
    if(!casements){
      // Keep the original wooden sash, but glass reflects light rather than carrying
      // a second baked moon/tree scene when the sash turns away from the sky.
      casements=document.createElement('canvas');casements.width=1672;casements.height=760;const g=casements.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);
      for(const poly of [ [[679,258],[707,267],[707,319],[679,310]], [[679,319],[707,329],[707,409],[679,399]], [[717,271],[745,280],[745,332],[717,323]], [[717,333],[745,342],[745,423],[717,413]] ]){
        g.beginPath();poly.forEach(([x,y],i)=>i?g.lineTo(x+836,y):g.moveTo(x+836,y));g.closePath();
        const shine=g.createLinearGradient(1510,0,1585,0);shine.addColorStop(0,'#36567b');shine.addColorStop(.45,'#243950');shine.addColorStop(1,'#486584');g.fillStyle=shine;g.fill();
      }
    }
    // A recessed opening and a projecting sill remain fixed to the wall.
    if(pass!=='front'){ctx.strokeStyle='#271e31';ctx.lineWidth=5;ctx.beginPath();outline.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.stroke();windowSill(ctx);windowSill(ctx,'lip');}
    for(const i of pass==='back'?[0]:pass==='front'?[1]:[1,0]){
      const source=leaves[i],dest=casementGeometry(i,open);
      // Solid wood has a second face and edge thickness, not just an outlined quad.
      const back=dest.map(([x,y])=>[x+5,y+2.7]);
      for(let j=0;j<4;j++){
        const next=(j+1)%4;ctx.fillStyle=j===0?'#91677a':j===1?'#432d3d':'#604253';
        ctx.beginPath();[dest[j],dest[next],back[next],back[j]].forEach((p,k)=>k?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill();
      }
      quad(ctx,casements,source.map(([x,y])=>[x+836,y]),dest);
      ctx.strokeStyle='#644356';ctx.lineWidth=4.5;ctx.beginPath();dest.forEach((p,n)=>n?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.stroke();
      ctx.strokeStyle='#b09675';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(...dest[0]);ctx.lineTo(...dest[1]);ctx.stroke();
      const hinge=dest[i===0?0:1];ctx.fillStyle='#c0a06a';for(const y of [25,122])ctx.fillRect(hinge[0]-1.5,hinge[1]+y,3,7);
    }
  }
  return {resetTextures:()=>{casements=null;},depth,quad,book,reading,readingPageGeometry,window,windowSill,pages,casementGeometry};
})();
if(typeof module!=='undefined')module.exports=RoomVisuals;
