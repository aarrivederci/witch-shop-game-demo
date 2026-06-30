/* ═══════════════════════════════════════════════════════
   WITCH SHOP GAME - Order System (多单词拼写版)

   【玩法改造】
   - 每个订单携带 words[]（N个随机单词）和 currentWordIndex（当前拼写第几个）
   - progress 表示当前单词的已输入字符数
   - processKey(key)：
     ✓ 匹配当前单词的下一个字符 → progress++
     ✓ 当前单词拼完（progress === currentWord.length）→ currentWordIndex++，progress=0
     ✓ 所有单词拼完（currentWordIndex === words.length）→ 订单完成
     ✗ 不匹配 → progress 重置为 0（重新拼写当前单词）
   - totalClicks = 所有单词的字母总数
═══════════════════════════════════════════════════════ */

const Orders = (() => {
  let _orders = [];
  let _activeOrderId = null;
  let _onComplete = null;
  let _onFail     = null;
  let _onUpdate   = null;
  let _onKeyResult = null; // (hit: bool) => void — 通知 game 字母是否匹配
  let _tickInterval = null;

  const TICK_MS = 100;

  /* ─── INIT ─── */
  function init({ onComplete, onFail, onUpdate, onKeyResult }) {
    _onComplete  = onComplete;
    _onFail      = onFail;
    _onUpdate    = onUpdate;
    _onKeyResult = onKeyResult || null;
    _tickInterval = setInterval(_tick, TICK_MS);
  }

  /* ─── STOP ─── */
  function stop() {
    if (_tickInterval) { clearInterval(_tickInterval); _tickInterval = null; }
    _orders = [];
    _activeOrderId = null;
  }

  /* ─── ADD ORDER ─── */
  function addOrder(order) {
    if (isFull()) return false;
    
    // 价格先增加单词数量，上限为5；更高价格改为提升单词难度。
    const wordCount = Math.min(5, Math.max(1, Math.floor(order.reward / 30)));
    const minDifficulty = _getMinDifficulty(order.reward);
    
    // 从词库获取随机单词
    order.words = WordBank.getRandomWords(wordCount, { minDifficulty });
    order.currentWordIndex = 0;
    order.progress = 0;
    
    // 计算总字母数
    order.totalClicks = order.words.reduce((sum, w) => sum + w.word.length, 0);
    
    _orders.push(order);
    if (_onUpdate) _onUpdate();
    return true;
  }

  function _getMinDifficulty(reward) {
    if (reward >= 180) return 3;
    if (reward >= 90) return 2;
    return 1;
  }

  /* ─── IS FULL ─── */
  function isFull() { return _orders.length >= getMaxOrders(); }

  /* ─── GET ORDERS ─── */
  function getOrders() { return [..._orders]; }

  /* ─── GET ACTIVE ORDER ─── */
  function getActiveOrder() {
    const active = _orders.find(o => o.id === _activeOrderId && o.status === 'pending');
    return active || _orders.find(o => o.status === 'pending') || null;
  }

  function _getExpectedKey(order) {
    const currentWord = order.words && order.words[order.currentWordIndex];
    if (!currentWord || !currentWord.word) return null;
    const progress = typeof order.progress === 'number' ? order.progress : 0;
    return currentWord.word[progress] ? currentWord.word[progress].toLowerCase() : null;
  }

  function _pickOrderForKey(key) {
    const pending = _orders.filter(o => o.status === 'pending');
    if (!pending.length) return null;

    const active = getActiveOrder();
    if (active && _getExpectedKey(active) === key) return active;

    return pending.find(o => _getExpectedKey(o) === key) || null;
  }

  /* ─── PROCESS KEY ──────────────────────────────────────
     返回 'hit' | 'miss' | 'none'
  ─────────────────────────────────────────────────────── */
  function processKey(key) {
    const normalizedKey = (key || '').toLowerCase();
    const order = _pickOrderForKey(normalizedKey);
    const activeOrder = getActiveOrder();
    if (!order && !activeOrder) return 'none';

    if (!order) {
      if (activeOrder) activeOrder.progress = 0;
      if (_onUpdate) _onUpdate();
      if (_onKeyResult) _onKeyResult(false);
      return 'miss';
    }

    _activeOrderId = order.id;

    // 获取当前要拼写的单词
    const currentWord = order.words[order.currentWordIndex];
    if (!currentWord) return 'none';

    const expected = currentWord.word[order.progress].toLowerCase();
    if (normalizedKey === expected) {
      order.progress++;
      
      // 当前单词拼写完成
      if (order.progress >= currentWord.word.length) {
        order.currentWordIndex++;
        order.progress = 0;
        
        // 所有单词都拼完了 → 订单完成
        if (order.currentWordIndex >= order.words.length) {
          _completeOrder(order);
        } else {
          // 还有下一个单词
          if (_onUpdate) _onUpdate();
        }
      } else {
        if (_onUpdate) _onUpdate();
      }
      
      if (_onKeyResult) _onKeyResult(true);
      return 'hit';
    } else {
      // 拼写错误：重置当前单词的进度
      order.progress = 0;
      if (_onUpdate) _onUpdate();
      if (_onKeyResult) _onKeyResult(false);
      return 'miss';
    }
  }

  /* ─── TICK (timer) ─── */
  function _tick() {
    const expired = [];
    for (let i = 0; i < _orders.length; i++) {
      const o = _orders[i];
      if (o.status !== 'pending') continue;
      o.elapsed += TICK_MS;
      if (o.elapsed >= o.timerMs) expired.push(o);
    }
    expired.forEach(o => _failOrder(o));
    if (_onUpdate) _onUpdate();
  }

  /* ─── COMPLETE ORDER ─── */
  function _completeOrder(order) {
    order.status = 'success';
    _orders = _orders.filter(o => o.id !== order.id);
    if (_activeOrderId === order.id) _activeOrderId = null;
    addCoins(order.reward);
    State.ordersCompleted++;
    recordOrderCompletion(order);
    bumpStat('customersServed');

    const statMap = {
      potions:    'potionsBrewed',
      divination: 'divinationsDone',
      charms:     'charmsMade',
      alchemy:    'alchemyDone',
    };
    if (statMap[order.module]) bumpStat(statMap[order.module]);

    saveState();
    if (_onComplete) _onComplete(order);
    if (_onUpdate)   _onUpdate();
  }

  /* ─── FAIL ORDER ─── */
  function _failOrder(order) {
    order.status = 'failed';
    _orders = _orders.filter(o => o.id !== order.id);
    if (_activeOrderId === order.id) _activeOrderId = null;
    State.ordersFailed++;
    bumpStat('customersLost');
    saveState();
    if (_onFail) _onFail(order);
  }

  /* ─── PUBLIC ─── */
  return { init, stop, addOrder, isFull, getOrders, getActiveOrder, processKey };
})();
