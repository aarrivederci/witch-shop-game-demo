/* One audio element across both rooms. Preferences never modify game saves. */
const MusicBox = (() => {
  const key = 'witchShopMusic_v1';
  const tracks = [{id:'sunlight',title:'Sunlight on the Kettle',src:'assets/music/sunlight-on-the-kettle.mp3'}];
  let audio, index=0, enabled=false, volume=.35, message='', request=0;
  const el=id=>document.getElementById(id);
  function save(){try{localStorage.setItem(key,JSON.stringify({enabled,volume,track:tracks[index].id}));}catch{}}
  function update(){
    el('music-toggle').textContent=enabled?'关闭音乐':'开启音乐';
    el('music-toggle').setAttribute('aria-pressed',String(enabled));
    el('music-now').textContent=tracks[index].title;
    el('music-resume').hidden=!(enabled&&audio.paused);
    el('music-status').textContent=message || (enabled ? (audio.paused?'等待播放':'正在播放 · 单曲循环'):'音乐已关闭');
    el('music-volume-value').textContent=Math.round(volume*100)+'%';
    el('music-tracks').value=String(index);
    el('music-prev').disabled=el('music-next').disabled=tracks.length<2;
    el('music-quick').textContent=enabled?'♫ 音乐':'♪ 音乐';
  }
  async function play(){
    const ticket=++request; message='';
    if(!enabled||document.hidden){audio.pause();update();return;}
    try{if(audio.error)audio.load();await audio.play();if(ticket!==request&&!enabled)audio.pause();}
    catch(e){if(ticket!==request)return;message=e.name==='NotAllowedError'?'点击「开始播放」让旋律响起。':'音频暂时无法播放，请切换曲目或重试。';}
    if(ticket===request)update();
  }
  function choose(next){index=(next+tracks.length)%tracks.length;request++;audio.pause();audio.src=tracks[index].src;save();play();}
  function init(){
    if(audio)return;
    try{const p=JSON.parse(localStorage.getItem(key)||'{}');enabled=p.enabled===true;volume=typeof p.volume==='number'&&Number.isFinite(p.volume)?Math.max(0,Math.min(1,p.volume)):.35;index=Math.max(0,tracks.findIndex(t=>t.id===p.track));}catch{}
    audio=document.createElement('audio');audio.id='background-music';audio.loop=true;audio.preload='metadata';audio.volume=volume;audio.src=tracks[index].src;document.body.append(audio);
    const select=el('music-tracks');
    const addOption=(track,i)=>{const o=document.createElement('option');o.value=i;o.textContent=track.title;select.append(o);};tracks.forEach(addOption);
    el('music-toggle').onclick=()=>{enabled=!enabled;save();play();};
    el('music-resume').onclick=()=>{enabled=true;save();play();};
    select.onchange=()=>choose(Number(select.value));
    el('music-prev').onclick=()=>choose(index-1);el('music-next').onclick=()=>choose(index+1);
    el('music-volume').value=volume;
    el('music-volume').oninput=e=>{volume=Number(e.target.value);audio.volume=volume;save();update();};
    el('music-files').onchange=e=>{
      const files=[...e.target.files].filter(f=>f.type.startsWith('audio/')||/\.(mp3|ogg|wav|m4a|aac|flac)$/i.test(f.name));
      for(const file of files){const track={id:'local-'+tracks.length,title:file.name.replace(/\.[^.]+$/,''),src:URL.createObjectURL(file)};tracks.push(track);addOption(track,tracks.length-1);}
      message=files.length?'已加入 '+files.length+' 首曲目，可在列表中切换。':'请选择音频文件。';e.target.value='';update();
    };
    audio.addEventListener('playing',()=>{message='';update();});
    audio.addEventListener('error',()=>{message='这首音频无法读取，请切换曲目或重试。';update();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){++request;audio.pause();update();}else if(enabled)play();});
    document.addEventListener('pointerdown',()=>{if(enabled)play();},{once:true});
    document.addEventListener('keydown',()=>{if(enabled&&audio.paused)play();},{once:true});
    update();
  }
  // Small code-native pixel prop: brass music box, floating crystal and musical sparks.
  function draw(ctx,time,reduced){
    const bob=reduced?0:Math.sin(time/1100)*3;
    ctx.save();ctx.translate(231,363+bob);ctx.lineJoin='miter';ctx.lineWidth=2;
    ctx.fillStyle='#b191bf30';ctx.beginPath();ctx.ellipse(0,37-bob,23,6,0,0,Math.PI*2);ctx.fill();
    const poly=(points,fill)=>{ctx.fillStyle=fill;ctx.strokeStyle='#3c263c';ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();ctx.stroke();};
    poly([[-23,6],[3,-4],[25,5],[0,16]],'#b7834d');
    poly([[-23,6],[0,16],[0,31],[-23,20]],'#57334c');
    poly([[0,16],[25,5],[25,19],[0,31]],'#382638');
    ctx.strokeStyle='#e3b86e';ctx.beginPath();ctx.moveTo(-20,16);ctx.lineTo(-3,23);ctx.moveTo(4,23);ctx.lineTo(21,16);ctx.stroke();
    ctx.save();ctx.shadowColor='#caa9ff';ctx.shadowBlur=enabled?12:3;
    poly([[0,-27],[9,-13],[0,4],[-9,-13]],enabled?'#d4b9f0':'#856f9c');
    poly([[0,-27],[9,-13],[0,4],[2,-12]],'#9673b8');ctx.restore();
    ctx.strokeStyle='#dab879';ctx.beginPath();ctx.ellipse(0,-12,17,5,-.25,0,Math.PI*2);ctx.stroke();
    if(enabled&&!audio?.paused){for(let i=0;i<3;i++){const drift=reduced?i*7:(time/90+i*12)%38;ctx.fillStyle='#f3dca2';ctx.fillRect(17+i*5,-18-drift,3,3);ctx.fillRect(19+i*5,-25-drift,2,8);}}
    ctx.restore();
  }
  return {init,draw};
})();
