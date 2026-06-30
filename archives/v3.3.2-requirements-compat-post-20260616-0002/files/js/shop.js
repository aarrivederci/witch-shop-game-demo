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
    } else if (State.activeShopTab === 'inventory') {
      _renderInventoryItems(container);
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

  /* ─── INVENTORY ITEMS ─── */
  function _renderInventoryItems(container) {
    const intro = document.createElement('div');
    intro.className = 'bond-shop-intro shop-inventory-intro';
    intro.innerHTML = `
      <strong>魔女收纳箱</strong><br>
      集中查看已解锁的可赠送商品样品。样品会在羁绊页优先免费消耗；样品耗尽后，仍可用金币把该商品作为礼物送给熟客。
    `;
    container.appendChild(intro);

    const products = _getGiftableProducts();
    if (!products.length) {
      const empty = document.createElement('div');
      empty.className = 'shop-empty';
      empty.textContent = '还没有可赠送商品样品。先在配方页手动解锁带介绍的商品吧。';
      container.appendChild(empty);
      return;
    }

    const summary = document.createElement('div');
    summary.className = 'inventory-summary';
    const totalSamples = products.reduce((sum, product) => sum + getProductSampleCount(product.id), 0);
    const stockedCount = products.filter(product => getProductSampleCount(product.id) > 0).length;
    summary.innerHTML = `
      <span>📦 可赠送商品 <strong>${products.length}</strong></span>
      <span>🧪 样品库存 <strong>${totalSamples}</strong></span>
      <span>✨ 有库存品类 <strong>${stockedCount}</strong></span>
    `;
    container.appendChild(summary);

    const grid = document.createElement('div');
    grid.className = 'inventory-grid';
    products
      .slice()
      .sort((a, b) => {
        const sampleDiff = getProductSampleCount(b.id) - getProductSampleCount(a.id);
        if (sampleDiff !== 0) return sampleDiff;
        return _getProductGiftCost(a) - _getProductGiftCost(b);
      })
      .forEach(product => grid.appendChild(_buildInventoryCard(product)));
    container.appendChild(grid);
  }

  function _buildInventoryCard(product) {
    const sampleCount = getProductSampleCount(product.id);
    const fallbackCost = _getProductGiftCost(product);
    const card = document.createElement('div');
    card.className = `inventory-card ${sampleCount > 0 ? 'has-sample' : 'empty-sample'}`;
    card.innerHTML = `
      <div class="inventory-card-icon">${product.icon}</div>
      <div class="inventory-card-main">
        <div class="inventory-card-title">${product.name}</div>
        <div class="inventory-card-desc">${product.intro || product.desc || '可作为商品样品赠送给熟客。'}</div>
        <div class="inventory-card-meta">
          <span>${_getModuleLabel(product.sourceModule)}</span>
          <span>羁绊基础 +${product.giftBaseExp || 1}</span>
          <span>金币回退 🪙${fallbackCost}</span>
        </div>
      </div>
      <div class="inventory-card-count">
        <strong>${sampleCount}</strong>
        <span>份样品</span>
      </div>
    `;
    return card;
  }

  function _getModuleLabel(moduleName) {
    const labels = { potions: '魔药', divination: '占卜', charms: '符咒', alchemy: '炼金' };
    return labels[moduleName] || '商品';
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
      ${_formatBondRewardHistory(role.id)}
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
    _showBondStageRewardToasts(role.id, role.charName || role.name);
    render();
    _restoreBondRoleGridScrollTop(roleGridScrollTop);
    UI.refreshHeader();
    Story.checkUnlocks();
  }

  function _buildProductGiftButton(role, product) {
    const btn = document.createElement('button');
    const cost = _getProductGiftCost(product);
    const sampleCount = getProductSampleCount(product.id);
    const hasSample = sampleCount > 0;
    const canAfford = State.coins >= cost;
    const canGive = hasSample || canAfford;
    const pref = _getProductGiftPreference(role, product);
    const giftKey = `product:${product.id}`;
    const repeat = _getRepeatGiftInfo(role.id, giftKey);
    const finalExp = _getProductGiftExp(role, product, repeat.multiplier);
    btn.className = `bond-gift-btn bond-gift-${pref.tier} gift-rarity-product ${canGive ? '' : 'disabled'}`;
    btn.innerHTML = `
      <span class="gift-main"><span>${product.icon} ${product.name}</span><em>商品样品 · ${pref.label}</em></span>
      <small>+${finalExp} 羁绊 · ${hasSample ? `样品 ${sampleCount}→${sampleCount - 1}` : `🪙${cost}`}${repeat.label ? ` · ${repeat.label}` : ''}</small>
      <span class="gift-desc">${product.intro || product.desc || '把店里的招牌商品作为特别样品赠出。'}</span>
    `;
    btn.title = `${product.desc || product.name}\n库存样品：${sampleCount}\n${role.charName || role.name}对这份商品样品的反应：${pref.label}${repeat.label ? `\n${repeat.label}` : ''}`;
    if (canGive) {
      btn.addEventListener('click', () => _buyProductGift(role, product));
    }
    return btn;
  }

  function _buyProductGift(role, product) {
    const roleGridScrollTop = _getBondRoleGridScrollTop();
    const before = getBondLevel(role.id);
    const cost = _getProductGiftCost(product);
    const usedSample = getProductSampleCount(product.id) > 0;
    if (usedSample) {
      useProductSample(product.id, 1);
    } else if (!spendCoins(cost, 'productGift', product.id)) {
      UI.showToast('金币不足！', 'error');
      return;
    }
    const repeat = _getRepeatGiftInfo(role.id, `product:${product.id}`);
    const finalExp = _getProductGiftExp(role, product, repeat.multiplier);
    const pref = _getProductGiftPreference(role, product);
    addBondExp(role.id, finalExp);
    recordProductBondGift(role.id, product.id, product.giftTags || [], usedSample ? 0 : cost, product.legacyGiftId || product.id);
    const after = getBondLevel(role.id);

    UI.showToast(`${product.icon} ${role.charName || role.name}${pref.reaction}${product.name}样品！羁绊 +${finalExp}${usedSample ? '（消耗库存样品）' : ''}${repeat.label ? `（${repeat.label}）` : ''}`, after > before ? 'story' : 'success');
    if (after > before) UI.showToast(`💞 ${role.charName || role.name} 羁绊提升到 Lv.${after}`, 'story');
    _showBondStageRewardToasts(role.id, role.charName || role.name);
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
        const affordDiff = (_canGiveProductGift(b) ? 1 : 0) - (_canGiveProductGift(a) ? 1 : 0);
        if (affordDiff !== 0) return affordDiff;
        const sampleDiff = getProductSampleCount(b.id) - getProductSampleCount(a.id);
        if (sampleDiff !== 0) return sampleDiff;
        return _getProductGiftCost(a) - _getProductGiftCost(b);
      });
  }

  function _canGiveProductGift(product) {
    return getProductSampleCount(product.id) > 0 || State.coins >= _getProductGiftCost(product);
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
      ? target.conditions.map(item => `${item.ok ? '✅' : '✦'} ${item.hint || item.text}`).join('；')
      : '暂无额外条件';
    return `📖 下个故事：${target.title}（${conditionText}）${target.ready ? ' · 可解锁' : ''}`;
  }

  function _getStoryTargetConditions(entry, roleId) {
    if (typeof Story !== 'undefined' && Story.getUnlockConditions) {
      return Story.getUnlockConditions(entry, roleId);
    }

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
    return _getSimpleStoryCondition('订单', current, required, {
      missingHint: '多完成几次相关订单，也许对方会更愿意继续开口',
      doneHint: '相关订单的经历已经足够成为新故事的引子',
    });
  }

  function _getStoryBondCondition(condition, roleId) {
    const targetRoleId = condition.roleId || roleId;
    const current = getBondLevel(targetRoleId);
    const required = Math.max(0, Number(condition.level) || 0);
    return {
      text: `羁绊 Lv.${Math.min(current, required)} / Lv.${required}`,
      hint: current >= required ? '你们之间的关系已经足够接近' : '继续拜访、送礼或完成熟客订单，把关系推向下一层',
      ok: current >= required,
    };
  }

  function _getStoryGiftConditions(condition = {}, roleId) {
    const targetRoleId = condition.roleId || roleId;
    const conditions = [];
    if (!targetRoleId) return conditions;

    if (condition.count != null) {
      conditions.push(_getSimpleStoryCondition('赠送礼物', getBondGiftCount(targetRoleId), Math.max(1, Number(condition.count) || 1), {
        missingHint: '多试着送出对方可能喜欢的礼物，关系会留下新的回声',
        doneHint: '礼物带来的回声已经足够清晰',
      }));
    }

    if (condition.giftId) {
      const gift = _findGiftLikeItem(condition.giftId);
      const label = gift ? `赠送${gift.name}` : '指定礼物';
      conditions.push(_getSimpleStoryCondition(label, getBondGiftCount(targetRoleId, condition.giftId), Math.max(1, Number(condition.giftCount) || 1), {
        missingHint: gift ? `也许 ${gift.name} 会成为打开这段心事的钥匙` : '某件特别的礼物可能正适合这段故事',
        doneHint: gift ? `${gift.name} 已经把这段心事推近了一步` : '特别的礼物已经成为故事钥匙',
      }));
    }

    if (condition.productId) {
      const product = _findProductById(condition.productId);
      const label = product ? `赠送${product.name}样品` : '指定商品样品';
      conditions.push(_getSimpleStoryCondition(label, getBondProductGiftCount(targetRoleId, condition.productId), Math.max(1, Number(condition.productCount) || 1), {
        missingHint: product ? `把 ${product.name} 作为样品送出，可能会引出新的回应` : '某件商品样品可能会成为故事钥匙',
        doneHint: product ? `${product.name} 样品已经留下了足够的回应` : '商品样品已经成为故事钥匙',
      }));
    }

    if (condition.giftTag) {
      conditions.push(_getSimpleStoryCondition('赠送契合礼物', getBondGiftTagCount(targetRoleId, condition.giftTag), Math.max(1, Number(condition.tagCount) || 1), {
        missingHint: '寻找更契合对方喜好的礼物，而不是只重复同一种选择',
        doneHint: '契合心意的礼物已经把关系推到新的位置',
      }));
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

  function _getSimpleStoryCondition(label, current, required, copy = {}) {
    const currentValue = Number(current) || 0;
    const requiredValue = Number(required) || 0;
    const ok = currentValue >= requiredValue;
    return {
      text: `${label} ${Math.min(currentValue, requiredValue)} / ${requiredValue}`,
      hint: ok ? (copy.doneHint || `${label}已经达成`) : (copy.missingHint || `继续推进：${label}`),
      ok,
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
        conditions.push(_getSimpleStoryCondition(labelMap[statKey] || statKey, _getStoryStatValue(statKey), value, {
          missingHint: _getStoryStatHint(statKey, false),
          doneHint: _getStoryStatHint(statKey, true),
        }));
      } else if (key.endsWith('Max')) {
        const statKey = key.slice(0, -3);
        const current = _getStoryStatValue(statKey);
        const required = Number(value) || 0;
        conditions.push({
          text: `${labelMap[statKey] || statKey}不高于 ${current} / ${required}`,
          hint: current <= required ? '目前的经营痕迹仍保留着这条故事分支' : '最近的经营痕迹还不够贴近这条分支',
          ok: current <= required,
        });
      }
    });
    return conditions;
  }

  function _getStoryStatHint(statKey, done) {
    const map = {
      customersLost: ['偶尔被错过的顾客，也可能把小店推向另一种传闻', '那些没能留下的顾客已经在镇上留下回声'],
      customersServed: ['继续服务更多顾客，让小店被更多人记住', '来往顾客的记忆已经汇成新的故事'],
      ordersCompleted: ['继续完成订单，让稳定经营成为故事的土壤', '完成订单的积累已经足够推动新的事件'],
      ordersFailed: ['经营中的失误有时也会引来异常的视线', '失败订单留下的痕迹已经足够明显'],
      coinsSpentOnBond: ['把金币花在关系上，会慢慢改变熟客对你的回应', '投入关系的金币已经被对方记住'],
      coinsSpentTotal: ['继续决定金币流向；账页会记录你的经营选择', '累计消费已经让账页出现新的折痕'],
    };
    const pair = map[statKey] || ['继续沿着这类经营痕迹推进', '这类经营痕迹已经足够清晰'];
    return done ? pair[1] : pair[0];
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
        conditions.push(_getSimpleStoryCondition(labelMap[traitKey] || traitKey, getShopTrait(traitKey), value, {
          missingHint: _getShopTraitStoryHint(traitKey, false),
          doneHint: _getShopTraitStoryHint(traitKey, true),
        }));
      }
    });
    return conditions;
  }

  function _getShopTraitStoryHint(traitKey, done) {
    const map = {
      comfort: ['把店铺布置得更温暖舒适，某些心事才会安心靠近', '小店的舒适气息已经能安放这段故事'],
      wisdom: ['投资知识与记录，让小店更像能解答疑问的地方', '小店积累的知识已经照亮新的线索'],
      mystery: ['增加神秘气质，会吸引不愿在白昼现身的传闻', '神秘气质已经足够吸引隐藏的目光'],
      fame: ['提升名声，让更远处的消息愿意来到柜台前', '小店的名声已经把这段传闻带到门前'],
    };
    const pair = map[traitKey] || ['继续调整店铺气质', '店铺气质已经满足这段故事'];
    return done ? pair[1] : pair[0];
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

  function _formatBondRewardHistory(roleId) {
    const rewards = getBondStageRewardHistory(roleId);
    if (!rewards.length) {
      return '<div class="bond-stage-rewards empty">羁绊回馈：达到 Lv.1 后会记录第一条熟客回馈。</div>';
    }
    const items = rewards.map(reward => `
      <li><strong>Lv.${reward.level} ${reward.label || _getBondLabel(reward.level)}</strong><span>${reward.text}</span></li>
    `).join('');
    return `<div class="bond-stage-rewards"><div class="bond-stage-title">羁绊回馈</div><ul>${items}</ul></div>`;
  }

  function _showBondStageRewardToasts(roleId, roleName) {
    const rewards = getBondStageRewardHistory(roleId).filter(reward => reward && !reward.toastShown);
    if (!rewards.length) return;
    const record = getBondGiftStats(roleId);
    rewards.forEach(reward => {
      UI.showToast(`💌 羁绊回馈：${roleName} Lv.${reward.level}｜${reward.text}`, 'story');
      reward.toastShown = true;
      const flagKey = `stageReward:${reward.level}`;
      if (record.rewardFlags && record.rewardFlags[flagKey]) {
        record.rewardFlags[flagKey].toastShown = true;
      }
    });
    saveState();
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
