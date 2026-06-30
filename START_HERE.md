# START HERE / 先读这里

如果你是接手 `witch-shop-game` 的新 AI、协作者或后续模型，请从这个文件开始。

用户不需要记住复杂流程。你应该自己读取必要文档，并以最新项目进度为准。

## 1. 必读文件

请按顺序阅读：

1. `START_HERE.md`：唯一入口。
2. `AI_HANDOFF.md`：协作规则、修改前后流程、注意事项。
3. `CHANGELOG.md`：最近完成了什么。
4. `docs/V3_ROADMAP.md`：当前 v3.0 阶段路线图与下一步。

## 2. 按任务类型追加阅读

如果要修改数据结构、存档字段、ID、金币/羁绊/礼物字段，请读：

```text
docs/DATA_CONTRACTS.md
```

如果要修改故事、角色、礼物、羁绊、内容包，请读：

```text
STORY_SYSTEM_ROADMAP.md
```

如果要做修改后验证，请读：

```text
docs/QA_CHECKLIST.md
```

如果要创建或回退归档，请读：

```text
docs/VERSION_ARCHIVE.md
```

## 3. 当前项目状态

当前状态：

```text
v3.1 基线整理与协作文档已完成
v3.1-automation 自动归档与检查已完成
v3.2 商品赠礼与特殊 NPC 关系循环已完成最小闭环
当前处于 v3.3：故事条件网络、特殊委托与半隐藏预告；代码与 CHANGELOG 已推进到 v3.3.24，已完成 Git 准备整理（根目录 README、.gitignore、.gitattributes、本地 Git 初始化），尚未接入正式特殊委托任务系统
```

机读真相：`docs/STATUS.json`（`currentVersion / openTracks / latestArchive`）。
多模型协作角色与并发规约：`docs/AGENT_ROLES.md`。
下一步候选 backlog：`docs/NEXT.md`。

已存在的重要归档：

```text
archives/v3.1-baseline-20260614-0428-full/
archives/v3.1-collab-docs-20260614-0444/
archives/v3.1-handoff-entry-20260614-0519/
archives/v3.1-automation-20260614-0535/
archives/v3.2.4-inventory-pre-20260615-1416/
archives/v3.2.4-closeout-docs-pre-20260615-1603/
archives/v3.2.4-qa-closeout-pre-20260615-2256-20260615-2256/
archives/v3.3.1-preview-hints-pre-20260615-2312/
archives/v3.3.7-story-condition-check-pre-20260616-0230-20260616-0230/
archives/v3.3.8-another-side-framework-pre-20260616-0418-20260616-0418/
archives/v3.3.9-story-stats-pre-20260616-1035-20260616-1035/
archives/v3.3.10-records-page-pre-20260616-1116/
archives/v3.3.11-another-side-samples-pre-20260616-1459/
archives/v3.3.12-another-side-qa-pre-20260616-1651/
archives/v3.3.13-another-side-qa-template-pre-20260616-1817/
archives/v3.3.14-another-side-batch2-plan-pre-20260616-1850/
archives/v3.3.15-another-side-batch2-data-pre-20260616-2025/
archives/v3.3.16-another-side-batch2-qa-pre-20260616-2137-20260616-2137/
archives/v3.3.17-special-commission-plan-pre-20260617-1631/
archives/v3.3.18-special-commission-sample-pre-20260617-1938/
archives/v3.3.19-special-commission-ui-pre-20260618-1100/
```

v3.2.4 封版 QA、v3.3 店铺故事条件检查、v3.3.8 another side 边界与 v3.3.21 当前 UI 状态请优先查看：

```text
docs/QA_CHECKLIST.md 的 “v3.2.4 封版端到端场景”
node tools/check_story_conditions.js
docs/V3_3_ANOTHER_SIDE_FRAMEWORK.md
docs/V3_3_SPECIAL_COMMISSION_PLAN.md
node tools/check_another_side_stories.js
node tools/check_special_commissions.js
CHANGELOG.md 的 Unreleased 顶部条目
```

## 4. 给后续 AI 的要求

- 不要要求用户记住复杂命令或文档路径。
- 如果用户只说“接手项目”，你应该先读本文件。
- 以最新对话进度和最近文档状态为准，不要机械回到最初 task。
- 修改前先创建归档。
- 修改后更新 `CHANGELOG.md` 和对应归档 `MANIFEST.md`。
- 修改后至少运行：

```bash
node tools/project_check.js
```

如果只想做最小语法检查，也可以运行：

```bash
node tools/check_syntax.js
```

## 5. 用户切换模型时最短提示

用户只需要把下面这句话发给新模型：

```text
请读取 D:\mnemez\project 02\witch-shop-game\START_HERE.md，然后接手项目。
```
