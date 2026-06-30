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
      ? hints.map(h => `<div class="story-lock-condition ${h.ok ? 'ok' : 'missing'}"><span>${h.ok ? '✅' : '✦'} ${h.text || h.label}</span>${h.progress ? `<strong>${h.progress}</strong>` : ''}</div>`).join('')
      : '<div class="story-lock-condition missing"><span>✦ 这段故事还藏在更深的经营痕迹里。</span></div>';

    card.innerHTML = `
      <div class="story-entry-title">🔒 ${previewTitle}</div>
      <div class="story-lock-teaser">${previewHint}</div>
      ${visibleHintHtml}
      <div class="story-lock-list">${hintHtml}</div>
      <div class="story-lock-tip">提示：线索只说明推进方向；继续观察订单、羁绊、赠礼与店铺气质的变化。</div>
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
      hints.push(_makeUnlockHint({
        label: '订单',
        current,
        required,
        ok: current >= required,
        missingText: '多完成几次相关订单，也许对方会更愿意继续开口。',
        doneText: '相关订单的经历已经足够成为新故事的引子。',
      }));
    }
    if (entry.unlockBond) {
      const roleId = entry.unlockBond.roleId || entry.roleId;
      const current = getBondLevel(roleId);
      const required = Math.max(0, Number(entry.unlockBond.level) || 0);
      hints.push(_makeUnlockHint({
        label: '羁绊等级',
        current: `Lv.${current}`,
        required: `Lv.${required}`,
        ok: current >= required,
        missingText: '继续拜访、送礼或完成熟客订单，把关系推向下一层。',
        doneText: '你们之间的关系已经足够接近。',
      }));
    }
    if (entry.unlockGifts) {
      hints.push(..._getGiftUnlockHints(entry.unlockGifts, entry.roleId));
    }
    if (entry.unlockPhase != null) {
      hints.push(_makeUnlockHint({
        label: '店铺阶段',
        current: State.phase,
        required: entry.unlockPhase,
        ok: State.phase >= entry.unlockPhase,
        missingText: '先把小店经营到更稳定的阶段，新的传闻才会浮现。',
        doneText: '小店的发展阶段已经足以承接这段故事。',
      }));
    }
    if (entry.unlockCoins != null) {
      hints.push(_makeUnlockHint({
        label: '累计金币',
        current: State.totalEarned,
        required: entry.unlockCoins,
        ok: State.totalEarned >= entry.unlockCoins,
        missingText: '继续经营并积累收入，账本里的变化会带来新的线索。',
        doneText: '账本上的积累已经足够触发新的变化。',
      }));
    }
    if (entry.unlockStats) {
      hints.push(..._getStatsUnlockHints(entry.unlockStats));
    }
    if (entry.unlockShopTraits) {
      hints.push(..._getShopTraitUnlockHints(entry.unlockShopTraits));
    }
    return hints;
  }

  function _makeUnlockHint({ label, current, required, ok, missingText, doneText }) {
    return {
      label,
      current,
      required,
      ok,
      text: ok ? (doneText || `${label}已经达成。`) : (missingText || `继续推进：${label}。`),
      progress: `${current} / ${required}`,
    };
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
        hints.push(_makeUnlockHint({
          label: labelMap[statKey] || statKey,
          current,
          required: value,
          ok: current >= value,
          missingText: _getStatHintText(statKey, false),
          doneText: _getStatHintText(statKey, true),
        }));
      } else if (key.endsWith('Max')) {
        const statKey = key.slice(0, -3);
        const current = _getStoryStatValue(statKey);
        hints.push(_makeUnlockHint({
          label: `${labelMap[statKey] || statKey}不高于`,
          current,
          required: value,
          ok: current <= value,
          missingText: '最近的经营痕迹还不够贴近这条分支。',
          doneText: '目前的经营痕迹仍保留着这条故事分支。',
        }));
      }
    });
    return hints;
  }

  function _getStatHintText(statKey, done) {
    const map = {
      customersLost: ['偶尔被错过的顾客，也可能把小店推向另一种传闻。', '那些没能留下的顾客已经在镇上留下回声。'],
      customersServed: ['继续服务更多顾客，让小店被更多人记住。', '来往顾客的记忆已经汇成新的故事。'],
      ordersCompleted: ['继续完成订单，让稳定经营成为故事的土壤。', '完成订单的积累已经足够推动新的事件。'],
      ordersFailed: ['经营中的失误有时也会引来异常的视线。', '失败订单留下的痕迹已经足够明显。'],
      coinsSpentOnBond: ['把金币花在关系上，会慢慢改变熟客对你的回应。', '投入关系的金币已经被对方记住。'],
      coinsSpentTotal: ['继续决定金币流向；账页会记录你的经营选择。', '累计消费已经让账页出现新的折痕。'],
    };
    const pair = map[statKey] || ['继续沿着这类经营痕迹推进。', '这类经营痕迹已经足够清晰。'];
    return done ? pair[1] : pair[0];
  }

  function _findGiftLikeItem(giftId) {
    return (BOND_GIFTS || []).find(item => item.id === giftId)
      || [...POTIONS, ...DIVINATIONS, ...CHARMS, ...ALCHEMY].find(item => item.id === giftId || item.legacyGiftId === giftId)
      || (typeof BOND_GIFT_LABELS !== 'undefined' && BOND_GIFT_LABELS[giftId] ? { name: BOND_GIFT_LABELS[giftId] } : null);
  }

  function _findProductById(productId) {
    return [...POTIONS, ...DIVINATIONS, ...CHARMS, ...ALCHEMY].find(item => item.id === productId);
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
        hints.push(_makeUnlockHint({
          label: labelMap[traitKey] || traitKey,
          current,
          required: value,
          ok: current >= value,
          missingText: _getShopTraitHintText(traitKey, false),
          doneText: _getShopTraitHintText(traitKey, true),
        }));
      }
    });
    return hints;
  }

  function _getShopTraitHintText(traitKey, done) {
    const map = {
      comfort: ['把店铺布置得更温暖舒适，某些心事才会安心靠近。', '小店的舒适气息已经能安放这段故事。'],
      wisdom: ['投资知识与记录，让小店更像能解答疑问的地方。', '小店积累的知识已经照亮新的线索。'],
      mystery: ['增加神秘气质，会吸引不愿在白昼现身的传闻。', '神秘气质已经足够吸引隐藏的目光。'],
      fame: ['提升名声，让更远处的消息愿意来到柜台前。', '小店的名声已经把这段传闻带到门前。'],
    };
    const pair = map[traitKey] || ['继续调整店铺气质。', '店铺气质已经满足这段故事。'];
    return done ? pair[1] : pair[0];
  }

  function _getGiftUnlockHints(condition = {}, fallbackRoleId = null) {
    const roleId = condition.roleId || fallbackRoleId;
    const hints = [];
    if (!roleId) return hints;

    if (condition.count != null) {
      const current = getBondGiftCount(roleId);
      const required = Math.max(1, Number(condition.count) || 1);
      hints.push(_makeUnlockHint({
        label: '赠送礼物',
        current,
        required,
        ok: current >= required,
        missingText: '多试着送出对方可能喜欢的礼物，关系会留下新的回声。',
        doneText: '礼物带来的回声已经足够清晰。',
      }));
    }

    if (condition.giftId) {
      const gift = _findGiftLikeItem(condition.giftId);
      const current = getBondGiftCount(roleId, condition.giftId);
      const required = Math.max(1, Number(condition.giftCount) || 1);
      hints.push(_makeUnlockHint({
        label: gift ? `赠送${gift.name}` : '赠送指定礼物',
        current,
        required,
        ok: current >= required,
        missingText: gift ? `也许 ${gift.name} 会成为打开这段心事的钥匙。` : '某件特别的礼物可能正适合这段故事。',
        doneText: gift ? `${gift.name} 已经把这段心事推近了一步。` : '特别的礼物已经成为故事钥匙。',
      }));
    }

    if (condition.productId) {
      const product = _findProductById(condition.productId);
      const current = getBondProductGiftCount(roleId, condition.productId);
      const required = Math.max(1, Number(condition.productCount) || 1);
      hints.push(_makeUnlockHint({
        label: product ? `赠送${product.name}样品` : '赠送指定商品样品',
        current,
        required,
        ok: current >= required,
        missingText: product ? `把 ${product.name} 作为样品送出，可能会引出新的回应。` : '某件商品样品可能会成为故事钥匙。',
        doneText: product ? `${product.name} 样品已经留下了足够的回应。` : '商品样品已经成为故事钥匙。',
      }));
    }

    if (condition.giftTag) {
      const current = getBondGiftTagCount(roleId, condition.giftTag);
      const required = Math.max(1, Number(condition.tagCount) || 1);
      hints.push(_makeUnlockHint({
        label: '赠送契合礼物',
        current,
        required,
        ok: current >= required,
        missingText: '寻找更契合对方喜好的礼物，而不是只重复同一种选择。',
        doneText: '契合心意的礼物已经把关系推到新的位置。',
      }));
    }

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
      const giftOk = _isGiftConditionMet(entry);
      const statsOk = _isStatsConditionMet(entry);
      const shopTraitOk = _isShopTraitConditionMet(entry);
      const phaseOk = entry.unlockPhase == null || State.phase >= entry.unlockPhase;
      const coinsOk = entry.unlockCoins == null || State.totalEarned >= entry.unlockCoins;

      if (orderOk && bondOk && giftOk && statsOk && shopTraitOk && phaseOk && coinsOk) {
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

  function _isGiftConditionMet(entry) {
    if (!entry.unlockGifts) return true;
    return _getGiftUnlockHints(entry.unlockGifts, entry.roleId).every(h => h.ok);
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
