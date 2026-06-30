# v3.3.7-story-condition-check-pre-20260616-0230-20260616-0230 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/16 02:30:51
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/js/data.js`
- `tools/project_check.js`
- `tools/README.md`
- `witch-shop-game/CHANGELOG.md`
- `witch-shop-game/AI_HANDOFF.md`
- `witch-shop-game/docs/QA_CHECKLIST.md`

## 后续填写

- 本轮目标：为 v3.3.3～v3.3.6 流失订单 / 经营 IF / 里世界店铺故事增加静态条件检查，避免旧 `unlock*` 字段与新 `requirements` 镜像在后续扩展中漂移。
- 修改文件：
  - 新增 `tools/check_story_conditions.js`：加载 `witch-shop-game/js/data.js` 的 `STORY_ENTRIES`，检查 9 条目标店铺故事存在性、重复 ID、基础字段、路线、预告、关键条件字段与条件镜像一致性。
  - 修改 `tools/project_check.js`：把 story condition check 纳入统一项目检查，并把新脚本列入必需协作工具。
  - 修改 `tools/README.md`：补充新检查工具说明与常用验证命令。
  - 修改 `witch-shop-game/CHANGELOG.md`：记录 v3.3.7 自动化 QA 变更。
  - 修改 `witch-shop-game/AI_HANDOFF.md`：更新当前阶段、推荐 QA 步骤与 v3.3.7 交接说明。
  - 修改 `witch-shop-game/docs/QA_CHECKLIST.md`：补充故事条件静态检查项。
- 验证结果：
  - `node tools/check_story_conditions.js`：PASS。
  - `node tools/project_check.js`：PASS。
- 回退方式：将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
