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
当前建议：先做 v3.2.4 手动 QA / 封版确认；确认无阻塞后进入 v3.3 故事条件网络、特殊委托与半隐藏预告
```

已存在的重要归档：

```text
archives/v3.1-baseline-20260614-0428-full/
archives/v3.1-collab-docs-20260614-0444/
archives/v3.1-handoff-entry-20260614-0519/
archives/v3.1-automation-20260614-0535/
archives/v3.2.4-inventory-pre-20260615-1416/
archives/v3.2.4-closeout-docs-pre-20260615-1603/
archives/v3.2.4-qa-closeout-pre-20260615-2256-20260615-2256/
```

v3.2.4 封版 QA 请优先查看：

```text
docs/QA_CHECKLIST.md 的 “v3.2.4 封版端到端场景”
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
