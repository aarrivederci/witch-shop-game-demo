# v3.2-story-shoptrait-hints-pre-20260614-1721 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/14 17:21:25
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/js/story.js`
- `witch-shop-game/CHANGELOG.md`
- `witch-shop-game/AI_HANDOFF.md`

## 后续填写

- 本轮目标：补齐未解锁故事卡片中 `unlockShopTraits` 店铺气质条件的可见进度提示，避免店铺投资故事条件只参与判定、不显示给玩家。
- 修改文件：
  - `witch-shop-game/js/story.js`：`_getUnlockHints()` 追加 `unlockShopTraits` 提示生成。
  - `witch-shop-game/CHANGELOG.md`：记录本轮修复与归档路径。
  - `witch-shop-game/AI_HANDOFF.md`：更新当前上下文，说明店铺投资故事提示已接入。
- 验证结果：已运行 `node tools/project_check.js`，结果 `Project check: PASS`。
- 回退方式：将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
