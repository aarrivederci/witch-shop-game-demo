const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'witch-shop-game', 'js', 'data.js');

const TARGET_STORY_IDS = [
  'shop_missed_order_note',
  'shop_apology_list',
  'shop_reputation_crisis',
  'shop_second_chance_window',
  'shop_backroom_whispers',
  'shop_repair_counter_lamp',
  'shop_rumor_repair_board',
  'shop_underdoor_receipt',
  'shop_two_paths_at_closing',
];

const REQUIRED_FIELDS = ['id', 'title', 'text', 'scope', 'route', 'preview', 'requirements'];
const ALLOWED_STATS_KEYS = new Set(['customersLostMin', 'coinsSpentTotalMin']);
const ALLOWED_SHOP_TRAIT_KEYS = new Set(['comfortMin', 'mysteryMin', 'wisdomMin', 'fameMin']);

function loadStoryEntries() {
  const source = fs.readFileSync(dataPath, 'utf8');
  const sandbox = { console };
  const script = `${source}\n;({ STORY_ENTRIES });`;
  return vm.runInNewContext(script, sandbox, {
    filename: dataPath,
    timeout: 1000,
  }).STORY_ENTRIES;
}

function stableJson(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  const sorted = Object.keys(value).sort().reduce((acc, key) => {
    acc[key] = value[key];
    return acc;
  }, {});
  return JSON.stringify(sorted);
}

function sameObject(a, b) {
  return stableJson(a || {}) === stableJson(b || {});
}

function pushError(errors, id, message) {
  errors.push(`${id}: ${message}`);
}

function checkDuplicateIds(entries, errors) {
  const seen = new Set();
  entries.forEach(entry => {
    if (!entry || !entry.id) return;
    if (seen.has(entry.id)) {
      pushError(errors, entry.id, 'duplicate story id');
    }
    seen.add(entry.id);
  });
}

function checkPositiveNumbers(id, groupName, group, allowedKeys, errors) {
  Object.entries(group || {}).forEach(([key, value]) => {
    if (!allowedKeys.has(key)) {
      pushError(errors, id, `unexpected ${groupName} key "${key}"`);
    }
    if (!Number.isFinite(value) || value <= 0) {
      pushError(errors, id, `${groupName}.${key} should be a positive number`);
    }
  });
}

function checkEntry(entry, errors) {
  const id = entry.id || '(missing id)';

  REQUIRED_FIELDS.forEach(field => {
    if (entry[field] === undefined || entry[field] === null) {
      pushError(errors, id, `missing required field "${field}"`);
    }
  });

  if (entry.scope !== 'shop') {
    pushError(errors, id, 'scope should be "shop"');
  }

  if (!['if', 'inner'].includes(entry.route)) {
    pushError(errors, id, 'route should be "if" or "inner" for v3.3 lost-order branch stories');
  }

  if (!entry.preview || typeof entry.preview !== 'object') {
    pushError(errors, id, 'preview should be an object');
  } else {
    ['hiddenTitle', 'hint', 'visibleHints', 'revealPolicy'].forEach(field => {
      if (entry.preview[field] === undefined || entry.preview[field] === null) {
        pushError(errors, id, `preview missing "${field}"`);
      }
    });
    if (!Array.isArray(entry.preview.visibleHints) || entry.preview.visibleHints.length === 0) {
      pushError(errors, id, 'preview.visibleHints should be a non-empty array');
    }
  }

  const requirementStats = entry.requirements && entry.requirements.stats;
  const requirementShopTraits = entry.requirements && entry.requirements.shopTraits;

  if (!sameObject(entry.unlockStats, requirementStats)) {
    pushError(errors, id, 'unlockStats and requirements.stats are not mirrored');
  }

  if (!sameObject(entry.unlockShopTraits, requirementShopTraits)) {
    pushError(errors, id, 'unlockShopTraits and requirements.shopTraits are not mirrored');
  }

  if (!requirementStats || !Number.isFinite(requirementStats.customersLostMin)) {
    pushError(errors, id, 'requirements.stats.customersLostMin is required');
  }

  checkPositiveNumbers(id, 'requirements.stats', requirementStats, ALLOWED_STATS_KEYS, errors);
  checkPositiveNumbers(id, 'requirements.shopTraits', requirementShopTraits, ALLOWED_SHOP_TRAIT_KEYS, errors);
}

function main() {
  console.log('== story condition check ==');
  const errors = [];
  const entries = loadStoryEntries();
  const byId = new Map(entries.map(entry => [entry.id, entry]));

  checkDuplicateIds(entries, errors);

  TARGET_STORY_IDS.forEach(id => {
    const entry = byId.get(id);
    if (!entry) {
      pushError(errors, id, 'target story is missing');
      return;
    }
    checkEntry(entry, errors);
    console.log(`OK   ${id}`);
  });

  if (errors.length > 0) {
    console.log('\nStory condition check: FAIL');
    errors.forEach(error => console.log(`FAIL ${error}`));
    process.exit(1);
  }

  console.log('OK story condition check');
}

main();