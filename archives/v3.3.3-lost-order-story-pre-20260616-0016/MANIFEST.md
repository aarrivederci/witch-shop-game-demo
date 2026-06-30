# v3.3.3-lost-order-story-pre-20260616-0016 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/16 00:16:00
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/js/data.js`
- `witch-shop-game/js/story.js`
- `witch-shop-game/docs/DATA_CONTRACTS.md`
- `witch-shop-game/CHANGELOG.md`
- `witch-shop-game/docs/QA_CHECKLIST.md`
- `witch-shop-game/AI_HANDOFF.md`

## 后续填写

- 本轮目标：补齐失败/流失订单相关的店铺 IF 线故事，并保持故事数据契约兼容。
- 修改文件：`witch-shop-game/js/data.js`
- 验证结果：`node tools/project_check.js` PASS（语法检查、引用扫描、必需文档/工具/归档检查均通过）。
- 回退方式：将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
