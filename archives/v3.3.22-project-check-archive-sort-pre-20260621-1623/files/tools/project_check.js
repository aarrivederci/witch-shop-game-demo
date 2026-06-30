const {spawnSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const projectDir = path.join(root, 'witch-shop-game');

function run(label, command, args) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    console.log(`FAIL ${label}`);
    return false;
  }
  console.log(`OK ${label}`);
  return true;
}

function checkExists(relPath) {
  const fullPath = path.join(root, relPath);
  const ok = fs.existsSync(fullPath);
  console.log(`${ok ? 'OK  ' : 'MISS'} ${relPath}`);
  return ok;
}

function checkDocs() {
  console.log('\n== Required handoff docs ==');
  const docs = [
    'witch-shop-game/START_HERE.md',
    'witch-shop-game/AI_HANDOFF.md',
    'witch-shop-game/CHANGELOG.md',
    'witch-shop-game/docs/V3_ROADMAP.md',
    'witch-shop-game/docs/VERSION_ARCHIVE.md',
    'witch-shop-game/docs/DATA_CONTRACTS.md',
    'witch-shop-game/docs/QA_CHECKLIST.md',
    'witch-shop-game/STORY_SYSTEM_ROADMAP.md',
  ];
  return docs.map(checkExists).every(Boolean);
}

function checkTools() {
  console.log('\n== Required collaboration tools ==');
  const tools = [
    'tools/create_archive.js',
    'tools/project_check.js',
    'tools/handoff_status.js',
    'tools/check_story_conditions.js',
    'tools/check_another_side_stories.js',
    'tools/check_special_commissions.js',
  ];
  return tools.map(checkExists).every(Boolean);
}

function checkArchives() {
  console.log('\n== Archives ==');
  const archiveDir = path.join(projectDir, 'archives');
  if (!fs.existsSync(archiveDir)) {
    console.log('MISS witch-shop-game/archives');
    return false;
  }
  const entries = fs.readdirSync(archiveDir, {withFileTypes: true}).filter(e => e.isDirectory());
  console.log(`OK   witch-shop-game/archives (${entries.length} dirs)`);
  const latest = entries.map(e => e.name).sort().slice(-5);
  latest.forEach(name => console.log(`     ${name}`));
  return true;
}

let ok = true;
ok = run('syntax check', 'node', ['tools/check_syntax.js']) && ok;
ok = run('reference scan', 'node', ['tools/check_refs.js']) && ok;
ok = run('story condition check', 'node', ['tools/check_story_conditions.js']) && ok;
ok = run('another side story check', 'node', ['tools/check_another_side_stories.js']) && ok;
ok = run('special commission check', 'node', ['tools/check_special_commissions.js']) && ok;
ok = checkDocs() && ok;
ok = checkTools() && ok;
ok = checkArchives() && ok;

console.log(`\nProject check: ${ok ? 'PASS' : 'FAIL'}`);
process.exit(ok ? 0 : 1);