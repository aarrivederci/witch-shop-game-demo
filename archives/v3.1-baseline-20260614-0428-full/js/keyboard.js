/* ═══════════════════════════════════════════════════════
   WITCH SHOP GAME - Input Handler (英语单词拼写版)

   【玩法】
   - 监听键盘 keydown，将字母字符传给 onKeyCallback(key)
   - game.js 中 _onKey(key) → Orders.processKey(key)
   - Orders 负责字母序列匹配逻辑
═══════════════════════════════════════════════════════ */

const Keyboard = (() => {
  let _enabled = true;
  let _onKeyCallback = null;

  /* ─── INIT ─── */
  function init(onKeyCallback) {
    _onKeyCallback = onKeyCallback;
    document.addEventListener('keydown', _handleKey);
  }

  function enable()  { _enabled = true; }
  function disable() { _enabled = false; }

  /* ─── KEY HANDLER ─── */
  function _handleKey(e) {
    if (!_enabled) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    // 只接受单个字母
    if (!/^[a-zA-Z]$/.test(e.key)) return;

    const key = e.key.toLowerCase();
    if (_onKeyCallback) _onKeyCallback(key);
    bumpStat('totalKeyPresses');
  }

  /* ─── PUBLIC ─── */
  return { init, enable, disable };
})();
