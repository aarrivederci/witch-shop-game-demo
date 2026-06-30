/* ═══════════════════════════════════════════════════════
   WITCH SHOP GAME - UI Manager (英语单词拼写版)

   【改动说明】
   - updateKeyboardZone：显示待拼写单词，字母逐个高亮
     已输入字母 = 绿色，当前待输入 = 闪烁，未输入 = 暗色
   - 订单卡片：显示单词+释义+字母进度
   - flashKey(key, hit)：匹配时绿色闪光，错误时红色抖动
═══════════════════════════════════════════════════════ */

const UI = (() => {

  let _activePanel = 'modules';
  let _keyPop = null;
  let _keyPopTimer = null;

  /* ─── INIT ─── */
  function init() {
    _bindNavButtons();
    refreshHeader();
    switchPanel('modules');
  }

  /* ─── NAV BUTTONS ─── */
  function _bindNavButtons() {
    document.querySelectorAll('[data-panel]').forEach(btn => {
      btn.addEventListener('click', () => switchPanel(btn.dataset.panel));
    });
  }

  /* ─── SWITCH PANEL ─── */
  function switchPanel(panel) {
    _activePanel = panel;
    document.querySelectorAll('[data-panel]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.panel === panel);
    });
    document.querySelectorAll('.side-panel').forEach(p => {
      p.classList.toggle('hidden', p.id !== `panel-${panel}`);
    });
    if (panel === 'modules') Modules.render();
    if (panel === 'shop')    Shop.render();
    if (panel === 'story')   Story.render();
    if (panel === 'stats')   _renderStats();
  }

  /* ─── REFRESH HEADER ─── */
  function refreshHeader() {
    const coinsEl = document.getElementById('hud-coins');
    if (coinsEl) coinsEl.textContent = `🪙 ${State.coins}`;

    const phaseEl = document.getElementById('hud-phase');
    if (phaseEl) phaseEl.textContent = `阶段 ${State.phase}`;

    const earnedEl = document.getElementById('hud-earned');
    if (earnedEl) earnedEl.textContent = `总收入 🪙${State.totalEarned}`;

    const progressEl = document.getElementById('phase-progress');
    if (progressEl) {
      const pct = Math.min(100, (State.totalEarned / getNextPhaseThreshold()) * 100);
      progressEl.style.width = `${pct}%`;
    }
  }

  /* ─── RENDER ORDERS ─── */
  function renderOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;
    container.innerHTML = '';

    const activeOrders = Orders.getOrders();
    if (!activeOrders.length) {
      container.innerHTML = '<div class="orders-empty">🌙 等待顾客……</div>';
      return;
    }
    activeOrders.forEach(order => container.appendChild(_buildOrderCard(order)));
  }

  /* ─── BUILD ORDER CARD ─── */
  function _buildOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    card.dataset.id = order.id;

    const timerPct = Math.max(0, 100 - (order.elapsed / order.timerMs) * 100);
    const isUrgent = timerPct < 25;
    if (isUrgent) card.classList.add('urgent');

    const activeOrder = Orders.getActiveOrder();
    const isActive = activeOrder && activeOrder.id === order.id;
    if (isActive) card.classList.add('active-order');

    // 多单词渲染：显示所有单词及当前进度
    const words = order.words || [];
    const currentIndex = order.currentWordIndex || 0;
    const progress = order.progress || 0;
    const showMeaning = isActive || isShopPurchased('hint_show');
    
    const wordsHtml = words.map((wordObj, idx) => {
      const word = wordObj.word || '';
      const meaning = wordObj.meaning || '';
      const isCurrent = idx === currentIndex;
      const isDone = idx < currentIndex;
      
      // 字母高亮
      const letterSpans = word.split('').map((ch, i) => {
        let cls = 'word-letter';
        if (isDone) {
          cls += ' letter-done';
        } else if (isCurrent && i < progress) {
          cls += ' letter-done';
        } else if (isCurrent && i === progress && isActive) {
          cls += ' letter-current';
        } else {
          cls += ' letter-pending';
        }
        return `<span class="${cls}"><span class="word-letter-glyph">${formatWordLetter(word, i)}</span></span>`;
      }).join('');
      
      // 单词状态标记
      let statusIcon = '';
      if (isDone) statusIcon = '✓';
      else if (isCurrent) statusIcon = '▶';
      
      // 释义显示
      const meaningHtml = (showMeaning && meaning)
        ? `<span class="word-meaning">（${meaning}）</span>`
        : '';
      
      return `<div class="word-row ${isCurrent ? 'current-word' : ''} ${isDone ? 'done-word' : ''}">
        <span class="word-status">${statusIcon}</span>
        <span class="word-letters">${letterSpans}</span>
        ${meaningHtml}
      </div>`;
    }).join('');
    
    const progressText = `${currentIndex + 1}/${words.length}`;
    const customerMeta = order.isSpecialNpc
      ? `<span class="order-special-tag">熟客 · ${order.bondLabel || `羁绊${order.bondLevel || 0}`}</span>`
      : '<span class="order-special-tag order-general-tag">普通来客</span>';

    card.innerHTML = `
      <div class="order-icon">${order.recipe.icon}</div>
      <div class="order-info">
        <div class="order-brief">
          <div class="order-name">${order.recipe.name} <span class="order-progress">${progressText}</span></div>
          <div class="order-customer">${order.customer.emoji} ${order.customer.name} ${customerMeta} — "${order.dialogue}"</div>
        </div>
        <div class="order-words-container">${wordsHtml}</div>
      </div>
      <div class="order-reward">🪙${order.reward}</div>
      <div class="order-timer-bar ${isUrgent ? 'urgent' : ''}" style="width:${timerPct}%"></div>
    `;
    return card;
  }

  /* ─── STATS PANEL ─── */
  function _renderStats() {
    const container = document.getElementById('panel-stats');
    if (!container) return;
    const s = State.stats;
    const currentFormat = State.settings.wordDisplayFormat;
    const formatText = currentFormat === 'uppercase' ? '全大写' : '首字母大写';
    
    container.innerHTML = `
      <h3 class="panel-title">📊 统计数据</h3>
      <div class="stats-grid">
        <div class="stat-item"><span class="stat-label">服务顾客</span><span class="stat-value">${s.customersServed}</span></div>
        <div class="stat-item"><span class="stat-label">流失顾客</span><span class="stat-value">${s.customersLost}</span></div>
        <div class="stat-item"><span class="stat-label">总按键数</span><span class="stat-value">${s.totalKeyPresses}</span></div>
        <div class="stat-item"><span class="stat-label">药水炼制</span><span class="stat-value">${s.potionsBrewed}</span></div>
        <div class="stat-item"><span class="stat-label">占卜次数</span><span class="stat-value">${s.divinationsDone}</span></div>
        <div class="stat-item"><span class="stat-label">符咒制作</span><span class="stat-value">${s.charmsMade}</span></div>
        <div class="stat-item"><span class="stat-label">炼金次数</span><span class="stat-value">${s.alchemyDone}</span></div>
        <div class="stat-item"><span class="stat-label">总收入</span><span class="stat-value">🪙${State.totalEarned}</span></div>
      </div>
      <div class="settings-section" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(157, 78, 221, 0.3);">
        <h3 class="panel-title">⚙️ 设置</h3>
        <div class="setting-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(157, 78, 221, 0.1); border-radius: 8px; margin-top: 10px;">
          <span class="setting-label" style="color: #c77dff;">单词显示格式</span>
          <button id="btn-toggle-word-format" class="pixel-btn" style="min-width: 120px;">${formatText}</button>
        </div>
        <p style="font-size: 12px; color: #9d4edd; margin-top: 8px; opacity: 0.8;">点击按钮切换单词的显示格式（输入时大小写均可识别）</p>
      </div>
    `;
    
    // 绑定切换按钮事件
    const toggleBtn = document.getElementById('btn-toggle-word-format');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        toggleWordDisplayFormat();
        _renderStats(); // 重新渲染以更新按钮文本
        renderOrders(); // 重新渲染订单以应用新格式
        const activeOrder = Orders.getActiveOrder();
        updateKeyboardZone(activeOrder); // 更新键盘区域
        showToast(`单词显示格式已切换为：${State.settings.wordDisplayFormat === 'uppercase' ? '全大写' : '首字母大写'}`, 'success');
      });
    }
  }

  /* ─── TOAST NOTIFICATIONS ─── */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
  }

  /* ─── FLASH ORDER RESULT ─── */
  function flashOrderResult(order, success) {
    const roomArea = document.getElementById('room-area');
    if (!roomArea) return;
    const flash = document.createElement('div');
    flash.className = `order-flash ${success ? 'flash-success' : 'flash-fail'}`;
    const completedWords = Array.isArray(order.words)
      ? order.words.map(w => formatWordDisplay(w && w.word)).filter(Boolean).join(' / ')
      : '';
    flash.textContent = success
      ? `✨ +🪙${order.reward} ${order.recipe.name}${completedWords ? ` [${completedWords}]` : ''}`
      : `💨 ${order.customer.name} 离开了……`;
    roomArea.appendChild(flash);
    requestAnimationFrame(() => flash.classList.add('visible'));
    setTimeout(() => {
      flash.classList.remove('visible');
      flash.addEventListener('transitionend', () => flash.remove());
    }, 1800);
  }

  /* ─── UPDATE KEYBOARD ZONE ──────────────────────────────
     显示当前活跃订单的单词拼写区（多单词版）：
     - 大字显示当前单词，已输入字母绿色，当前字母闪烁，待输入暗色
     - 下方显示中文释义（帮助学习）
     - 进度条跟随全部单词进度
  ─────────────────────────────────────────────────────── */
  function updateKeyboardZone(order) {
    const titleEl    = document.getElementById('kz-title');
    const seqEl      = document.getElementById('kz-sequence-display');
    const fillEl     = document.getElementById('kz-progress-fill');
    const feedbackEl = document.getElementById('kz-feedback');

    if (!order) {
      if (titleEl)    titleEl.textContent = '⌨️ 等待顾客……';
      if (seqEl)      seqEl.innerHTML     = '<span class="kz-hint">等待顾客下单，届时在此输入对应英文单词</span>';
      if (fillEl)     fillEl.style.width  = '0%';
      if (feedbackEl) feedbackEl.textContent = '';
      return;
    }

    const words = order.words || [];
    const currentIndex = order.currentWordIndex || 0;
    const currentWord = words[currentIndex];
    
    if (titleEl) {
      const progressText = `(${currentIndex + 1}/${words.length})`;
      titleEl.textContent = `⌨️ 正在制作：${order.recipe.icon} ${order.recipe.name} ${progressText}`;
    }

    // 大字母拼写显示（当前单词）
    if (seqEl && currentWord) {
      const word = currentWord.word || '';
      const meaning = currentWord.meaning || '';
      const progress = order.progress || 0;
      
      const letters = word.split('').map((ch, i) => {
        let cls = 'kz-letter';
        if (i < progress) {
          cls += ' kz-done';
          if (_consumePoppingLetter(order.id, currentIndex, i)) cls += ' kz-pop';
        }
        else if (i === progress) cls += ' kz-current';
        else cls += ' kz-pending';
        return `<span class="${cls}"><span class="kz-letter-glyph">${formatWordLetter(word, i)}</span></span>`;
      }).join('');

      const meaningHtml = meaning ? `<div class="kz-meaning">📖 ${meaning}</div>` : '';
      seqEl.innerHTML = `<div class="kz-word-display">${letters}</div>${meaningHtml}`;
    }

    // 进度条（全部单词的总进度）
    if (fillEl) {
      const totalLetters = order.totalClicks || 1;
      const progress = typeof order.progress === 'number' ? order.progress : 0;
      let completedLetters = 0;
      for (let i = 0; i < currentIndex; i++) {
        completedLetters += words[i].word.length;
      }
      completedLetters += progress;
      const pct = Math.round((completedLetters / totalLetters) * 100);
      fillEl.style.width = `${pct}%`;
    }

    // 反馈提示
    if (feedbackEl && !feedbackEl._flashPending && currentWord) {
      const remaining = currentWord.word.length - (order.progress || 0);
      feedbackEl.textContent = order.progress > 0
        ? `已输入 ${order.progress} 个字母，还剩 ${remaining} 个`
        : `请拼写：${formatWordDisplay(currentWord.word)}`;
    }
  }

  /* ─── FLASH KEY ─────────────────────────────────────────
     hit=true：绿色正确闪光
     hit=false：红色错误抖动 + 进度重置提示
  ─────────────────────────────────────────────────────── */
  function flashKey(key, hit) {
    const feedbackEl = document.getElementById('kz-feedback');
    if (!feedbackEl) return;

    feedbackEl._flashPending = true;
    clearTimeout(feedbackEl._timer);

    if (hit) {
      _markPoppingLetter();
      feedbackEl.textContent = `✅ ${formatWordDisplay(key)} — 正确！`;
      feedbackEl.style.color = '#4ade80';
    } else {
      _clearPoppingLetter();
      feedbackEl.textContent = `❌ ${formatWordDisplay(key)} — 错误，重新拼写！`;
      feedbackEl.style.color = '#f87171';
      // 抖动动画
      const kzZone = document.getElementById('keyboard-zone');
      if (kzZone) {
        kzZone.classList.add('shake');
        setTimeout(() => kzZone.classList.remove('shake'), 400);
      }
    }

    feedbackEl._timer = setTimeout(() => {
      feedbackEl._flashPending = false;
      feedbackEl.style.color = '';
      const activeOrder = Orders.getActiveOrder();
      if (activeOrder && activeOrder.words) {
        const currentWord = activeOrder.words[activeOrder.currentWordIndex || 0];
        if (currentWord) {
          const remaining = currentWord.word.length - (activeOrder.progress || 0);
          feedbackEl.textContent = activeOrder.progress > 0
            ? `已输入 ${activeOrder.progress} 个字母，还剩 ${remaining} 个`
            : `请拼写：${formatWordDisplay(currentWord.word)}`;
        }
      } else {
        feedbackEl.textContent = '';
      }
    }, 600);
  }

  function _markPoppingLetter() {
    const activeOrder = Orders.getActiveOrder();
    if (!activeOrder) return;

    const progress = activeOrder.progress || 0;
    if (progress <= 0) return;

    _keyPop = {
      orderId: activeOrder.id,
      wordIndex: activeOrder.currentWordIndex || 0,
      letterIndex: progress - 1,
    };

    clearTimeout(_keyPopTimer);
    _keyPopTimer = setTimeout(() => {
      _keyPop = null;
    }, 360);
  }

  function _clearPoppingLetter() {
    clearTimeout(_keyPopTimer);
    _keyPop = null;
  }

  function _consumePoppingLetter(orderId, wordIndex, letterIndex) {
    const matched = _keyPop &&
      _keyPop.orderId === orderId &&
      _keyPop.wordIndex === wordIndex &&
      _keyPop.letterIndex === letterIndex;
    if (matched) _clearPoppingLetter();
    return matched;
  }

  /* 兼容旧调用 */
  function flashHit() { flashKey('', true); }

  /* ─── PHASE UP BANNER ─── */
  function showPhaseUp(phase) {
    const overlay = document.getElementById('phase-overlay');
    if (!overlay) return;
    const msg = overlay.querySelector('.phase-message');
    if (msg) msg.textContent = `🌟 进入阶段 ${phase} — 新顾客与配方已解锁！`;
    overlay.classList.remove('hidden');
    overlay.classList.add('show');
    setTimeout(() => {
      overlay.classList.remove('show');
      overlay.addEventListener('transitionend', () => overlay.classList.add('hidden'), { once: true });
    }, 3500);
  }

  /* ─── PUBLIC ─── */
  return {
    init,
    switchPanel,
    refreshHeader,
    renderOrders,
    updateKeyboardZone,
    flashKey,
    flashHit,
    showToast,
    flashOrderResult,
    showPhaseUp,
  };
})();
