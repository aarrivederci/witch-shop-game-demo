# v3.3.25-reset-save-button-pre-20260630-1843 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/30 18:43:37
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/js/ui.js`
- `witch-shop-game/css/ui.css`
- `witch-shop-game/CHANGELOG.md`
- `witch-shop-game/docs/STATUS.json`
- `witch-shop-game/START_HERE.md`
- `witch-shop-game/AI_HANDOFF.md`

## 后续填写

- 本轮目标：为公开试玩版新增玩家可见的清除当前浏览器存档入口，方便从起名页重新开始。
- 修改文件：`js/ui.js`、`css/ui.css`、`CHANGELOG.md`、`docs/STATUS.json`、`START_HERE.md`、`AI_HANDOFF.md`。
- 验证结果：修改后需执行 `node tools/project_check.js`，并在浏览器手动确认统计页设置区按钮、二次确认与清档刷新流程。
- 回退方式：将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
