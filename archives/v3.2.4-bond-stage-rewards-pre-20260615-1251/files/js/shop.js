/* ═══════════════════════════════════════════════════════
   WITCH SHOP GAME - Shop Panel
   Renders and handles the upgrade/unlock shop
═══════════════════════════════════════════════════════ */

const Shop = (() => {

  /* ─── RENDER ─── */
  function render() {
    _renderShopTabs();
    _renderShopContent();
  }

  /* ─── TABS ─── */
  function _renderShopTabs() {
    document.querySelectorAll('#shop-tabs .shop-tab').forEach(btn => {
      const key = btn.dataset.shop;
      btn.classList.toggle('active', key === State.activeShopTab);
      if (!btn._shopBound) {
        btn._shopBound = true;
        btn.addEventListener('click', () => {
          State.activeShopTab = btn.dataset.shop;
          render();
        });
      }
    });
  }

  /* ─── CONTENT ─── */
  function _renderShopContent() {
    const container = document.getElementById('shop-content');
    if (!container) return;
    container.innerHTML = '';
    container.classList.toggle('shop-content-bond', State.activeShopTab === 'bond');

    if (State.activeShopTab === 'unlock') {
      _renderUnlockItems(container);
    } else if (State.activeShopTab === 'bond') {
      _renderBondItems(container);
    } else if (State.activeShopTab === 'investments') {
      _renderInvestmentItems(container);
    } else {
      _renderUpgradeItems(container);
    }
  }

  /* ─── UNLOCK ITEMS ─── */
  function _renderUnlockItems(container) {
    SHOP_UNLOCKS.forEach(item => {
      if (item.phase > State.phase) return; // not visible yet
      const purchased = isShopPurchased(item.id);
      const card = _buildShopCard({
        item,
        purchased,
        onBuy: () => _buyUnlock(item),
      });
      container.appendChild(card);
    });

    if (!container.children.length) {
      container.innerHTML = '<div class="shop-empty">暂无可用解锁项目</div>';
    }
  }

  /* ─── UPGRADE ITEMS ─── */
  function _renderUpgradeItems(container) {
    SHOP_UPGRADES.forEach(item => {
      if (item.phase > State.phase) return;
      const purchased = isShopPurchased(item.id);
      const card = _buildShopCard({
        item,
        purchased,
        onBuy: () => _buyUpgrade(item),
      });
      container.appendChild(card);
    });

    if (!container.children.length) {
      container.innerHTML = '<div class="shop-empty">暂无可用升级项目</div>';
    }
  }

  /* ─── INVESTMENT ITEMS ─── */
  function _renderInvestmentItems(container) {
    const intro = document.createElement('div');
    intro.className = 'bond-shop-intro shop-investment-intro';
    intro.innerHTML = `
      <strong>店铺投资</strong><br>
      把金币投入环境、知识与名声。投资会提升店铺气质，并解锁店铺故事或后续隐藏路线。<br>
      <span>舒适 ${getShopTrait('comfort')} · 知识 ${getShopTrait('wisdom')} · 神秘 ${getShopTrait('mystery')} · 名声 ${getShopTrait('fame')} · 已消费 ${getCoinSpendTotal('investment')} 金币</span>
    `;
    container.appendChild(intro);

    SHOP_INVESTMENTS.forEach(item => {
      if (item.phase > State.phase) return;
      const purchased = isShopInvestmentPurchased(item.id);
      const card = _buildInvestmentCard(item, purchased);
      container.appendChild(card);
    });

    if (container.children.length === 1) {
      container.innerHTML = '<div class="shop-empty">暂无可用店铺投资</div>';
    }
  }

  function _buildInvestmentCard(item, purchased) {
    const traitText = Object.entries(item.traits || {})
      .map(([key, value]) => `${_getTraitLabel(key)} +${value}`)
      .join(' · ');
    return _buildShopCard({
      item: {
        ...item,
        desc: `${item.desc}${traitText ? `（${traitText}）` : ''}`,
      },
      purchased,
      onBuy: () => _buyInvestment(item),
    });
  }

  /* ─── BOND ITEMS ─── */
  function _renderBondItems(container) {
    const roles = CUSTOMER_TYPES.filter(role => role.phase <= State.phase);
    if (!roles.length) {
      container.innerHTML = '<div class="shop-empty">还没有可以建立羁绊的角色</div>';
      return;
    }

    const intro = document.createElement('div');
    intro.className = 'bond-shop-intro';
    intro.textContent = '选择一位熟客进行拜访，查看羁绊、订单与故事目标，再挑选最适合他的礼物。连续赠送同一礼物会降低羁绊收益。';
    container.appendChild(intro);

    if (!State.activeBondRoleId || !roles.some(role => role.id === State.activeBondRoleId)) {
      State.activeBondRoleId = roles[0].id;
    }

    const layout = document.createElement('div');
    layout.className = 'bond-visit-layout';

    const roleGrid = document.createElement('div');
    roleGrid.className = 'bond-character-grid';
    roles.forEach(role => {
      roleGrid.appendChild(_buildBondRoleChip(role));
    });
    layout.appendChild(roleGrid);

    const activeRole = roles.find(role => role.id === State.activeBondRoleId) || roles[0];
    layout.appendChild(_buildBondDetailPanel(activeRole));
    container.appendChild(layout);
  }

  function _buildBondRoleChip(role) {
    const btn = document.createElement('button');
    const level = getBondLevel(role.id);
    const next = _getNextRoleStoryTarget(role.id);
    const isActive = role.id === State.activeBondRoleId;
    btn.className = `bond-character-chip ${isActive ? 'active' : ''}`;
    btn.innerHTML = `
      <span class="bond-chip-emoji">${role.emoji}</span>
      <span class="bond-chip-main">
        <strong>${role.charName || role.name}</strong>
        <small>${role.name} · Lv.${level}</small>
      </span>
      ${next ? `<span class="bond-chip-story">${next.index}/8</span>` : '<span class="bond-chip-story done">✓</span>'}
    `;
    btn.addEventListener('click', () => {
      const roleGridScrollTop = _getBondRoleGridScrollTop(btn);
      State.activeBondRoleId = role.id;
      saveState();
      render();
      _restoreBondRoleGridScrollTop(roleGridScrollTop);
    });
    return btn;
  }

  function _getBondRoleGridScrollTop(sourceEl = document) {
    const roleGrid = sourceEl && sourceEl.closest
      ? sourceEl.closest('.bond-character-grid')
      : document.querySelector('.bond-character-grid');
    return roleGrid ? roleGrid.scrollTop : 0;
  }

  function _restoreBondRoleGridScrollTop(scrollTop) {
    requestAnimationFrame(() => {
      const roleGrid = document.querySelector('.bond-character-grid');
      if (roleGrid) roleGrid.scrollTop = scrollTop;
    });
  }

  function _buildBondDetailPanel(role) {
    const panel = document.createElement('div');
    panel.className = 'bond-selected-panel';

    const level = getBondLevel(role.id);
    const exp = getBondExp(role.id);
    const stats = getBondGiftStats(role.id);
    const current = _getBondThreshold(level);
    const next = getNextBondThreshold(role.id);
    const label = _getBondLabel(level);
    const pct = Number.isFinite(next)
      ? Math.min(100, Math.round(((exp - current) / Math.max(1, next - current)) * 100))
      : 100;
    const storyTarget = _getNextRoleStoryTarget(role.id);
    const orders = getOrderCompletionCount({ identity: role.id, personality: role.personality });

    panel.innerHTML = `
      <div class="bond-selected-header">
        <div class="bond-selected-avatar">${role.emoji}</div>
        <div>
          <div class="bond-selected-name">${role.charName || role.name}</div>
          <div class="bond-selected-subtitle">${role.name} · ${_getPersonalityLabel(role.personality)}</div>
        </div>
        <div class="bond-role-level">Lv.${level} ${label}</div>
      </div>
      <div class="bond-progress"><div class="bond-progress-fill" style="width:${pct}%"></div></div>
      <div class="bond-progress-text">羁绊 ${exp}${Number.isFinite(next) ? ` / ${next}` : ' / MAX'}</div>
      <div class="bond-stats-row">
        <span>📦 完成订单 <strong>${orders}</strong></span>
        <span>🎁 已送礼 <strong>${stats.gifts}</strong></span>
        <span>🪙 花费 <strong>${stats.coinsSpent}</strong></span>
      </div>
      <div class="bond-story-target ${storyTarget && storyTarget.ready ? 'ready' : ''}">
        ${_formatStoryTarget(storyTarget)}
      </div>
      <div class="bond-gift-recommendations"></div>
    `;

    const giftList = panel.querySelector('.bond-gift-recommendations');
    _getSortedGiftsForRole(role).forEach(gift => {
      giftList.appendChild(_buildGiftButton(role, gift));
    });
    _getSortedProductGiftsForRole(role).forEach(product => {
      giftList.appendChild(_buildProductGiftButton(role, product));
    });
    return panel;
  }

  function _buildGiftButton(role, gift) {
    const btn = document.createElement('button');
    const canAfford = State.coins >= gift.cost;
    const pref = _getGiftPreference(role, gift);
    const repeat = _getRepeatGiftInfo(role.id, gift.id);
    const finalExp = _getGiftExp(role, gift, repeat.multiplier);
    btn.className = `bond-gift-btn bond-gift-${pref.tier} gift-rarity-${gift.rarity || 'common'} ${canAfford ? '' : 'disabled'}`;
    btn.innerHTML = `
      <span class="gift-main"><span>${gift.icon} ${gift.name}</span><em>${gift.category || '礼物'} · ${pref.label}</em></span>
      <small>+${finalExp} 羁绊 · 🪙${gift.cost}${repeat.label ? ` · ${repeat.label}` : ''}</small>
      <span class="gift-desc">${gift.desc}</span>
    `;
    btn.title = `${gift.desc}\n${role.charName || role.name}对这份礼物的反应：${pref.label}${repeat.label ? `\n${repeat.label}` : ''}`;
    if (canAfford) {
      btn.addEventListener('click', () => _buyBondGift(role, gift));
    }
    return btn;
  }

  function _buyBondGift(role, gift) {
    const roleGridScrollTop = _getBondRoleGridScrollTop();
    const before = getBondLevel(role.id);
    if (!spendCoins(gift.cost, 'bond', gift.id)) {
      UI.showToast('金币不足！', 'error');
      return;
    }
    const repeat = _getRepeatGiftInfo(role.id, gift.id);
    const finalExp = _getGiftExp(role, gift, repeat.multiplier);
    const pref = _getGiftPreference(role, gift);
    addBondExp(role.id, finalExp);
    recordBondGift(role.id, gift.id, gift.cost);
    const after = getBondLevel(role.id);

    UI.showToast(`${gift.icon} ${role.charName || role.name}${pref.reaction}${gift.name}！羁绊 +${finalExp}${repeat.label ? `（${repeat.label}）` : ''}`, after > before ? 'story' : 'success');
    if (after > before) UI.showToast(`💞 ${role.charName || role.name} 羁绊提升到 Lv.${after}`, 'story');
    render();
    _restoreBondRoleGridScrollTop(roleGridScrollTop);
    UI.refreshHeader();
    Story.checkUnlocks();
  }

  function _buildProductGiftButton(role, product) {
    const btn = document.createElement('button');
    const cost = _getProductGiftCost(product);
    const canAfford = State.coins >= cost;
    const pref = _getProductGiftPreference(role, product);
    const giftKey = `product:${product.id}`;
    const repeat = _getRepeatGiftInfo(role.id, giftKey);
    const finalExp = _getProductGiftExp(role, product, repeat.multiplier);
    btn.className = `bond-gift-btn bond-gift-${pref.tier} gift-rarity-product ${canAfford ? '' : 'disabled'}`;
    btn.innerHTML = `
      <span class="gift-main"><span>${product.icon} ${product.name}</span><em>商品样品 · ${pref.label}</em></span>
      <small>+${finalExp} 羁绊 · 🪙${cost}${repeat.label ? ` · ${repeat.label}` : ''}</small>
      <span class="gift-desc">${product.intro || product.desc || '把店里的招牌商品作为特别样品赠出。'}</span>
    `;
    btn.title = `${product.desc || product.name}\n${role.charName || role.name}对这份商品样品的反应：${pref.label}${repeat.label ? `\n${repeat.label}` : ''}`;
    if (canAfford) {
      btn.addEventListener('click', () => _buyProductGift(role, product));
    }
    return btn;
  }

  function _buyProductGift(role, product) {
    const roleGridScrollTop = _getBondRoleGridScrollTop();
    const before = getBondLevel(role.id);
    const cost = _getProductGiftCost(product);
    if (!spendCoins(cost, 'productGift', product.id)) {
      UI.showToast('金币不足！', 'error');
      return;
    }
    const repeat = _getRepeatGiftInfo(role.id, `product:${product.id}`);
    const finalExp = _getProductGiftExp(role, product, repeat.multiplier);
    const pref = _getProductGiftPreference(role, product);
    addBondExp(role.id, finalExp);
    recordProductBondGift(role.id, product.id, product.giftTags || [], cost, product.legacyGiftId || product.id);
    const after = getBondLevel(role.id);

    UI.showToast(`${product.icon} ${role.charName || role.name}${pref.reaction}${product.name}样品！羁绊 +${finalExp}${repeat.label ? `（${repeat.label}）` : ''}`, after > before ? 'story' : 'success');
    if (after > before) UI.showToast(`💞 ${role.charName || role.name} 羁绊提升到 Lv.${after}`, 'story');
    render();
    _restoreBondRoleGridScrollTop(roleGridScrollTop);
    UI.refreshHeader();
    Story.checkUnlocks();
  }

  function _getSortedGiftsForRole(role) {
    return BOND_GIFTS
      .filter(gift => gift.phase <= State.phase)
      .slice()
      .sort((a, b) => {
        const prefDiff = _getGiftPreference(role, b).multiplier - _getGiftPreference(role, a).multiplier;
        if (prefDiff !== 0) return prefDiff;
        const affordDiff = (State.coins >= b.cost ? 1 : 0) - (State.coins >= a.cost ? 1 : 0);
        if (affordDiff !== 0) return affordDiff;
        return a.cost - b.cost;
      });
  }

  function _getSortedProductGiftsForRole(role) {
    return _getGiftableProducts()
      .slice()
      .sort((a, b) => {
        const prefDiff = _getProductGiftPreference(role, b).multiplier - _getProductGiftPreference(role, a).multiplier;
        if (prefDiff !== 0) return prefDiff;
        const affordDiff = (State.coins >= _getProductGiftCost(b) ? 1 : 0) - (State.coins >= _getProductGiftCost(a) ? 1 : 0);
        if (affordDiff !== 0) return affordDiff;
        return _getProductGiftCost(a) - _getProductGiftCost(b);
      });
  }

  function _getGiftableProducts() {
    const groups = [
      { module: 'potions', items: POTIONS },
      { module: 'divination', items: DIVINATIONS },
      { module: 'charms', items: CHARMS },
      { module: 'alchemy', items: ALCHEMY },
    ];
    return groups.flatMap(group => {
      if (!State.modules[group.module]) return [];
      return (group.items || [])
        .filter(product => product.giftable && isRecipeUnlocked(product.id))
        .map(product => Object.assign({ sourceModule: group.module }, product));
    });
  }

  function _getGiftExp(role, gift, repeatMultiplier = 1) {
    const pref = _getGiftPreference(role, gift);
    return Math.max(1, Math.round(gift.exp * pref.multiplier * repeatMultiplier));
  }

  function _getProductGiftExp(role, product, repeatMultiplier = 1) {
    const pref = _getProductGiftPreference(role, product);
    return Math.max(1, Math.round((product.giftBaseExp || 1) * pref.multiplier * repeatMultiplier));
  }

  function _getProductGiftCost(product) {
    if (typeof product.giftCost === 'number') return product.giftCost;
    return Math.max(10, Math.round((product.price || 20) * 0.6));
  }

  function _getRepeatGiftInfo(roleId, giftId) {
    const stats = getBondGiftStats(roleId);
    if (stats.lastGiftId !== giftId) return { multiplier: 1, label: '' };
    if ((stats.repeatGiftStreak || 0) <= 1) return { multiplier: 0.6, label: '重复收益60%' };
    return { multiplier: 0.35, label: '重复收益35%' };
  }

  function _getGiftPreference(role, gift) {
    const prefs = role.giftPreferences || {};
    const multiplier = Number(prefs[gift.id] || 1);
    if (multiplier >= 1.5) return { multiplier, tier: 'favorite', label: '最爱', reaction: '最喜欢' };
    if (multiplier >= 1.2) return { multiplier, tier: 'liked', label: '喜欢', reaction: '很喜欢' };
    if (multiplier < 1) return { multiplier, tier: 'plain', label: '一般', reaction: '收下了' };
    return { multiplier, tier: 'normal', label: '普通', reaction: '喜欢' };
  }

  function _getProductGiftPreference(role, product) {
    const prefs = role.productGiftPreferences || {};
    const tags = product.giftTags || [];
    const tagMultiplier = tags.reduce((best, tag) => Math.max(best, Number(prefs[tag] || 1)), 1);
    const multiplier = Number(prefs[product.id] || tagMultiplier || 1);
    if (multiplier >= 1.5) return { multiplier, tier: 'favorite', label: '最爱', reaction: '最喜欢' };
    if (multiplier >= 1.2) return { multiplier, tier: 'liked', label: '喜欢', reaction: '很喜欢' };
    if (multiplier < 1) return { multiplier, tier: 'plain', label: '一般', reaction: '收下了' };
    return { multiplier, tier: 'normal', label: '普通', reaction: '喜欢' };
  }

  function _getNextRoleStoryTarget(roleId) {
    const entries = (STORY_ENTRIES || []).filter(entry => entry.roleId === roleId);
    const next = entries.find(entry => !State.storyUnlocked.includes(entry.id));
    if (!next) return null;
    const conditions = _getStoryTargetConditions(next, roleId);
    return {
      index: entries.indexOf(next) + 1,
      title: next.title || '新的故事',
      conditions,
      ready: conditions.length ? conditions.every(item => item.ok) : true,
    };
  }

  function _formatStoryTarget(target) {
    if (!target) return '📖 该角色的故事已全部解锁。';
    const conditionText = target.conditions.length
      ? target.conditions.map(item => item.text).join('，')
      : '暂无额外条件';
    return `📖 下个故事：${target.title}（${conditionText}）${target.ready ? ' · 可解锁' : ''}`;
  }

  function _getStoryTargetConditions(entry, roleId) {
    const conditions = [];
    if (entry.unlockOrders) conditions.push(_getStoryOrderCondition(entry.unlockOrders, roleId));
    if (entry.unlockBond) conditions.push(_getStoryBondCondition(entry.unlockBond, roleId));
    if (entry.unlockGifts) conditions.push(..._getStoryGiftConditions(entry.unlockGifts, roleId));
    if (entry.unlockPhase != null) conditions.push(_getSimpleStoryCondition('店铺阶段', State.phase, entry.unlockPhase));
    if (entry.unlockCoins != null) conditions.push(_getSimpleStoryCondition('累计金币', State.totalEarned, entry.unlockCoins));
    if (entry.unlockStats) conditions.push(..._getStoryStatConditions(entry.unlockStats));
    if (entry.unlockShopTraits) conditions.push(..._getStoryShopTraitConditions(entry.unlockShopTraits));
    return conditions.filter(Boolean);
  }

  function _getStoryOrderCondition(condition, roleId) {
    const role = CUSTOMER_TYPES.find(item => item.id === roleId);
    const orderCondition = Object.assign({ identity: roleId, personality: role && role.personality }, condition);
    const current = getOrderCompletionCount(orderCondition);
    const required = Math.max(1, Number(condition.count) || 1);
    return _getSimpleStoryCondition('订单', current, required);
  }

  function _getStoryBondCondition(condition, roleId) {
    const targetRoleId = condition.roleId || roleId;
    const current = getBondLevel(targetRoleId);
    const required = Math.max(0, Number(condition.level) || 0);
    return {
      text: `羁绊 Lv.${Math.min(current, required)} / Lv.${required}`,
      ok: current >= required,
    };
  }

  function _getStoryGiftConditions(condition = {}, roleId) {
    const targetRoleId = condition.roleId || roleId;
    const conditions = [];
    if (!targetRoleId) return conditions;

    if (condition.count != null) {
      conditions.push(_getSimpleStoryCondition('赠送礼物', getBondGiftCount(targetRoleId), Math.max(1, Number(condition.count) || 1)));
    }

    if (condition.giftId) {
      const gift = _findGiftLikeItem(condition.giftId);
      const label = gift ? `赠送${gift.name}` : '指定礼物';
      conditions.push(_getSimpleStoryCondition(label, getBondGiftCount(targetRoleId, condition.giftId), Math.max(1, Number(condition.giftCount) || 1)));
    }

    if (condition.productId) {
      const product = _findProductById(condition.productId);
      const label = product ? `赠送${product.name}样品` : '指定商品样品';
      conditions.push(_getSimpleStoryCondition(label, getBondProductGiftCount(targetRoleId, condition.productId), Math.max(1, Number(condition.productCount) || 1)));
    }

    if (condition.giftTag) {
      conditions.push(_getSimpleStoryCondition('赠送契合礼物', getBondGiftTagCount(targetRoleId, condition.giftTag), Math.max(1, Number(condition.tagCount) || 1)));
    }

    return conditions;
  }

  function _findProductById(productId) {
    return [...POTIONS, ...DIVINATIONS, ...CHARMS, ...ALCHEMY].find(item => item.id === productId);
  }

  function _findGiftLikeItem(giftId) {
    return (BOND_GIFTS || []).find(item => item.id === giftId)
      || [...POTIONS, ...DIVINATIONS, ...CHARMS, ...ALCHEMY].find(item => item.id === giftId || item.legacyGiftId === giftId)
      || (typeof BOND_GIFT_LABELS !== 'undefined' && BOND_GIFT_LABELS[giftId] ? { name: BOND_GIFT_LABELS[giftId] } : null);
  }

  function _getSimpleStoryCondition(label, current, required) {
    const currentValue = Number(current) || 0;
    const requiredValue = Number(required) || 0;
    return {
      text: `${label} ${Math.min(currentValue, requiredValue)} / ${requiredValue}`,
      ok: currentValue >= requiredValue,
    };
  }

  function _getStoryStatConditions(stats = {}) {
    const labelMap = {
      customersLost: '流失顾客',
      customersServed: '服务顾客',
      ordersCompleted: '完成订单',
      ordersFailed: '失败订单',
      coinsSpentOnBond: '羁绊消费',
      coinsSpentTotal: '累计消费金币',
    };
    const conditions = [];
    Object.entries(stats).forEach(([key, value]) => {
      if (key.endsWith('Min')) {
        const statKey = key.slice(0, -3);
        conditions.push(_getSimpleStoryCondition(labelMap[statKey] || statKey, _getStoryStatValue(statKey), value));
      } else if (key.endsWith('Max')) {
        const statKey = key.slice(0, -3);
        const current = _getStoryStatValue(statKey);
        const required = Number(value) || 0;
        conditions.push({
          text: `${labelMap[statKey] || statKey}不高于 ${current} / ${required}`,
          ok: current <= required,
        });
      }
    });
    return conditions;
  }

  function _getStoryStatValue(key) {
    if (key === 'ordersCompleted') return State.ordersCompleted || 0;
    if (key === 'ordersFailed') return State.ordersFailed || 0;
    if (key === 'coinsSpentOnBond') {
      return Object.values(State.bonds || {}).reduce((sum, record) => sum + (record.coinsSpent || 0), 0);
    }
    if (key === 'coinsSpentTotal') return getCoinSpendTotal();
    return (State.stats && Number(State.stats[key])) || 0;
  }

  function _getStoryShopTraitConditions(traits = {}) {
    const labelMap = { comfort: '店铺舒适', wisdom: '店铺知识', mystery: '店铺神秘', fame: '店铺名声' };
    const conditions = [];
    Object.entries(traits).forEach(([key, value]) => {
      if (key.endsWith('Min')) {
        const traitKey = key.slice(0, -3);
        conditions.push(_getSimpleStoryCondition(labelMap[traitKey] || traitKey, getShopTrait(traitKey), value));
      }
    });
    return conditions;
  }

  function _getPersonalityLabel(personality) {
    return (PERSONALITY_TRAITS && PERSONALITY_TRAITS[personality] && PERSONALITY_TRAITS[personality].label) || '熟客';
  }

  function _getBondThreshold(level) {
    const item = BOND_LEVELS.find(b => b.level === level);
    return item ? item.exp : 0;
  }

  function _getBondLabel(level) {
    const item = BOND_LEVELS.find(b => b.level === level);
    return item ? item.label : '羁绊';
  }

  /* ─── BUILD CARD ─── */
  function _buildShopCard({ item, purchased, onBuy }) {
    const card = document.createElement('div');
    card.className = 'shop-card' + (purchased ? ' purchased' : '');

    const canAfford = State.coins >= item.cost;

    card.innerHTML = `
      <div class="shop-card-icon">${item.icon}</div>
      <div class="shop-card-info">
        <div class="shop-card-name">${item.name}</div>
        <div class="shop-card-desc">${item.desc}</div>
      </div>
      <div class="shop-card-right">
        ${purchased
          ? '<span class="shop-purchased-badge">✅ 已购</span>'
          : `<button class="shop-buy-btn ${canAfford ? '' : 'disabled'}" ${purchased ? 'disabled' : ''}>
               🪙${item.cost}
             </button>`
        }
      </div>
    `;

    if (!purchased) {
      const btn = card.querySelector('.shop-buy-btn');
      if (btn && canAfford) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          onBuy();
        });
      } else if (btn) {
        btn.title = '金币不足';
      }
    }

    return card;
  }

  /* ─── BUY UNLOCK ─── */
  function _buyUnlock(item) {
    if (isShopPurchased(item.id)) return;
    if (!spendCoins(item.cost, 'unlock', item.id)) {
      UI.showToast('金币不足！', 'error');
      return;
    }
    purchaseShopItem(item.id);
    unlockModule(item.module);

    // Switch to new module tab
    State.activeModule = item.module;

    // Unlock default recipes for module
    _autoUnlockTier1(item.module);

    UI.showToast(`🎉 解锁了 ${item.name}！`, 'success');
    render();
    Modules.render();
    UI.refreshHeader();

    // Check story entries
    Story.checkUnlocks();
  }

  /* ─── BUY UPGRADE ─── */
  function _buyUpgrade(item) {
    if (isShopPurchased(item.id)) return;
    if (!spendCoins(item.cost, 'upgrade', item.id)) {
      UI.showToast('金币不足！', 'error');
      return;
    }
    purchaseShopItem(item.id);
    activateUpgrade(item.effect);

    // auto_recipes effect: unlock all tier-1 recipes for all unlocked modules
    if (item.effect === 'auto_recipes') {
      Object.keys(State.modules).forEach(mod => {
        if (State.modules[mod]) _autoUnlockTier1(mod);
      });
    }

    UI.showToast(`⬆️ 升级：${item.name} 已激活！`, 'success');
    render();
    Modules.render();
    UI.refreshHeader();
  }

  /* ─── BUY INVESTMENT ─── */
  function _buyInvestment(item) {
    if (isShopInvestmentPurchased(item.id)) return;
    if (!spendCoins(item.cost, 'investment', item.id)) {
      UI.showToast('金币不足！', 'error');
      return;
    }
    purchaseShopInvestment(item);

    UI.showToast(`🏪 店铺投资完成：${item.name}`, 'success');
    render();
    UI.refreshHeader();
    Story.checkUnlocks();
  }

  function _getTraitLabel(key) {
    const labels = { comfort: '舒适', wisdom: '知识', mystery: '神秘', fame: '名声' };
    return labels[key] || key;
  }

  /* ─── AUTO UNLOCK TIER 1 RECIPES ─── */
  function _autoUnlockTier1(moduleName) {
    const dataMap = {
      potions:    POTIONS,
      divination: DIVINATIONS,
      charms:     CHARMS,
      alchemy:    ALCHEMY,
    };
    const recipes = dataMap[moduleName] || [];
    recipes.forEach(r => {
      if (r.tier === 1 || r.unlocked) {
        unlockRecipe(r.id);
      }
    });
  }

  /* ─── PUBLIC ─── */
  return { render };
})();
