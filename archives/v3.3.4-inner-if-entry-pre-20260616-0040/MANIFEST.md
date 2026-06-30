# v3.3.4-inner-if-entry-pre-20260616-0040 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/16 00:40:16
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/js/data.js`

## 后续填写

- 本轮目标：推进 v3.3 经营 IF / 里世界入口最小闭环第一步，让流失订单、累计金币投入与店铺气质共同参与隐藏店铺故事解锁。
- 修改文件：
  - `witch-shop-game/js/data.js`：新增 `shop_second_chance_window` 与 `shop_backroom_whispers` 两条店铺故事。
  - `witch-shop-game/CHANGELOG.md`：记录 v3.3.4 改动。
  - `witch-shop-game/AI_HANDOFF.md`：更新当前阶段、已完成内容与推荐 QA。
  - `witch-shop-game/docs/QA_CHECKLIST.md`：补充组合条件故事人工检查项。
- 验证结果：已运行 `node tools/project_check.js`，结果 PASS；语法检查、引用扫描、关键交接文档、协作工具与归档目录检查均通过。
- 回退方式：将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
