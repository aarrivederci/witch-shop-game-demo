# v3.2-gift-story-conditions-pre-20260614-1900-20260614-1900 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/14 19:00:13
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/js/state.js`
- `witch-shop-game/js/data.js`
- `witch-shop-game/js/shop.js`
- `witch-shop-game/js/story.js`
- `witch-shop-game/CHANGELOG.md`
- `witch-shop-game/AI_HANDOFF.md`

## 后续填写

- 本轮目标：把 v3.2 的“金币消耗与羁绊经济循环”继续向故事系统闭环推进，让送礼行为不只增加羁绊经验，也能成为角色故事解锁条件与玩家可见目标。
- 修改文件：
  - `witch-shop-game/js/state.js`：羁绊记录补充 `byGiftId`、`lastGiftId`、`repeatGiftStreak`，新增/补强送礼计数读取与记录逻辑。
  - `witch-shop-game/js/data.js`：为中后段角色故事生成 `unlockGifts` 条件，包含累计送礼与角色标志礼物要求。
  - `witch-shop-game/js/story.js`：未解锁故事卡片展示送礼条件，并在故事解锁检查中纳入 `unlockGifts`。
  - `witch-shop-game/js/shop.js`：羁绊页“下个故事”摘要展示总送礼数与指定礼物目标。
  - `witch-shop-game/CHANGELOG.md`：记录本轮 Unreleased 变更。
  - `witch-shop-game/AI_HANDOFF.md`：刷新最新上下文，便于后续模型接手。
- 验证结果：已运行 `node tools/project_check.js 2>&1; node tools/check_syntax.js 2>&1`，结果通过：`Project check: PASS` 与 `OK syntax check`。
- 回退方式：将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
