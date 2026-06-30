# v3.3.10-records-page-pre-20260616-1116 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/16 11:16:34
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/js/data.js`
- `witch-shop-game/js/story.js`
- `witch-shop-game/css/ui.css`
- `witch-shop-game/docs/DATA_CONTRACTS.md`
- `witch-shop-game/docs/V3_ROADMAP.md`
- `witch-shop-game/docs/QA_CHECKLIST.md`
- `witch-shop-game/CHANGELOG.md`
- `witch-shop-game/AI_HANDOFF.md`

## 后续填写

- 本轮目标：实现 v3.3.10 记录页第一版，把 v3.3.9 的职业/角色分类流失计数展示为半隐藏阶段记录，并保持当前统计面板不受污染。
- 修改文件：
  - `witch-shop-game/js/data.js`：新增 `STORY_RECORD_MILESTONES` 阶段记录配置。
  - `witch-shop-game/js/story.js`：新增故事页“故事 / 记录”切换、记录页渲染与阶段卡片读取逻辑。
  - `witch-shop-game/css/ui.css`：新增记录页切换按钮、说明卡与阶段卡片样式。
  - `witch-shop-game/CHANGELOG.md`、`witch-shop-game/AI_HANDOFF.md`、`witch-shop-game/docs/V3_ROADMAP.md`、`witch-shop-game/docs/DATA_CONTRACTS.md`、`witch-shop-game/docs/QA_CHECKLIST.md`：同步 v3.3.10 状态、契约与 QA 项。
- 验证结果：已运行 `node tools/project_check.js`，结果 PASS；语法检查、引用扫描、story condition check、关键交接文档、协作工具与归档目录检查均通过。
- 回退方式：将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
