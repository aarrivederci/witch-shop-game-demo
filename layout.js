/* Viewport shell: the room and writing desk never leave their own regions. */
const Layout = (() => {
  let readyFlag = false, previousFocus;
  const el = id => document.getElementById(id);
  function close(restore = true) {
    el('right-column').hidden = true;
    el('work-upper').classList.remove('panel-open');
    document.querySelectorAll('[data-panel]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-expanded', 'false'); });
    if (restore && previousFocus?.isConnected) previousFocus.focus();
  }
  function open(panel) {
    if (!readyFlag) return;
    if (el('right-column').hidden) previousFocus = document.activeElement;
    RoomScene.pause();
    el('scene-hint').textContent='正在阅读 · 订单已暂停；关闭页面后可回柜台继续。';
    el('station-title').textContent = {modules:'配方手册',shop:'小店事务',story:'故事档案',stats:'成长记录',music:'漂浮音乐盒'}[panel];
    el('right-column').hidden = false;
    el('work-upper').classList.add('panel-open');
    document.querySelectorAll('[data-panel]').forEach(b => b.setAttribute('aria-expanded', String(b.dataset.panel === panel)));
    el('panel-close').focus({preventScroll:true});
  }
  function init() {
    const desk = document.createElement('section');
    desk.id = 'work-desk'; desk.setAttribute('aria-label','订单与打字操作台');
    desk.innerHTML = '<div class="desk-heading"><span class="eyebrow">THE WRITING DESK</span><h2>小店手记</h2><p>接待客人，拼写一份魔法。</p></div><div id="work-upper"></div>';
    el('game-layout').append(desk);
    el('work-upper').append(el('service-bar'),el('orders-section'),el('right-column'),el('product-unlock-modal'));
    desk.append(el('keyboard-zone'));
    const frame = document.createElement('div'); frame.className = 'room-frame';
    el('scene-viewport').before(frame); frame.append(el('scene-viewport'));
    const panel = el('right-column'); panel.setAttribute('role','dialog'); panel.setAttribute('aria-modal','false'); panel.setAttribute('aria-labelledby','station-title');
    const button = document.createElement('button'); button.id='panel-close'; button.textContent='关闭 ×'; button.setAttribute('aria-label','关闭面板，返回订单');
    panel.querySelector('.panel-heading').append(button);
    button.addEventListener('click',()=>close());
    document.addEventListener('keydown',e=>{if(e.key==='Escape' && el('product-unlock-modal').classList.contains('hidden') && !panel.hidden){e.preventDefault();close();}});
    el('scene-stage').addEventListener('pointerdown',()=>close(false));
    document.querySelectorAll('[data-panel]').forEach(b=>b.setAttribute('aria-controls','right-column'));
    document.querySelector('.reading-note').textContent='阅读期间暂停接单';
    document.querySelector('[data-panel="shop"]').textContent='🏪 店务';
    const fit = () => {
      const rect=frame.getBoundingClientRect(), width=Math.max(0,Math.min(rect.width,rect.height*836/760));
      el('scene-viewport').style.width=width+'px'; el('scene-viewport').style.height=width*760/836+'px';
    };
    new ResizeObserver(fit).observe(frame);
    const resize = () => document.documentElement.style.setProperty('--app-height',(window.visualViewport?.height || innerHeight)+'px');
    window.visualViewport?.addEventListener('resize',resize); window.addEventListener('resize',resize); resize();
    close(false);
  }
  document.addEventListener('DOMContentLoaded',init);
  return {open,close,ready(){readyFlag=true;close(false);}};
})();
