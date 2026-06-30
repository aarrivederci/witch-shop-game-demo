/* ═══════════════════════════════════════════════════════
   WITCH SHOP GAME - Modules Panel
   Renders recipe tabs and cards in the left panel
═══════════════════════════════════════════════════════ */

const Modules = (() => {

  const MODULE_META = {
    potions:    { label: '🧪 药水', dataKey: 'POTIONS'    },
    divination: { label: '🔮 占卜', dataKey: 'DIVINATIONS' },
    charms:     { label: '✨ 符咒', dataKey: 'CHARMS'      },
    alchemy:    { label: '⚗️ 炼金', dataKey: 'ALCHEMY'     },
  };

  const DATA_MAP = {
    POTIONS:     () => POTIONS,
    DIVINATIONS: () => DIVINATIONS,
    CHARMS:      () => CHARMS,
    ALCHEMY:     () => ALCHEMY,
  };

  /* ─── RENDER ─── */
  function render() {
    _renderTabs();
    _renderAllModulePanels();
  }

  /* ─── TABS ─── */
  function _renderTabs() {
    // Update tab-btn visibility and active state
    document.querySelectorAll('#module-tabs .tab-btn').forEach(btn => {
      const mod = btn.dataset.module;
      if (!mod) return;
      // Show/hide based on unlock
      if (State.modules[mod] === false) {
        btn.classList.add('locked');
      } else {
        btn.classList.remove('locked');
      }
      // Active state
      btn.classList.toggle('active', mod === State.activeModule);

      // Bind click (only once — check flag)
      if (!btn._moduleBound) {
        btn._moduleBound = true;
        btn.addEventListener('click', () => {
          if (State.modules[btn.dataset.module] === false) return;
          State.activeModule = btn.dataset.module;
          render();
        });
      }
    });

    // Show/hide module panels
    document.querySelectorAll('.module-panel').forEach(panel => {
      const mod = panel.id.replace('module-', '');
      panel.classList.toggle('active', mod === State.activeModule);
    });
  }

  /* ─── RENDER ALL MODULE PANELS ─── */
  function _renderAllModulePanels() {
    const containerMap = {
      potions:    'potion-recipes',
      divination: 'divination-services',
      charms:     'charm-services',
      alchemy:    'alchemy-services',
    };

    Object.entries(MODULE_META).forEach(([mod, meta]) => {
      const containerId = containerMap[mod];
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = '';

      const recipes = DATA_MAP[meta.dataKey]();
      recipes.forEach(recipe => {
        const card = _buildRecipeCard(recipe, mod);
        container.appendChild(card);
      });
    });
  }

  function _buildRecipeCard(recipe, mod) {
    const unlocked = isRecipeUnlocked(recipe.id);
    const wordCount = _estimateWordCount(recipe);
    const card = document.createElement('div');
    card.className = 'recipe-card' + (unlocked ? '' : ' locked');
    card.dataset.id = recipe.id;

    if (unlocked) {
      card.innerHTML = `
        <div class="recipe-icon">${recipe.icon}</div>
        <div class="recipe-info">
          <div class="recipe-name">${recipe.name}</div>
          <div class="recipe-keys"><span class="key-badge">⌨️ 约 ${wordCount} 个单词</span></div>
          <div class="recipe-desc">${recipe.desc}</div>
        </div>
        <div class="recipe-price">🪙${recipe.price}</div>
      `;
    } else {
      card.innerHTML = `
        <div class="recipe-icon">🔒</div>
        <div class="recipe-info">
          <div class="recipe-name recipe-locked-name">???</div>
          <div class="recipe-desc">需要更多魔法经验才能解锁</div>
        </div>
      `;
    }

    // Click to learn/unlock recipe (cost coins)
    if (!unlocked) {
      const learnCost = recipe.unlockCost || recipe.price * 2;
      const tooltip = document.createElement('div');
      tooltip.className = 'recipe-unlock-hint';
      tooltip.textContent = `花费 🪙${learnCost} 解锁配方`;
      card.appendChild(tooltip);
      card.title = `花费 ${learnCost} 金币解锁`;
      card.addEventListener('click', () => _tryUnlockRecipe(recipe, learnCost));
    }

    return card;
  }

  function _estimateWordCount(recipe) {
    const price = Number(recipe && recipe.price) || 0;
    return Math.min(5, Math.max(1, Math.floor(price / 30)));
  }

  function _renderKeys(keys) {
    return keys.map(k => `<span class="key-badge">${k}</span>`).join('');
  }

  /* ─── UNLOCK RECIPE ─── */
  function _tryUnlockRecipe(recipe, cost) {
    if (isRecipeUnlocked(recipe.id)) return;
    if (!spendCoins(cost)) {
      UI.showToast('金币不足！', 'error');
      return;
    }
    unlockRecipe(recipe.id);
    const sampleCount = _grantUnlockSamples(recipe);
    UI.showProductUnlockCard(recipe, sampleCount);
    render();
    UI.refreshHeader();
  }

  function _grantUnlockSamples(recipe) {
    if (!recipe || !recipe.giftable) return 0;
    const sampleCount = _getSampleOnUnlock(recipe);
    if (sampleCount > 0) addProductSamples(recipe.id, sampleCount);
    return sampleCount;
  }

  function _getSampleOnUnlock(recipe) {
    if (typeof recipe.sampleOnUnlock === 'number') return Math.max(0, Math.floor(recipe.sampleOnUnlock));
    return recipe.giftable ? 1 : 0;
  }

  /* ─── HIGHLIGHT ACTIVE KEY ─── */
  // Called by game.js when a key is pressed to visually highlight progress
  function highlightOrderProgress(order) {
    const cards = document.querySelectorAll('.recipe-card');
    cards.forEach(card => {
      if (card.dataset.id === order.recipe.id) {
        card.classList.add('brewing');
        setTimeout(() => card.classList.remove('brewing'), 400);
      }
    });
  }

  /* ─── PUBLIC ─── */
  return { render, highlightOrderProgress };
})();
