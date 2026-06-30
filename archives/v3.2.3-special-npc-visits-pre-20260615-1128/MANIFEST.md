# v3.2.3-special-npc-visits-pre-20260615-1128 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/15 11:28:51
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/js/data.js`
- `witch-shop-game/js/customers.js`
- `witch-shop-game/js/ui.js`
- `witch-shop-game/js/state.js`
- `witch-shop-game/CHANGELOG.md`
- `witch-shop-game/AI_HANDOFF.md`
- `witch-shop-game/docs/V3_2_PRODUCT_GIFT_SPECIAL_NPC_PLAN.md`
- `witch-shop-game/docs/QA_CHECKLIST.md`

## 后续填写

- 本轮目标：接入 v3.2.3 特殊 NPC 来访第一版，让 20 个具名熟客进入订单主循环，并在订单卡片区分“普通来客 / 熟客 · 羁绊阶段”。
- 修改文件：`witch-shop-game/js/data.js`、`witch-shop-game/js/customers.js`、`witch-shop-game/js/ui.js`、`witch-shop-game/js/state.js`、`witch-shop-game/css/style.css`、`witch-shop-game/CHANGELOG.md`、`witch-shop-game/AI_HANDOFF.md`、`witch-shop-game/docs/V3_2_PRODUCT_GIFT_SPECIAL_NPC_PLAN.md`、`witch-shop-game/docs/QA_CHECKLIST.md`。
- 验证结果：`node tools/project_check.js` 已通过；语法检查、引用扫描、关键交接文档检查、协作工具检查与归档目录检查均 PASS。
- 回退方式：将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
  - 注意：本归档创建时尚未包含后续补充的 `css/style.css` 标签样式；如需完全回退本轮视觉补丁，请删除 `.order-special-tag` 与 `.order-special-tag.order-general-tag` 样式块。
  - 注意：本归档创建后又补充了羁绊回馈提示补丁，涉及 `js/orders.js`、`js/data.js`、`css/ui.css`、`CHANGELOG.md`、`docs/QA_CHECKLIST.md`。如需回退该补丁，请恢复订单完成流程中 `_showOrderBondStageRewards` 调用与函数、还原阶段回馈文本角色名，并移除 `ui.css` 中对应花括号修复。
