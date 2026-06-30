# v3.2.1-data-contracts-pre-20260615-0038 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/15 00:38:02
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/docs/DATA_CONTRACTS.md`
- `witch-shop-game/docs/V3_2_PRODUCT_GIFT_SPECIAL_NPC_PLAN.md`
- `witch-shop-game/CHANGELOG.md`
- `witch-shop-game/AI_HANDOFF.md`

## 后续填写

- 本轮目标：完成 v3.2.1 文档与数据契约整理，为商品赠礼与特殊 NPC 关系循环进入运行时实现前补齐字段边界、兼容策略与协作交接说明。
- 修改文件：
  - `witch-shop-game/docs/DATA_CONTRACTS.md`：新增商品赠礼、`State.bonds[roleId]` 扩展、一般/特殊 NPC 分层、特殊 NPC 订单与羁绊回馈契约。
  - `witch-shop-game/docs/V3_2_PRODUCT_GIFT_SPECIAL_NPC_PLAN.md`：标记 v3.2.1 完成，并记录 `BOND_GIFTS` 兼容、`productGift` 接入、`npcType` 分层、特殊 NPC 同时最多 1 单、`noteOnly` 回馈等关键决策。
  - `witch-shop-game/CHANGELOG.md`：补充 Unreleased 记录和本归档路径。
  - `witch-shop-game/AI_HANDOFF.md`：更新当前阶段、最新上下文与推荐下一步。
- 验证结果：已运行 `node tools/project_check.js`，结果 PASS；语法检查、引用扫描、关键交接文档、协作工具与归档目录检查均通过。
- 回退方式：将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
