# v3.3.16-another-side-batch2-qa-pre-20260616-2137-20260616-2137 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/16 21:37:22
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/js/game.js`
- `witch-shop-game/js/data.js`
- `witch-shop-game/docs/QA_CHECKLIST.md`
- `witch-shop-game/docs/V3_3_ANOTHER_SIDE_FRAMEWORK.md`
- `witch-shop-game/docs/V3_ROADMAP.md`
- `witch-shop-game/AI_HANDOFF.md`
- `witch-shop-game/START_HERE.md`
- `witch-shop-game/CHANGELOG.md`

## 后续填写

- 本轮目标：补齐第二批吸血鬼、死灵法师、幽灵 `another side` 的记录页阶段展示与 `WitchDebug.prepareAnotherSide()` 手动 QA 入口。
- 修改文件：`witch-shop-game/js/data.js`、`witch-shop-game/js/game.js`、`witch-shop-game/docs/QA_CHECKLIST.md`、`witch-shop-game/docs/V3_ROADMAP.md`、`witch-shop-game/AI_HANDOFF.md`、`witch-shop-game/START_HERE.md`、`witch-shop-game/CHANGELOG.md`、本 `MANIFEST.md`。
- 验证结果：`node tools/check_another_side_stories.js` 通过；`node tools/project_check.js` 通过。
- 回退方式：将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
