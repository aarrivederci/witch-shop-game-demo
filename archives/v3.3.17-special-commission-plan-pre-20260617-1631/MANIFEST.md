# v3.3.17-special-commission-plan-pre-20260617-1631 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/17 16:31:23
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/docs/QA_CHECKLIST.md`
- `witch-shop-game/docs/V3_ROADMAP.md`
- `witch-shop-game/AI_HANDOFF.md`
- `witch-shop-game/START_HERE.md`
- `witch-shop-game/CHANGELOG.md`

## 后续填写

- 本轮目标：在 v3.3.16 第二批 `another side` QA 入口补齐后，先沉淀 v3.3 特殊委托链规划与 QA 边界，避免直接混入复杂运行时代码。
- 修改文件：`docs/V3_3_SPECIAL_COMMISSION_PLAN.md`、`docs/QA_CHECKLIST.md`、`docs/V3_ROADMAP.md`、`AI_HANDOFF.md`、`START_HERE.md`、`CHANGELOG.md`、本 `MANIFEST.md`。
- 验证结果：`node tools/project_check.js` 通过；语法检查、引用扫描、v3.3 店铺故事条件检查、another side 检查、关键交接文档与归档目录检查均通过。
- 回退方式：将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
