# v3.3.11-another-side-samples-pre-20260616-1459 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/16 14:59:21
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/js/data.js`
- `witch-shop-game/js/story.js`
- `tools/project_check.js`
- `tools/check_story_conditions.js`
- `witch-shop-game/docs/V3_3_ANOTHER_SIDE_FRAMEWORK.md`
- `witch-shop-game/docs/DATA_CONTRACTS.md`
- `witch-shop-game/docs/QA_CHECKLIST.md`
- `witch-shop-game/docs/V3_ROADMAP.md`
- `witch-shop-game/AI_HANDOFF.md`
- `witch-shop-game/CHANGELOG.md`
- `tools/README.md`

## 后续填写

- 本轮目标：将 v3.3.8～v3.3.10 的 `another side` 框架落到首批可检查的角色侧面故事样例，并同步交接文档与 QA 入口。
- 修改文件：
  - `witch-shop-game/js/data.js`：新增 `knight_another_side_01`、`demon_another_side_01`、`fairy_another_side_01` 三条角色侧面故事，均使用隐秘工坊、角色羁绊与分类叙事统计作为组合条件。
  - `tools/check_another_side_stories.js`：新增 another side 专项静态检查，验证隐秘工坊、羁绊、`requirements.storyStats` 与玩家可读预告边界。
  - `tools/project_check.js`：接入 another side 专项检查。
  - `tools/README.md`：补充新检查脚本说明与常用命令。
  - `witch-shop-game/docs/V3_3_ANOTHER_SIDE_FRAMEWORK.md`：记录首批样例落地状态。
  - `witch-shop-game/docs/QA_CHECKLIST.md`：补充首批 another side 样例与记录页/分类计数 QA 项。
  - `witch-shop-game/docs/V3_ROADMAP.md`、`START_HERE.md`、`AI_HANDOFF.md`、`CHANGELOG.md`：同步 v3.3.11 当前状态、验证入口与后续建议。
- 验证结果：
  - 已运行：`node tools\project_check.js`
  - 结果：通过。包含语法检查、引用扫描、9 条历史店铺故事条件检查、3 条 another side 样例专项检查、关键交接文档检查、协作工具检查与归档目录检查。
- 回退方式：
  - 如需回退本轮 v3.3.11 改动，可将本归档 `files/` 下的对应文件复制回主项目。
  - 新增文件 `tools/check_another_side_stories.js` 如需完全回退，可删除该文件，并从归档恢复 `tools/project_check.js` 与 `tools/README.md`。
  - 如只回退样例故事，可优先恢复 `witch-shop-game/js/data.js`，再运行 `node tools\project_check.js` 确认一致性。
  - 更多归档/回退规范参考 `docs/VERSION_ARCHIVE.md`。
