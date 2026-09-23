/* One audio element across both rooms. Preferences never modify game saves. */
const MusicBox = (() => {
  const key = 'witchShopMusic_v1';
  const tracks = [{id:'sunlight',title:'Sunlight on the Kettle',src:'assets/music/sunlight-on-the-kettle.mp3'}];
  const boxArt = new Image();
  boxArt.src = 'assets/music-box-tilted.png';
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
  // The box moves independently of its stable desk shadow. The source crop omits
  // the concept sheet's baked shadow, leaving the approved box art untouched.
  function draw(ctx,time,reduced){
    const playing=enabled&&!audio?.paused;
    const bob=reduced?0:Math.sin(time/900)*1.5;
    const pulse=reduced?0:Math.sin(time/650)*.04;
    ctx.save();
    ctx.fillStyle=`rgba(44,27,64,${.17+pulse})`;
    ctx.beginPath();ctx.ellipse(255,378,16,3,0,0,Math.PI*2);ctx.fill();
    if(boxArt.complete&&boxArt.naturalWidth){
      ctx.imageSmoothingEnabled=true;
      ctx.drawImage(boxArt,280,62,1050,820,231,332+bob,48,37);
    }
    if(playing){
      const glow=reduced?.45:.38+.14*Math.sin(time/370);
      ctx.strokeStyle=`rgba(186,130,235,${glow})`;
      ctx.lineWidth=1.1;ctx.setLineDash([5,3]);
      ctx.beginPath();ctx.ellipse(255,376,14,2,-.08,.1,Math.PI*1.2);ctx.stroke();ctx.setLineDash([]);
      for(let i=0;i<3;i++){
        const drift=reduced?0:(time/65+i*13)%18;
        const x=235+i*16,y=341+(i%2)*10-drift;
        ctx.fillStyle=`rgba(246,211,152,${reduced?.65:.45+.35*Math.sin(time/300+i)**2})`;
        ctx.fillRect(x,y,2,2);
      }
    }
    const note=(x,y,alpha)=>{
      ctx.fillStyle=`rgba(238,202,139,${alpha})`;
      ctx.fillRect(x,y+10,5,3);ctx.fillRect(x+4,y+1,2,11);
      ctx.fillRect(x+6,y+1,5,2);ctx.fillRect(x+9,y+3,2,3);
    };
    const rise=playing&&!reduced?(time/95)%15:0;
    note(248,315-rise,playing?.85:.36);
    if(playing)note(268,307-(reduced?0:(time/115+7)%17),.65);
    ctx.restore();
  }
  return {init,draw};
})();
