/* ═══════════════════════════════════════════════════════
   WITCH SHOP GAME - Game Coordinator (英语单词拼写版)

   【改动说明】
   - _onKey(key)：接收 Keyboard 传来的字母
   - Orders.processKey(key) 返回 'hit' | 'miss' | 'none'
   - UI.flashKey(key, hit)：正确=绿色，错误=红色抖动
   - onKeyResult 回调：更新键盘区显示
═══════════════════════════════════════════════════════ */

const Game = (() => {

  /* ─── DOM READY ENTRY POINT ─── */
  async function init() {
    if (typeof WordBank !== 'undefined' && WordBank.waitForLoad) {
      await WordBank.waitForLoad();
    }

    initState();
    if (State.witchName) {
      _startGame();
    } else {
      _showNameScreen();
    }
  }

  /* ─── NAME SCREEN ─── */
  function _showNameScreen() {
    const screenName = document.getElementById('screen-name');
    const screenGame = document.getElementById('screen-game');
    const btn        = document.getElementById('btn-start-game');
    const input      = document.getElementById('witch-name-input');

    if (screenName) screenName.classList.remove('hidden');
    if (screenGame) screenGame.classList.add('hidden');

    if (btn) {
      btn.addEventListener('click', () => {
        const name = (input ? input.value.trim() : '') || '艾露娜';
        State.witchName = name;
        saveState();
        _startGame();
      });
    }

    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') btn && btn.click();
      });
      input.focus();
    }
  }

  /* ─── TRANSITION TO GAME ─── */
  function _startGame() {
    const screenName = document.getElementById('screen-name');
    const screenGame = document.getElementById('screen-game');

    if (screenName) screenName.classList.add('hidden');
    if (screenGame) screenGame.classList.remove('hidden');

    const nameEl = document.getElementById('hud-witch-name');
    if (nameEl) nameEl.textContent = State.witchName;

    const witchLabel = document.getElementById('witch-label');
    if (witchLabel) witchLabel.textContent = State.witchName;

    _bootSystems();
  }

  /* ─── BOOT ALL GAME SYSTEMS ─── */
  function _bootSystems() {
    // 1. Canvas 渲染器
    Renderer.init();

    // 2. UI（导航、Header、面板）
    UI.init();

    // 3. 订单系统（增加 onKeyResult 回调）
    Orders.init({
      onComplete:   _onOrderComplete,
      onFail:       _onOrderFail,
      onUpdate:     _onOrdersChanged,
      onKeyResult:  _onKeyResult,
    });

    // 4. 顾客生成器
    Customers.init(_onNewOrder);

    // 5. 键盘输入 — 回调改为 _onKey(key)
    Keyboard.init(_onKey);

    // 6. 初始渲染
    Modules.render();
    Story.render();
    Story.checkUnlocks();
    UI.renderOrders();
    UI.refreshHeader();
    UI.updateKeyboardZone(null);

    // 7. 首次运行自动解锁 Tier-1 药水配方
    const allUnlocked = POTIONS.filter(p => p.tier === 1).every(p => isRecipeUnlocked(p.id));
    if (!allUnlocked) {
      POTIONS.filter(p => p.tier === 1).forEach(p => unlockRecipe(p.id));
    }

    // 8. 本地 QA / 调试辅助：仅挂到控制台，不新增正式 UI
    _installDebugTools();

    console.log('%c🧙 Witch Shop Game ready! ' + State.witchName, 'color:#c77dff;font-size:14px;');
  }

  /* ─── LOCAL QA / DEBUG HELPERS ─── */
  function _installDebugTools() {
    if (typeof window === 'undefined') return;

    const refresh = () => {
      _checkPhaseUp();
      Story.checkUnlocks();
      Story.render();
      Shop.render();
      Modules.render();
      UI.refreshHeader();
      UI.renderOrders();
      UI.updateKeyboardZone(Orders.getActiveOrder());
      return status();
    };

    const normalizeAmount = (value, fallback = 1) => {
      const amount = Number(value);
      if (!Number.isFinite(amount) || amount <= 0) return fallback;
      return Math.floor(amount);
    };

    const ensureShopTraits = () => {
      if (!State.shopTraits || typeof State.shopTraits !== 'object') {
        State.shopTraits = { comfort: 0, wisdom: 0, mystery: 0, fame: 0 };
      }
      return State.shopTraits;
    };

    const status = () => ({
      coins: State.coins,
      totalEarned: State.totalEarned,
      phase: State.phase,
      customersLost: (State.stats && State.stats.customersLost) || 0,
      ordersCompleted: State.ordersCompleted || 0,
      ordersFailed: State.ordersFailed || 0,
      coinsSpentTotal: getCoinSpendTotal(),
      storyStats: JSON.parse(JSON.stringify((State && State.storyStats) || {})),
      shopTraits: Object.assign({}, State.shopTraits || {}),
      storyUnlocked: [...(State.storyUnlocked || [])],
    });

    window.WitchDebug = {
      status,

      addLostCustomers(amount = 1) {
        const value = normalizeAmount(amount);
        bumpStat('customersLost', value);
        State.ordersFailed = (State.ordersFailed || 0) + value;
        saveState();
        return refresh();
      },

      addLostOrderRecord(identityId, amount = 1, bucket = 'lostOrdersByIdentity') {
        const key = String(identityId || '').trim();
        if (!key || typeof ensureStoryStats !== 'function') return status();
        const storyStats = ensureStoryStats();
        const statBucket = storyStats[bucket] ? bucket : 'lostOrdersByIdentity';
        storyStats[statBucket][key] = (storyStats[statBucket][key] || 0) + normalizeAmount(amount);
        saveState();
        return refresh();
      },

      setBondLevel(roleId, level = 2) {
        const targetRoleId = String(roleId || '').trim();
        const targetLevel = Math.max(0, Math.floor(Number(level) || 0));
        const threshold = (BOND_LEVELS || []).find(item => item.level === targetLevel);
        if (!targetRoleId || !threshold) return status();
        if (!State.bonds) State.bonds = {};
        const current = State.bonds[targetRoleId] || { exp: 0, gifts: 0, coinsSpent: 0 };
        State.bonds[targetRoleId] = Object.assign({}, current, { exp: Math.max(current.exp || 0, threshold.exp) });
        saveState();
        return refresh();
      },

      unlockInvestment(investmentId = 'private_workroom') {
        const key = String(investmentId || '').trim();
        if (!key) return status();
        if (!State.shopInvestments) State.shopInvestments = {};
        State.shopInvestments[key] = true;
        saveState();
        return refresh();
      },

      prepareAnotherSide(roleId = 'knight') {
        const presets = {
          knight: { bucket: 'lostOrdersByIdentity', key: 'knight' },
          demon: { bucket: 'lostOrdersByRole', key: 'demon' },
          fairy: { bucket: 'lostOrdersByRole', key: 'fairy' },
          vampire: { bucket: 'lostOrdersByRole', key: 'vampire' },
          necromancer: { bucket: 'lostOrdersByRole', key: 'necromancer' },
          ghost: { bucket: 'lostOrdersByRole', key: 'ghost' },
        };
        const targetRoleId = String(roleId || '').trim();
        const preset = presets[targetRoleId];
        if (!preset) return status();
        this.unlockInvestment('private_workroom');
        this.setBondLevel(targetRoleId, 2);
        this.addLostOrderRecord(preset.key, 1, preset.bucket);
        Story.checkUnlocks();
        Story.render();
        return status();
      },

      addCoins(amount = 1000) {
        addCoins(normalizeAmount(amount, 1000));
        return refresh();
      },

      spendCoins(amount = 100, category = 'debug', itemId = 'debug_story_spend') {
        const value = normalizeAmount(amount, 100);
        if (State.coins < value) addCoins(value - State.coins);
        spendCoins(value, category, itemId);
        return refresh();
      },

      setShopTrait(key, value = 1) {
        const traits = ensureShopTraits();
        const traitKey = String(key || '').trim();
        if (!traitKey) return status();
        traits[traitKey] = Math.max(0, Math.floor(Number(value) || 0));
        saveState();
        return refresh();
      },

      addShopTrait(key, amount = 1) {
        const traits = ensureShopTraits();
        const traitKey = String(key || '').trim();
        if (!traitKey) return status();
        traits[traitKey] = Math.max(0, (Number(traits[traitKey]) || 0) + normalizeAmount(amount));
        saveState();
        return refresh();
      },

      setStat(key, value = 0) {
        if (!State.stats || typeof State.stats !== 'object') return status();
        const statKey = String(key || '').trim();
        if (!statKey || !(statKey in State.stats)) return status();
        State.stats[statKey] = Math.max(0, Math.floor(Number(value) || 0));
        saveState();
        return refresh();
      },

      checkStories() {
        Story.checkUnlocks();
        Story.render();
        return status();
      },

      refresh,
    };

    console.log('%c🧪 WitchDebug ready. Try WitchDebug.status() or WitchDebug.addLostCustomers(8).', 'color:#8ecae6;');
  }

  /* ─── NEW ORDER FROM CUSTOMER ─── */
  function _onNewOrder(order) {
    const accepted = Orders.addOrder(order);
    if (!accepted) return;
    UI.renderOrders();
    UI.updateKeyboardZone(Orders.getActiveOrder());
  }

  /* ═══════════════════════════════════════════════════════
     【核心】_onKey(key)
     Keyboard 每次捕获到字母按键时调用
     → Orders.processKey(key) 判断是否匹配
     → 'hit'  : 字母正确，更新显示
     → 'miss' : 字母错误，重置进度，红色反馈
     → 'none' : 当前无订单
  ═══════════════════════════════════════════════════════ */
  function _onKey(key) {
    const result = Orders.processKey(key);

    if (result === 'hit') {
      UI.flashKey(key, true);
      UI.renderOrders();
      UI.updateKeyboardZone(Orders.getActiveOrder());
      if (typeof Renderer.setWitchState === 'function') {
        Renderer.setWitchState('working');
      }
    } else if (result === 'miss') {
      UI.flashKey(key, false);
      UI.renderOrders();
      UI.updateKeyboardZone(Orders.getActiveOrder());
    }
    // 'none'：无订单时忽略
  }

  /* ─── KEY RESULT CALLBACK (from Orders) ─── */
  // Orders 内部已通过 processKey 完成了逻辑；
  // 此回调为扩展预留，当前由 _onKey 直接处理
  function _onKeyResult(hit) { /* 预留 */ }

  /* ─── ORDER COMPLETE ─── */
  function _onOrderComplete(order) {
    UI.flashOrderResult(order, true);
    UI.refreshHeader();
    UI.renderOrders();
    UI.updateKeyboardZone(Orders.getActiveOrder());
    Shop.render();

    if (typeof Renderer.setWitchState === 'function') {
      Renderer.setWitchState('success');
    }

    // 订单完成后，请求快速生成下一个订单
    Customers.requestQuickSpawn();

    _checkPhaseUp();
    Story.checkUnlocks();
  }

  /* ─── ORDER FAILED ─── */
  function _onOrderFail(order) {
    UI.flashOrderResult(order, false);
    UI.renderOrders();
    UI.updateKeyboardZone(Orders.getActiveOrder());
  }

  /* ─── ORDERS STATE CHANGED (timer tick) ─── */
  function _onOrdersChanged() {
    UI.renderOrders();
    UI.updateKeyboardZone(Orders.getActiveOrder());
  }

  /* ─── PHASE UP CHECK ─── */
  function _checkPhaseUp() {
    if (State.phase >= MAX_PHASE) return;
    const threshold = getNextPhaseThreshold();
    if (State.totalEarned >= threshold) {
      advancePhase();
      UI.showPhaseUp(State.phase);
      UI.refreshHeader();
      Shop.render();
      Modules.render();
      Story.checkUnlocks();
    }
  }

  /* ─── PUBLIC ─── */
  return { init };
})();

/* ─── START ON DOM READY ─── */
document.addEventListener('DOMContentLoaded', Game.init);
