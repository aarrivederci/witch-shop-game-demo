# v3.3.22-project-check-archive-sort-pre-20260621-1623 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/21 16:23:20
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `tools/project_check.js`
- `witch-shop-game/CHANGELOG.md`

## 本轮说明

- 本轮目标：让 `tools/project_check.js` 的归档展示与 `tools/handoff_status.js` 一样按真实最近修改时间排序。
- 修改文件：`tools/project_check.js`、`CHANGELOG.md`。
- 验证结果：`node tools/project_check.js` 通过，Archives 区块已按真实最近修改时间显示 v3.3.22、v3.3.19、v3.3.18 等最新归档。
- 回退方式：将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
