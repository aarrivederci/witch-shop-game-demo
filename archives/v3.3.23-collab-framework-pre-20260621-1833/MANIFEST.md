# v3.3.23-collab-framework-pre-20260621-1833 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026-06-21 18:33
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/START_HERE.md`
- `witch-shop-game/AI_HANDOFF.md`
- `witch-shop-game/CHANGELOG.md`
- `witch-shop-game/docs/V3_ROADMAP.md`
- `tools/create_archive.js`
- `tools/project_check.js`
- `tools/README.md`

## 本轮说明

- **目标**：把多模型 / agent 协作框架做一次查漏补缺，从"扁平接手 + 散文档"升级为"机读真相 + 自动 post-flight + 结构化 backlog + 角色分工"。
- **修改文件**：
  - 入口文档：`START_HERE.md`、`AI_HANDOFF.md`、`CHANGELOG.md`
  - 工具：`tools/create_archive.js`、`tools/project_check.js`、`tools/README.md`、新增 `tools/check_status_consistency.js`
  - 目录：`tools/witch-shop-game/` → `tools/legacy-tests/`；根目录 30 个一次性脚本 → `archives/_root_legacy_scripts/`
  - 新增文档：`witch-shop-game/docs/STATUS.json`、`docs/AGENT_ROLES.md`、`docs/NEXT.md`、`docs/ARCHIVE_LIFECYCLE.md`、`docs/SCRATCH.md`、`docs/I18N_STATUS.md`
- **验证结果**：`node tools/project_check.js` 全 PASS，含新增 `status consistency` 检查；`STATUS.json.currentVersion (v3.3.23)` 与 `START_HERE / AI_HANDOFF / CHANGELOG` 三处一致。
- **回退方式**：把本归档 `files/` 中的对应文件复制回主项目，并把 30 个一次性脚本从 `archives/_root_legacy_scripts/` 移回根目录；如需保留新框架仅回退某一项，参考 `docs/VERSION_ARCHIVE.md`。
