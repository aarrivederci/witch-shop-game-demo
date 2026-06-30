# v3.3.5-debug-qa-pre-20260616-0059 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/16 00:59:44
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/js/state.js`
- `witch-shop-game/js/story.js`
- `witch-shop-game/js/game.js`
- `witch-shop-game/CHANGELOG.md`
- `witch-shop-game/AI_HANDOFF.md`
- `witch-shop-game/docs/QA_CHECKLIST.md`

## 后续填写

- 本轮目标：为 v3.3 流失订单 / 经营 IF 故事线增加低侵入本地 QA 调试入口，方便快速造数验证 `customersLost`、累计消费与店铺气质组合条件。
- 修改文件：
  - `witch-shop-game/js/game.js`：启动完成后挂载 `window.WitchDebug` 控制台辅助方法。
  - `witch-shop-game/CHANGELOG.md`：记录 v3.3.5 调试验证辅助。
  - `witch-shop-game/AI_HANDOFF.md`：更新当前阶段、推荐 QA 与 `WitchDebug` 使用提示。
  - `witch-shop-game/docs/QA_CHECKLIST.md`：补充控制台调试入口人工验证项。
- 验证结果：`node tools/project_check.js` 已通过，包含语法检查、引用扫描、关键交接文档、协作工具与归档目录检查。
- 回退方式：将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
