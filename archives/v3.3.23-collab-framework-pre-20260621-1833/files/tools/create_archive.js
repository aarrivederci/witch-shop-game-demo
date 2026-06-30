const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const projectDir = path.join(root, 'witch-shop-game');
const archiveRoot = path.join(projectDir, 'archives');

function pad(n) {
  return String(n).padStart(2, '0');
}

function timestamp() {
  const d = new Date();
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function usage() {
  console.log(`Usage:
  node tools/create_archive.js --name <version-name> [--full] [--files <path1,path2,...>]

Examples:
  node tools/create_archive.js --name v3.2-economy --files witch-shop-game/js/state.js,witch-shop-game/js/shop.js,witch-shop-game/CHANGELOG.md
  node tools/create_archive.js --name v3.2-baseline --full

Notes:
  - Paths are relative to repository root.
  - Light archives copy files into witch-shop-game/archives/<name>-<timestamp>/files/.
  - Full archives copy the runnable witch-shop-game baseline into witch-shop-game/archives/<name>-<timestamp>-full/.
`);
}

function parseArgs(argv) {
  const result = {name: '', full: false, files: []};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--name') {
      result.name = argv[i + 1] || '';
      i += 1;
    } else if (arg === '--full') {
      result.full = true;
    } else if (arg === '--files') {
      const raw = argv[i + 1] || '';
      result.files = raw.split(',').map(s => s.trim()).filter(Boolean);
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      result.help = true;
    }
  }
  return result;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, {recursive: true});
}

function copyFileWithDirs(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest, ignoreNames = new Set()) {
  ensureDir(dest);
  fs.readdirSync(src, {withFileTypes: true}).forEach(entry => {
    if (ignoreNames.has(entry.name)) return;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to, ignoreNames);
    } else if (entry.isFile()) {
      copyFileWithDirs(from, to);
    }
  });
}

function normalizeRel(file) {
  return file.replace(/\\/g, '/').replace(/^\.\//, '');
}

function createLightArchive(name, files) {
  const archiveName = `${name}-${timestamp()}`;
  const archiveDir = path.join(archiveRoot, archiveName);
  const filesDir = path.join(archiveDir, 'files');
  ensureDir(filesDir);

  const copied = [];
  files.forEach(file => {
    const rel = normalizeRel(file);
    const src = path.join(root, rel);
    if (!fs.existsSync(src) || !fs.statSync(src).isFile()) {
      console.warn(`SKIP missing file: ${rel}`);
      return;
    }
    const destRel = rel.startsWith('witch-shop-game/') ? rel.slice('witch-shop-game/'.length) : rel;
    const dest = path.join(filesDir, destRel);
    copyFileWithDirs(src, dest);
    copied.push(rel);
  });

  writeManifest(archiveDir, archiveName, 'light', copied);
  return archiveDir;
}

function createFullArchive(name) {
  const archiveName = `${name}-${timestamp()}-full`;
  const archiveDir = path.join(archiveRoot, archiveName);
  const ignore = new Set(['archives']);
  copyDir(projectDir, archiveDir, ignore);
  writeManifest(archiveDir, archiveName, 'full', ['witch-shop-game/** except archives/']);
  return archiveDir;
}

function writeManifest(archiveDir, archiveName, type, copied) {
  const manifest = `# ${archiveName} 归档清单

## 归档信息

- 类型：${type === 'full' ? '完整可运行快照' : '轻量归档'}
- 创建时间：${new Date().toLocaleString()}
- 创建工具：\`node tools/create_archive.js\`

## 已备份内容

${copied.length ? copied.map(item => `- \`${item}\``).join('\n') : '- 暂无文件'}

## 后续填写

- 本轮目标：待填写
- 修改文件：待填写
- 验证结果：待填写
- 回退方式：将本归档中的对应文件复制回主项目，或参考 \`docs/VERSION_ARCHIVE.md\`。
`;
  fs.writeFileSync(path.join(archiveDir, 'MANIFEST.md'), manifest, 'utf8');
}

const args = parseArgs(process.argv.slice(2));
if (args.help || !args.name) {
  usage();
  process.exit(args.help ? 0 : 1);
}

ensureDir(archiveRoot);

let archiveDir;
if (args.full) {
  archiveDir = createFullArchive(args.name);
} else {
  if (!args.files.length) {
    console.error('ERROR: light archive requires --files <path1,path2,...>. Use --full for a full snapshot.');
    usage();
    process.exit(1);
  }
  archiveDir = createLightArchive(args.name, args.files);
}

console.log(`Archive created: ${path.relative(root, archiveDir)}`);