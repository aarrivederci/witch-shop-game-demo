/* Screen-space navigation. Feet collide with footprints, not tall visual silhouettes. */
const RoomNavigation = (() => {
  const inside=(p,poly)=>{let v=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1]) && p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])v=!v;}return v;};
  function create(floor,blocks,step=10){
    const valid=p=>inside(p,floor)&&!blocks.some(b=>inside(p,b));
    const nodes=[];const map=new Map();
    for(let y=350;y<730;y+=step)for(let x=30;x<810;x+=step)if(valid([x,y])){const n=[x,y];nodes.push(n);map.set(n.join(','),n);}
    const nearest=p=>nodes.reduce((a,b)=>Math.hypot(b[0]-p[0],b[1]-p[1])<Math.hypot(a[0]-p[0],a[1]-p[1])?b:a,nodes[0]);
    const visible=(a,b)=>{const count=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])*4));for(let i=0;i<=count;i++)if(!valid([a[0]+(b[0]-a[0])*i/count,a[1]+(b[1]-a[1])*i/count]))return false;return true;};
    function route(start,end){
      const a=nearest(start),b=nearest(end),key=n=>n.join(','),queue=[a],prev=new Map([[key(a),null]]);
      for(let i=0;i<queue.length;i++){const n=queue[i];if(key(n)===key(b))break;for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step],[step,step],[-step,step],[step,-step],[-step,-step]]){const next=map.get([n[0]+dx,n[1]+dy].join(','));const corner=dx&&dy&&(!valid([n[0]+dx,n[1]])||!valid([n[0],n[1]+dy]));if(next&&!corner&&!prev.has(key(next))&&visible(n,next)){prev.set(key(next),n);queue.push(next);}}}
      if(!prev.has(key(b)))return [];
      const result=[];for(let n=b;n;n=prev.get(key(n)))result.unshift(n);
      // Remove stair-step turns only when the entire straight segment is clear.
      const smooth=[result[0]];for(let i=0;i<result.length-1;){let j=result.length-1;while(j>i+1&&!visible(result[i],result[j]))j--;smooth.push(result[j]);i=j;}return smooth;
    }
    return {valid,nearest,route,nodes};
  }
  return {inside,create};
})();
if(typeof module!=='undefined')module.exports=RoomNavigation;
