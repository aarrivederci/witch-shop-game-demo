# 多模型 / Agent 协作角色

本文件定义在 `witch-shop-game` 上协作时推荐的四种 agent 角色，避免多模型同时接手时职责重叠或彼此覆盖修改。

> 任何模型在不明确角色时，默认按 **Planner → Coder → QA → Archivist** 串行流程独自走完一轮。多个 agent 同时在线时，按本文件分工。

## 1. 角色一览

| 角色 | 主要职责 | 读 | 写 | 不应触碰 |
|---|---|---|---|---|
| Planner | 解析需求，拆 backlog，决定本轮范围 | 全仓 | `docs/NEXT.md`、`docs/STATUS.json`、`docs/SCRATCH.md` | `js/`、`css/`、`index.html`、`archives/` |
| Coder | 落地数据 / UI / 工具实现 | 全仓 | `js/`、`css/`、`index.html`、`tools/`、`docs/DATA_CONTRACTS.md`（仅扩展字段时） | `archives/`、`STATUS.json` 的 `currentVersion` 字段 |
| QA | 运行检查、做手动验收、维护 QA 清单 | 全仓 | `docs/QA_CHECKLIST.md`、`archives/<latest>/manifest.json` 的 `verifiedBy` 字段 | 业务代码（除明显笔误外） |
| Archivist | 维护 CHANGELOG、归档、入口文档一致性 | 全仓 | `CHANGELOG.md`、`START_HERE.md`、`AI_HANDOFF.md`、`docs/V3_ROADMAP.md`、`docs/STATUS.json`、`archives/<current>/MANIFEST.md` | `js/`、`css/`、`index.html` |

## 2. 入场清单（每个角色接手时必读）

所有角色：

1. `START_HERE.md`
2. `docs/STATUS.json`（机读真相 — 当前版本号、阶段、待办轨道）
3. `CHANGELOG.md` 的 Unreleased 段

按角色追加：

- **Planner**：`AI_HANDOFF.md §6`、`docs/V3_ROADMAP.md`、`docs/NEXT.md`
- **Coder**：`FRAMEWORK.md`、`docs/DATA_CONTRACTS.md`、相关模块源码
- **QA**：`docs/QA_CHECKLIST.md`、`tools/README.md`
- **Archivist**：`docs/VERSION_ARCHIVE.md`、`docs/ARCHIVE_LIFECYCLE.md`、最近 3 个 `archives/*/MANIFEST.md`

## 3. 出场清单（每个角色交出工作前必做）

| 角色 | 出场动作 |
|---|---|
| Planner | 在 `docs/NEXT.md` 写入或更新本轮候选项；如本轮决定推进，把目标项的 `status` 改为 `in_progress`；不直接改 `STATUS.json` 版本号 |
| Coder | 跑 `node tools/check_syntax.js` 通过；改动若涉及数据契约，同步 `docs/DATA_CONTRACTS.md` |
| QA | 跑 `node tools/project_check.js` 通过；在 `archives/<current>/manifest.json` 写入 `verifiedBy`；按 `QA_CHECKLIST.md` 勾选相关条目 |
| Archivist | 写本轮 CHANGELOG 条目；更新 `START_HERE.md §3` 与 `AI_HANDOFF.md §2` 的当前状态；改 `STATUS.json` 的 `currentVersion / latestArchive / unreleasedHighlights`；保证 `node tools/check_status_consistency.js` 通过 |

## 4. 与 Claude Code subagent 的映射

如果你是 Claude Code 主代理在调度，可按下表选 subagent：

| 项目角色 | 推荐 subagent | 说明 |
|---|---|---|
| Planner | `Plan` | 软件架构规划，输出 step-by-step 计划 |
| Coder | 主代理直接动手 | 落地实现，必要时让 `Explore` 找代码位置 |
| QA | `verify` 技能 + `Explore` | 跑检查并做手动验收 |
| Archivist | 主代理直接动手 | 文档同步与 CHANGELOG 整理，机械度高 |

## 5. 并发冲突规约

- 同一时间最多 **1 个 Coder** 改 `js/`，多个 Coder 必须在 `docs/NEXT.md` 里认领不同的 `track id`。
- Archivist 必须在 Coder 完成后才能合并归档；如检测到 Coder 仍在写，应等待或开新一轮 `vX.Y.Z-pre-coder2` 归档。
- 任何角色发现 `node tools/check_status_consistency.js` 报错，应立刻停止本职工作并修复一致性，再继续。
- 不要并行运行两次 `tools/create_archive.js`（时间戳分钟级，可能撞文件夹名）。

## 6. 用户视角

用户只需要记住一句话：

```text
请读取 D:\mnemez\project 02\witch-shop-game\START_HERE.md，然后接手项目。
```

接手 AI 应自行决定本次扮演哪个角色（默认通才串行四个角色），无需用户指定。
