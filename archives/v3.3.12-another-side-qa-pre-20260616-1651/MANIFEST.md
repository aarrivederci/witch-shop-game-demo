# v3.3.12-another-side-qa-pre-20260616-1651 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/16 16:51:27
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/js/game.js`
- `witch-shop-game/js/state.js`
- `witch-shop-game/js/story.js`
- `witch-shop-game/docs/QA_CHECKLIST.md`
- `witch-shop-game/CHANGELOG.md`
- `witch-shop-game/AI_HANDOFF.md`
- `witch-shop-game/START_HERE.md`
- `witch-shop-game/docs/V3_ROADMAP.md`

## 本轮目标

- 将 v3.3.11 首批 `another side` 样例推进到可快速手动 QA：通过控制台一次性准备隐秘工坊、羁绊 Lv.2 与分类叙事统计条件。

## 修改文件

- `witch-shop-game/js/game.js`：`WitchDebug` 新增 `setBondLevel()`、`unlockInvestment()`、`prepareAnotherSide()`，用于准备骑士、恶魔、花仙子首批 `another side` 解锁条件。
- `witch-shop-game/docs/QA_CHECKLIST.md`：补充 v3.3.12 手动 QA 脚本与分步条件验证项。
- `witch-shop-game/CHANGELOG.md`：记录 v3.3.12 改动、归档与验证入口。
- `witch-shop-game/START_HERE.md`：同步当前状态与新增归档目录。
- `witch-shop-game/AI_HANDOFF.md`：同步 v3.3.12 当前阶段、调试入口与后续建议。

## 验证结果

- 已运行：`node tools\project_check.js`
- 结果：通过。包含语法检查、引用扫描、9 条历史店铺故事条件检查、3 条 another side 样例专项检查、关键交接文档检查、协作工具检查与归档目录检查。

## 回退方式

- 如需回退本轮 v3.3.12 改动，可将本归档 `files/` 下的对应文件复制回主项目。
- 本轮未新增文件；只需恢复 `js/game.js` 与相关文档即可撤销 QA 辅助入口。
