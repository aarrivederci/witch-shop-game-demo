# v3.2-story-target-summary-pre-20260614-1803 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/14 18:03:12
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/js/shop.js`
- `witch-shop-game/CHANGELOG.md`
- `witch-shop-game/AI_HANDOFF.md`

## 后续填写

- 本轮目标：补强羁绊页“下个故事”目标提示，避免故事需要店铺气质、金币消费或阶段条件时只显示订单/羁绊。
- 修改文件：
  - `witch-shop-game/js/shop.js`：重构 `_getNextRoleStoryTarget()` / `_formatStoryTarget()`，新增完整故事条件摘要 helper，覆盖订单、羁绊、阶段、累计金币、`unlockStats` 与 `unlockShopTraits`。
  - `witch-shop-game/CHANGELOG.md`：记录本轮变更与归档路径。
  - `witch-shop-game/AI_HANDOFF.md`：更新当前交接上下文。
- 验证结果：已执行 `node tools/project_check.js`，结果 `Project check: PASS`。
- 回退方式：将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
