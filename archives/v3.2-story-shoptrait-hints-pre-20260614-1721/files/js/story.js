/* ═══════════════════════════════════════════════════════
   WITCH SHOP GAME - Story Panel (角色页签版)
   每个角色独立页签，按最近解锁排序
═══════════════════════════════════════════════════════ */

const Story = (() => {

  let _activeRoleId = null;

  /* ─── RENDER ─── */
  function render() {
    const container = document.getElementById('story-list');
    if (!container) return;
    container.innerHTML = '';

    const unlocked = STORY_ENTRIES.filter(e => State.storyUnlocked.includes(e.id));
    if (!unlocked.length) {
      container.innerHTML = '<div class="story-empty">📖 开始经营你的小店，故事会慢慢展开……</div>';
      return;
    }

    // 按角色分组
    const roleMap = _groupByRole(STORY_ENTRIES);
    const roleOrder = _getRoleOrder(roleMap);

    // 构建页签栏 + 内容区
    const tabBar = document.createElement('div');
    tabBar.className = 'story-tab-bar';

    const content = document.createElement('div');
    content.className = 'story-tab-content';

    roleOrder.forEach(roleId => {
      const info = roleMap[roleId];
      const tab = document.createElement('button');
      tab.className = 'story-tab' + (roleId === _activeRoleId ? ' active' : '');
      tab.dataset.role = roleId;
      tab.innerHTML = `<span class="story-tab-emoji">${info.emoji}</span><span class="story-tab-name">${info.charName}</span><small>${info.unlockedCount}/${info.totalCount}</small>`;
      tab.addEventListener('click', () => _switchTab(roleId));
      tabBar.appendChild(tab);
    });

    // 默认选中第一个或之前激活的
    if (!_activeRoleId || !roleMap[_activeRoleId]) {
      _activeRoleId = roleOrder[0];
    }

    container.appendChild(tabBar);
    container.appendChild(content);
    _renderRoleContent(content, roleMap[_activeRoleId]);
  }

  /* ─── 按角色分组 ─── */
  function _groupByRole(unlocked) {
    const map = {};
    // 先加入特殊条目（无 roleId 的）
    const special = unlocked.filter(e => !e.roleId);
    if (special.length) {
      map['_special'] = {
        roleId: null,
        emoji: '📖',
        charName: '序章',
        roleName: '序章',
        entries: special,
        unlockedCount: special.filter(e => State.storyUnlocked.includes(e.id)).length,
        totalCount: special.length,
      };
    }
    // 角色条目
    unlocked.filter(e => e.roleId).forEach(e => {
      if (!map[e.roleId]) {
        map[e.roleId] = {
          roleId: e.roleId,
          emoji: e.emoji,
          charName: e.charName,
          roleName: e.roleName,
          entries: [],
          unlockedCount: 0,
          totalCount: 0,
        };
      }
      map[e.roleId].entries.push(e);
      map[e.roleId].totalCount += 1;
      if (State.storyUnlocked.includes(e.id)) map[e.roleId].unlockedCount += 1;
    });
    return map;
  }

  /* ─── 页签排序：按最近解锁时间 ─── */
  function _getRoleOrder(roleMap) {
    const roles = Object.keys(roleMap);
    // 每个角色的最新解锁索引
    roles.sort((a, b) => {
      const latestA = _getLatestUnlockIndex(roleMap[a].entries);
      const latestB = _getLatestUnlockIndex(roleMap[b].entries);
      return latestB - latestA;
    });
    return roles;
  }

  function _getLatestUnlockIndex(entries) {
    let max = -1;
    entries.forEach(e => {
      const idx = State.storyUnlocked.indexOf(e.id);
      if (idx > max) max = idx;
    });
    return max;
  }

  /* ─── 切换页签 ─── */
  function _switchTab(roleId) {
    _activeRoleId = roleId;
    // 更新 tab active 状态
    const container = document.getElementById('story-list');
    if (!container) return;
    container.querySelectorAll('.story-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.role === roleId);
    });
    // 重绘内容
    const content = container.querySelector('.story-tab-content');
    const roleMap = _groupByRole(STORY_ENTRIES);
    if (content && roleMap[roleId]) {
      _renderRoleContent(content, roleMap[roleId]);
    }
  }

  /* ─── 渲染角色内容区 ─── */
  function _renderRoleContent(content, roleInfo) {
    content.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'story-role-header';
    const roleId = roleInfo.roleId;
    const bondLevel = roleId ? getBondLevel(roleId) : null;
    const orderCount = roleId ? getOrderCompletionCount({ identity: roleId }) : null;
    header.innerHTML = `
      <div><span class="story-role-emoji">${roleInfo.emoji}</span> ${roleInfo.charName} <span class="story-role-title">· ${roleInfo.roleName}</span></div>
      ${roleId ? `<div class="story-role-meta">羁绊 Lv.${bondLevel} · 完成订单 ${orderCount} 次 · 故事 ${roleInfo.unlockedCount}/${roleInfo.totalCount}</div>` : ''}
    `;
    content.appendChild(header);

    // 按故事顺序（正序）
    const sorted = [...roleInfo.entries];
    let nextLockedShown = false;

    sorted.forEach(entry => {
      if (State.storyUnlocked.includes(entry.id)) {
        content.appendChild(_buildEntryCard(entry));
        return;
      }

      if (!nextLockedShown) {
        content.appendChild(_buildLockedCard(entry, true));
        nextLockedShown = true;
      } else {
        content.appendChild(_buildFutureCard());
      }
    });
  }

  /* ─── BUILD CARD ─── */
  function _buildEntryCard(entry) {
    const card = document.createElement('div');
    card.className = 'story-entry';
    card.dataset.id = entry.id;

    const titleHtml = `📖 ${entry.title}`;
    const textHtml = entry.text
      .split('\n\n')
      .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('');

    card.innerHTML = `
      <div class="story-entry-title">${titleHtml}</div>
      <div class="story-entry-text">${textHtml}</div>
    `;

    return card;
  }

  function _buildLockedCard(entry) {
    const card = document.createElement('div');
    card.className = 'story-entry story-entry-locked';
    const hints = _getUnlockHints(entry);
    const preview = entry.preview || {};
    const previewTitle = preview.hiddenTitle || entry.title || '未解锁故事';
    const previewHint = preview.hint || `${entry.charName || '有人'}似乎还有新的话想对你说……`;
    const visibleHints = Array.isArray(preview.visibleHints) ? preview.visibleHints : [];
    const visibleHintHtml = visibleHints.length
      ? `<div class="story-preview-hints">${visibleHints.map(h => `<span>✦ ${h}</span>`).join('')}</div>`
      : '';
    const hintHtml = hints.length
      ? hints.map(h => `<div class="story-lock-condition ${h.ok ? 'ok' : 'missing'}"><span>${h.ok ? '✅' : '❌'} ${h.label}</span><strong>${h.current} / ${h.required}</strong></div>`).join('')
      : '<div class="story-lock-condition missing"><span>❌ 尚未满足未知条件</span></div>';

    card.innerHTML = `
      <div class="story-entry-title">🔒 ${previewTitle}</div>
      <div class="story-lock-teaser">${previewHint}</div>
      ${visibleHintHtml}
      <div class="story-lock-list">${hintHtml}</div>
      <div class="story-lock-tip">提示：完成这个角色的订单，或在商店赠送喜欢的礼物，可以推进故事。</div>
    `;
    return card;
  }

  function _buildFutureCard() {
    const card = document.createElement('div');
    card.className = 'story-entry story-entry-future';
    card.innerHTML = `
      <div class="story-entry-title">🔒 ？？？</div>
      <div class="story-lock-teaser">继续加深关系后，将出现新的事件。</div>
    `;
    return card;
  }

  function _getUnlockHints(entry) {
    const hints = [];
    if (entry.unlockOrders) {
      const current = getOrderCompletionCount(entry.unlockOrders);
      const required = Math.max(1, Number(entry.unlockOrders.count) || 1);
      hints.push({ label: '订单', current, required, ok: current >= required });
    }
    if (entry.unlockBond) {
      const roleId = entry.unlockBond.roleId || entry.roleId;
      const current = getBondLevel(roleId);
      const required = Math.max(0, Number(entry.unlockBond.level) || 0);
      hints.push({ label: '羁绊等级', current: `Lv.${current}`, required: `Lv.${required}`, ok: current >= required });
    }
    if (entry.unlockPhase != null) {
      hints.push({ label: '店铺阶段', current: State.phase, required: entry.unlockPhase, ok: State.phase >= entry.unlockPhase });
    }
    if (entry.unlockCoins != null) {
      hints.push({ label: '累计金币', current: State.totalEarned, required: entry.unlockCoins, ok: State.totalEarned >= entry.unlockCoins });
    }
    if (entry.unlockStats) {
      hints.push(..._getStatsUnlockHints(entry.unlockStats));
    }
    return hints;
  }

  function _getStatsUnlockHints(stats = {}) {
    const labelMap = {
      customersLost: '流失顾客',
      customersServed: '服务顾客',
      ordersCompleted: '完成订单',
      ordersFailed: '失败订单',
      coinsSpentOnBond: '羁绊消费',
      coinsSpentTotal: '累计消费金币',
    };
    const hints = [];
    Object.entries(stats).forEach(([key, value]) => {
      if (key.endsWith('Min')) {
        const statKey = key.slice(0, -3);
        const current = _getStoryStatValue(statKey);
        hints.push({ label: labelMap[statKey] || statKey, current, required: value, ok: current >= value });
      } else if (key.endsWith('Max')) {
        const statKey = key.slice(0, -3);
        const current = _getStoryStatValue(statKey);
        hints.push({ label: `${labelMap[statKey] || statKey}不高于`, current, required: value, ok: current <= value });
      }
    });
    return hints;
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

  function _getShopTraitUnlockHints(traits = {}) {
    const labelMap = { comfort: '店铺舒适', wisdom: '店铺知识', mystery: '店铺神秘', fame: '店铺名声' };
    const hints = [];
    Object.entries(traits).forEach(([key, value]) => {
      if (key.endsWith('Min')) {
        const traitKey = key.slice(0, -3);
        const current = getShopTrait(traitKey);
        hints.push({ label: labelMap[traitKey] || traitKey, current, required: value, ok: current >= value });
      }
    });
    return hints;
  }

  /* ─── CHECK FOR NEW UNLOCKS ─── */
  function checkUnlocks() {
    let anyNew = false;
    let newEntry = null;

    STORY_ENTRIES.forEach(entry => {
      if (State.storyUnlocked.includes(entry.id)) return;

      const orderOk = _isOrderConditionMet(entry);
      const bondOk = _isBondConditionMet(entry);
      const statsOk = _isStatsConditionMet(entry);
      const shopTraitOk = _isShopTraitConditionMet(entry);
      const phaseOk = entry.unlockPhase == null || State.phase >= entry.unlockPhase;
      const coinsOk = entry.unlockCoins == null || State.totalEarned >= entry.unlockCoins;

      if (orderOk && bondOk && statsOk && shopTraitOk && phaseOk && coinsOk) {
        const isNew = unlockStoryEntry(entry.id);
        if (isNew) {
          anyNew = true;
          newEntry = entry;
          const displayTitle = entry.charName ? `${entry.charName}·${entry.title}` : entry.title;
          UI.showToast(`📖 新故事解锁：${displayTitle}`, 'story');
        }
      }
    });

    if (anyNew) {
      // 自动切换到新解锁故事的角色页签
      if (newEntry && newEntry.roleId) {
        _activeRoleId = newEntry.roleId;
      }
      render();
    }
  }

  function _isOrderConditionMet(entry) {
    const condition = entry.unlockOrders;
    if (!condition) return true;

    const count = getOrderCompletionCount(condition);
    const required = Math.max(1, Number(condition.count) || 1);
    return count >= required;
  }

  function _isBondConditionMet(entry) {
    const condition = entry.unlockBond;
    if (!condition) return true;
    const roleId = condition.roleId || entry.roleId;
    const required = Math.max(0, Number(condition.level) || 0);
    return getBondLevel(roleId) >= required;
  }

  function _isStatsConditionMet(entry) {
    if (!entry.unlockStats) return true;
    return _getStatsUnlockHints(entry.unlockStats).every(h => h.ok);
  }

  function _isShopTraitConditionMet(entry) {
    if (!entry.unlockShopTraits) return true;
    return _getShopTraitUnlockHints(entry.unlockShopTraits).every(h => h.ok);
  }

  /* ─── PUBLIC ─── */
  return { render, checkUnlocks };
})();
