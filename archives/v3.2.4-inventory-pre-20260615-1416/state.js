/* ═══════════════════════════════════════════════════════
   WITCH SHOP GAME - Game State
   Central state object and persistence (localStorage)
═══════════════════════════════════════════════════════ */

const SAVE_KEY = 'witchShopSave_v1';

/* ─── DEFAULT STATE ─── */
const DEFAULT_STATE = {
  witchName: '',
  coins: 0,
  totalEarned: 0,       // lifetime coins earned (for phase progression)
  phase: 0,
  ordersCompleted: 0,
  ordersFailed: 0,

  /* Unlocked modules */
  modules: {
    potions:    true,
    divination: false,
    charms:     false,
    alchemy:    false,
  },

  /* Per-recipe unlock status (keyed by recipe id) */
  recipeUnlocks: {},

  /* Shop items purchased (keyed by item id) */
  shopPurchased: {},

  /* Coins spent by category/item for long-term story conditions */
  coinSpendStats: {
    total: 0,
    byCategory: {},
    byItem: {},
  },

  /* Shop atmosphere/progression traits raised by investments */
  shopTraits: {
    comfort: 0,
    wisdom: 0,
    mystery: 0,
    fame: 0,
  },

  /* Shop investments purchased (keyed by investment id) */
  shopInvestments: {},

  /* Upgrades active */
  upgrades: {
    faster_brew:       false,
    patience:          false,
    tips:              false,
    more_orders:       false,
    vip:               false,
    auto_recipes:      false,
  },

  /* Story entries seen */
  storyUnlocked: ['intro'],

  /* Relationship progression keyed by role/customer identity id */
  bonds: {},

  /* Completed orders grouped by customer traits (for story triggers) */
  orderCompletionStats: {
    byCustomerId: {},
    byIdentity: {},
    byPersonality: {},
    byIdentityPersonality: {},
  },

  /* Statistics */
  stats: {
    potionsBrewed:    0,
    divinationsDone:  0,
    charmsMade:       0,
    alchemyDone:      0,
    customersServed:  0,
    customersLost:    0,
    highestCombo:     0,
    totalKeyPresses:  0,
  },

  /* Settings */
  settings: {
    wordDisplayFormat: 'capitalize', // 'capitalize' | 'uppercase'
  },

  /* Active tab */
  activeModule: 'potions',
  activeShopTab: 'unlock',
  activeBondRoleId: null,
};

/* ─── STATE SINGLETON ─── */
let State = {};

/* ─── INIT / LOAD ─── */
function initState() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Deep merge saved onto defaults to handle new fields gracefully
      State = deepMerge(JSON.parse(JSON.stringify(DEFAULT_STATE)), parsed);
    } catch (e) {
      console.warn('[State] Save data corrupt, resetting.', e);
      State = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  } else {
    State = JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  // Sync recipe unlocks from data
  _syncRecipeUnlocks();
  // Attach convenience aliases
  _attachStateAliases();
}

/* ─── SAVE ─── */
function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(State));
  } catch (e) {
    console.warn('[State] Could not save.', e);
  }
}

/* ─── RESET ─── */
function resetState() {
  localStorage.removeItem(SAVE_KEY);
  State = JSON.parse(JSON.stringify(DEFAULT_STATE));
  _attachStateAliases();
}

/* ─── COINS ─── */
function addCoins(amount) {
  State.coins += amount;
  State.totalEarned += amount;
  saveState();
}

function spendCoins(amount, category = 'misc', itemId = null) {
  if (State.coins < amount) return false;
  State.coins -= amount;
  recordCoinSpend(amount, category, itemId);
  saveState();
  return true;
}

function recordCoinSpend(amount, category = 'misc', itemId = null) {
  if (amount <= 0) return;
  if (!State.coinSpendStats) {
    State.coinSpendStats = JSON.parse(JSON.stringify(DEFAULT_STATE.coinSpendStats));
  }
  if (!State.coinSpendStats.byCategory) State.coinSpendStats.byCategory = {};
  if (!State.coinSpendStats.byItem) State.coinSpendStats.byItem = {};

  State.coinSpendStats.total = (State.coinSpendStats.total || 0) + amount;
  State.coinSpendStats.byCategory[category] = (State.coinSpendStats.byCategory[category] || 0) + amount;
  if (itemId) {
    State.coinSpendStats.byItem[itemId] = (State.coinSpendStats.byItem[itemId] || 0) + amount;
  }
}

function getCoinSpendTotal(category = null) {
  const stats = State.coinSpendStats || DEFAULT_STATE.coinSpendStats;
  if (!category) return stats.total || 0;
  return (stats.byCategory && stats.byCategory[category]) || 0;
}

/* ─── PHASE PROGRESSION ─── */
function checkPhaseUp() {
  const nextPhase = State.phase + 1;
  if (nextPhase >= PHASES.length) return false;
  if (State.totalEarned >= PHASES[nextPhase].coinsNeeded) {
    State.phase = nextPhase;
    saveState();
    return true;
  }
  return false;
}

/* ─── MODULE UNLOCK ─── */
function unlockModule(moduleName) {
  if (State.modules[moduleName] === false) {
    State.modules[moduleName] = true;
    saveState();
    return true;
  }
  return false;
}

/* ─── RECIPE UNLOCK ─── */
function unlockRecipe(recipeId) {
  State.recipeUnlocks[recipeId] = true;
  saveState();
}

function isRecipeUnlocked(recipeId) {
  return !!State.recipeUnlocks[recipeId];
}

/* ─── SHOP PURCHASE ─── */
function purchaseShopItem(itemId) {
  State.shopPurchased[itemId] = true;
  saveState();
}

function isShopPurchased(itemId) {
  return !!State.shopPurchased[itemId];
}

/* ─── SHOP INVESTMENTS ─── */
function purchaseShopInvestment(item) {
  if (!item || !item.id) return false;
  if (!State.shopInvestments) State.shopInvestments = {};
  if (State.shopInvestments[item.id]) return false;
  State.shopInvestments[item.id] = true;

  if (!State.shopTraits) State.shopTraits = JSON.parse(JSON.stringify(DEFAULT_STATE.shopTraits));
  Object.entries(item.traits || {}).forEach(([key, value]) => {
    State.shopTraits[key] = (State.shopTraits[key] || 0) + Number(value || 0);
  });
  saveState();
  return true;
}

function isShopInvestmentPurchased(itemId) {
  return !!(State.shopInvestments && State.shopInvestments[itemId]);
}

function getShopTrait(key) {
  return (State.shopTraits && Number(State.shopTraits[key])) || 0;
}

/* ─── UPGRADE ACTIVATION ─── */
function activateUpgrade(effect) {
  if (effect in State.upgrades) {
    State.upgrades[effect] = true;
    saveState();
  }
}

/* ─── STORY UNLOCK ─── */
function unlockStoryEntry(id) {
  if (!State.storyUnlocked.includes(id)) {
    State.storyUnlocked.push(id);
    saveState();
    return true;
  }
  return false;
}

/* ─── BOND / RELATIONSHIP ─── */
function getBondExp(roleId) {
  return (State.bonds && State.bonds[roleId] && State.bonds[roleId].exp) || 0;
}

function getBondLevel(roleId) {
  const exp = getBondExp(roleId);
  let level = 0;
  (BOND_LEVELS || []).forEach(threshold => {
    if (exp >= threshold.exp) level = threshold.level;
  });
  return level;
}

function getNextBondThreshold(roleId) {
  const level = getBondLevel(roleId);
  const next = (BOND_LEVELS || []).find(item => item.level === level + 1);
  return next ? next.exp : Infinity;
}

function addBondExp(roleId, amount) {
  if (!roleId || amount <= 0) return 0;
  if (!State.bonds) State.bonds = {};
  _ensureBondRecord(roleId);
  State.bonds[roleId].exp += amount;
  checkBondStageRewards(roleId);
  saveState();
  return State.bonds[roleId].exp;
}

function checkBondStageRewards(roleId) {
  if (!roleId) return [];
  if (!State.bonds) State.bonds = {};
  const record = _ensureBondRecord(roleId);
  const level = getBondLevel(roleId);
  const rewards = [];
  (BOND_LEVELS || []).forEach(item => {
    if (!item || item.level <= 0 || item.level > level) return;
    const flagKey = `stageReward:${item.level}`;
    if (record.rewardFlags[flagKey]) return;
    const reward = getBondStageReward(roleId, item.level);
    record.rewardFlags[flagKey] = {
      level: item.level,
      label: item.label || `Lv.${item.level}`,
      text: reward.text,
      type: reward.type,
      unlockedAt: Date.now(),
    };
    rewards.push(record.rewardFlags[flagKey]);
  });
  return rewards;
}

function getBondStageReward(roleId, level) {
  const roleRewards = (typeof BOND_STAGE_REWARDS !== 'undefined' && BOND_STAGE_REWARDS[roleId]) || {};
  const custom = roleRewards[level];
  const fallback = (typeof DEFAULT_BOND_STAGE_REWARDS !== 'undefined' && DEFAULT_BOND_STAGE_REWARDS[level])
    || '你们之间的羁绊留下了新的记录。';
  if (custom && typeof custom === 'object') {
    return {
      type: custom.type || 'noteOnly',
      text: custom.text || fallback,
    };
  }
  return {
    type: 'noteOnly',
    text: custom || fallback,
  };
}

function getBondStageRewardHistory(roleId) {
  const record = getBondGiftStats(roleId);
  return Object.values(record.rewardFlags || {})
    .filter(item => item && typeof item === 'object' && item.level > 0 && item.text)
    .sort((a, b) => a.level - b.level);
}

function addBondCoinsSpent(roleId, amount) {
  if (!roleId || amount <= 0) return;
  if (!State.bonds) State.bonds = {};
  _ensureBondRecord(roleId);
  State.bonds[roleId].coinsSpent += amount;
  saveState();
}

function getBondGiftStats(roleId) {
  if (!roleId) {
    return {
      exp: 0,
      gifts: 0,
      coinsSpent: 0,
      lastGiftId: null,
      repeatGiftStreak: 0,
      byGiftId: {},
      byProductId: {},
      byGiftTag: {},
      productGifts: 0,
      lastGiftSource: 'bondGift',
      rewardFlags: {},
    };
  }
  if (!State.bonds) State.bonds = {};
  return _ensureBondRecord(roleId);
}

function getBondGiftCount(roleId, giftId = null) {
  const record = getBondGiftStats(roleId);
  if (!giftId) return record.gifts || 0;
  return (record.byGiftId && record.byGiftId[giftId]) || 0;
}

function getBondProductGiftCount(roleId, productId = null) {
  const record = getBondGiftStats(roleId);
  if (!productId) return record.productGifts || 0;
  return (record.byProductId && record.byProductId[productId]) || 0;
}

function getBondGiftTagCount(roleId, tag) {
  const record = getBondGiftStats(roleId);
  if (!tag) return 0;
  return (record.byGiftTag && record.byGiftTag[tag]) || 0;
}

function recordBondGift(roleId, giftId, cost = 0) {
  if (!roleId || !giftId) return null;
  if (!State.bonds) State.bonds = {};
  const record = _ensureBondRecord(roleId);
  record.gifts += 1;
  record.byGiftId[giftId] = (record.byGiftId[giftId] || 0) + 1;
  record.repeatGiftStreak = record.lastGiftId === giftId
    ? (record.repeatGiftStreak || 0) + 1
    : 1;
  record.lastGiftId = giftId;
  if (cost > 0) record.coinsSpent += cost;
  saveState();
  return record;
}

function recordProductBondGift(roleId, productId, tags = [], cost = 0, legacyGiftId = null) {
  if (!roleId || !productId) return null;
  if (!State.bonds) State.bonds = {};
  const record = _ensureBondRecord(roleId);
  const giftKey = `product:${productId}`;

  record.gifts += 1;
  record.productGifts += 1;
  record.byProductId[productId] = (record.byProductId[productId] || 0) + 1;
  if (legacyGiftId) {
    record.byGiftId[legacyGiftId] = (record.byGiftId[legacyGiftId] || 0) + 1;
  }
  (tags || []).forEach(tag => {
    if (!tag) return;
    record.byGiftTag[tag] = (record.byGiftTag[tag] || 0) + 1;
  });
  record.repeatGiftStreak = record.lastGiftId === giftKey
    ? (record.repeatGiftStreak || 0) + 1
    : 1;
  record.lastGiftId = giftKey;
  record.lastGiftSource = 'productGift';
  if (cost > 0) record.coinsSpent += cost;
  saveState();
  return record;
}

function _ensureBondRecord(roleId) {
  if (!State.bonds[roleId]) State.bonds[roleId] = { exp: 0, gifts: 0, coinsSpent: 0 };
  const record = State.bonds[roleId];
  if (typeof record.exp !== 'number') record.exp = 0;
  if (typeof record.gifts !== 'number') record.gifts = 0;
  if (typeof record.coinsSpent !== 'number') record.coinsSpent = 0;
  if (!record.byGiftId || typeof record.byGiftId !== 'object') record.byGiftId = {};
  if (!('lastGiftId' in record)) record.lastGiftId = null;
  if (typeof record.repeatGiftStreak !== 'number') record.repeatGiftStreak = 0;
  if (!record.byProductId || typeof record.byProductId !== 'object') record.byProductId = {};
  if (!record.byGiftTag || typeof record.byGiftTag !== 'object') record.byGiftTag = {};
  if (typeof record.productGifts !== 'number') record.productGifts = 0;
  if (!record.lastGiftSource) record.lastGiftSource = 'bondGift';
  if (!record.rewardFlags || typeof record.rewardFlags !== 'object') record.rewardFlags = {};
  return record;
}

function recordOrderCompletion(order) {
  if (!order || !order.customer) return;

  const customer = order.customer;
  const identityId = getCustomerIdentityId(customer);
  const personality = customer.personality || 'unknown';
  const customerId = customer.id || identityId || 'unknown';

  _bumpOrderCompletionStat('byCustomerId', customerId);
  if (identityId) _bumpOrderCompletionStat('byIdentity', identityId);
  if (personality) _bumpOrderCompletionStat('byPersonality', personality);
  if (identityId && personality) {
    _bumpOrderCompletionStat('byIdentityPersonality', `${identityId}:${personality}`);
  }

  // Serving a named special character slowly builds relationship progress too.
  if (identityId) addBondExp(identityId, 1);
}

function getOrderCompletionCount(condition = {}) {
  const stats = State.orderCompletionStats || DEFAULT_STATE.orderCompletionStats;
  if (condition.customerId) {
    return (stats.byCustomerId && stats.byCustomerId[condition.customerId]) || 0;
  }
  if (condition.identity && condition.personality) {
    const key = `${condition.identity}:${condition.personality}`;
    return (stats.byIdentityPersonality && stats.byIdentityPersonality[key]) || 0;
  }
  if (condition.identity) {
    return (stats.byIdentity && stats.byIdentity[condition.identity]) || 0;
  }
  if (condition.personality) {
    return (stats.byPersonality && stats.byPersonality[condition.personality]) || 0;
  }
  return State.ordersCompleted || 0;
}

function getCustomerIdentityId(customer) {
  if (!customer) return null;
  if (customer.bondRoleId) return customer.bondRoleId;
  if (customer.identityId) return customer.identityId;
  if (customer._identityId) return customer._identityId;
  if (customer.id && CUSTOMER_IDENTITIES && CUSTOMER_IDENTITIES[customer.id]) return customer.id;

  const matched = Object.entries(CUSTOMER_IDENTITIES || {}).find(([, identity]) => {
    return identity.name === customer.name || identity.emoji === customer.emoji;
  });
  return matched ? matched[0] : null;
}

function _bumpOrderCompletionStat(bucket, key) {
  if (!State.orderCompletionStats) {
    State.orderCompletionStats = JSON.parse(JSON.stringify(DEFAULT_STATE.orderCompletionStats));
  }
  if (!State.orderCompletionStats[bucket]) State.orderCompletionStats[bucket] = {};
  State.orderCompletionStats[bucket][key] = (State.orderCompletionStats[bucket][key] || 0) + 1;
}

/* ─── STATS ─── */
function bumpStat(key, amount = 1) {
  if (key in State.stats) {
    State.stats[key] += amount;
  }
}

/* ─── SETTINGS ─── */
function toggleWordDisplayFormat() {
  State.settings.wordDisplayFormat = 
    State.settings.wordDisplayFormat === 'capitalize' ? 'uppercase' : 'capitalize';
  saveState();
}

function formatWordDisplay(word) {
  if (!word) return '';
  if (State.settings.wordDisplayFormat === 'uppercase') {
    return word.toUpperCase();
  }
  // capitalize: 首字母大写，其余小写
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function formatWordLetter(word, index) {
  return formatWordDisplay(word).charAt(index);
}

/* ─── HELPERS ─── */
function _syncRecipeUnlocks() {
  const allRecipes = [...POTIONS, ...DIVINATIONS, ...CHARMS, ...ALCHEMY];
  allRecipes.forEach(r => {
    if (r.unlocked && !State.recipeUnlocks[r.id]) {
      State.recipeUnlocks[r.id] = true;
    }
    if (!(r.id in State.recipeUnlocks)) {
      State.recipeUnlocks[r.id] = false;
    }
  });
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

/* ─── MAX CONCURRENT ORDERS ─── */
function getMaxOrders() {
  return State.upgrades.more_orders ? 3 : 2;
}

/* ─── ORDER TIMER MULTIPLIER ─── */
function getTimerMultiplier() {
  return State.upgrades.patience ? 1.5 : 1.0;
}

/* ─── REWARD MULTIPLIER ─── */
function getRewardMultiplier() {
  return State.upgrades.tips ? 1.2 : 1.0;
}

/* ─── PHASE CONSTANTS ─── */
const MAX_PHASE = PHASES.length - 1;

function getNextPhaseThreshold() {
  const next = State.phase + 1;
  if (next >= PHASES.length) return Infinity;
  return PHASES[next].coinsNeeded;
}

function advancePhase() {
  if (State.phase < MAX_PHASE) {
    State.phase++;
    saveState();
  }
}

/* ─── ALIAS: loadState = initState ─── */
function loadState() {
  initState();
}

/* ─── STATE PROPERTY ALIASES ─── */
// Attach alternate-name getters to a State object after it has been assigned.
// Called at the end of initState() and resetState() to keep them in sync.
// Aliases: State.unlockedRecipes → recipeUnlocks, State.purchases → shopPurchased
function _attachStateAliases() {
  // Guard: only define if not already defined (avoid overwriting real props)
  if (!Object.getOwnPropertyDescriptor(State, 'unlockedRecipes')) {
    Object.defineProperty(State, 'unlockedRecipes', {
      get() { return this.recipeUnlocks; },
      set(v) { this.recipeUnlocks = v; },
      configurable: true,
      enumerable: false,
    });
  }
  if (!Object.getOwnPropertyDescriptor(State, 'purchases')) {
    Object.defineProperty(State, 'purchases', {
      get() { return this.shopPurchased; },
      set(v) { this.shopPurchased = v; },
      configurable: true,
      enumerable: false,
    });
  }
}
