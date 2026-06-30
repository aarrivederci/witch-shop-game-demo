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

    if (State.activeShopTab === 'unlock') {
      _renderUnlockItems(container);
    } else if (State.activeShopTab === 'bond') {
      _renderBondItems(container);
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
      State.activeBondRoleId = role.id;
      saveState();
      render();
    });
    return btn;
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
    const before = getBondLevel(role.id);
    if (!spendCoins(gift.cost)) {
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

  function _getGiftExp(role, gift, repeatMultiplier = 1) {
    const pref = _getGiftPreference(role, gift);
    return Math.max(1, Math.round(gift.exp * pref.multiplier * repeatMultiplier));
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

  function _getNextRoleStoryTarget(roleId) {
    const entries = (STORY_ENTRIES || []).filter(entry => entry.roleId === roleId);
    const next = entries.find(entry => !State.storyUnlocked.includes(entry.id));
    if (!next) return null;
    const orderNeed = next.unlockOrders ? next.unlockOrders.count : 0;
    const bondNeed = next.unlockBond ? next.unlockBond.level : 0;
    const role = CUSTOMER_TYPES.find(item => item.id === roleId);
    const orders = getOrderCompletionCount({ identity: roleId, personality: role && role.personality });
    const level = getBondLevel(roleId);
    return {
      index: entries.indexOf(next) + 1,
      title: next.titleCN || next.title || '新的故事',
      orderNeed,
      bondNeed,
      orders,
      level,
      ready: orders >= orderNeed && level >= bondNeed,
    };
  }

  function _formatStoryTarget(target) {
    if (!target) return '📖 该角色的故事已全部解锁。';
    const orderText = `订单 ${Math.min(target.orders, target.orderNeed)} / ${target.orderNeed}`;
    const bondText = `羁绊 Lv.${target.level} / Lv.${target.bondNeed}`;
    return `📖 下个故事：${target.title}（${orderText}，${bondText}）${target.ready ? ' · 可解锁' : ''}`;
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
    if (!spendCoins(item.cost)) {
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
    if (!spendCoins(item.cost)) {
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
