# 开发日志 / Changelog

本文件用于记录 `witch-shop-game` 每轮迭代的目标、改动、验证结果与回退提示，方便后续查看、自检、多模型协作和功能回退。

## v3.1-collab-docs - 2026-06-14 04:44

### 迭代目标

- 补齐多模型协作入口，降低后续模型接手成本。
- 明确数据结构、ID、存档字段的兼容契约。
- 建立语法检查之外的人工 QA 清单。
- 区分轻量归档与完整可运行快照。

### 主要改动

- 新增 `AI_HANDOFF.md`
  - 作为后续 AI/协作者接手项目的第一入口。
  - 明确必读文档顺序、修改前流程、修改后流程和禁止事项。
- 新增 `docs/DATA_CONTRACTS.md`
  - 记录存档 key、核心状态字段、模块 ID、升级 effect ID、故事字段兼容原则。
  - 为 v3.2 礼物、羁绊、金币消费统计预留结构建议。
- 新增 `docs/QA_CHECKLIST.md`
  - 补充订单、商店、故事、羁绊、金币经济与归档日志的人工检查项。
- 更新 `docs/VERSION_ARCHIVE.md`
  - 增加轻量归档与完整可运行快照的区别。
  - 增加多模型协作时对 `AI_HANDOFF.md`、`DATA_CONTRACTS.md`、`QA_CHECKLIST.md` 的引用。

### 验证

- 文档变更不改变运行时代码。
- 仍建议本轮结束前运行：`node tools/check_syntax.js`。

### 回退提示

本轮修改前已创建轻量归档：

```text
archives/v3.1-collab-docs-20260614-0444/files/
```

其中包含修改前的：

```text
CHANGELOG.md
VERSION_ARCHIVE.md
```

新增文档如需回退，可删除：

```text
AI_HANDOFF.md
docs/DATA_CONTRACTS.md
docs/QA_CHECKLIST.md
```

## v3.1-baseline - 2026-06-13 23:54

> 历史说明：本轮最初归档目录曾使用 `v0.2.0-20260613-2354` 命名。根据后续版本讨论，项目当前大版本应视为 **v3.0 阶段**，上一个稳定大版本为 **v2.0**。因此本条日志语义调整为 `v3.1-baseline`，原归档目录暂不强制重命名，以避免破坏已有引用。

### 迭代目标

- 增强故事系统与经营数据、金币消费、羁绊系统之间的关联。
- 建立项目版本归档与开发日志机制。
- 修正羁绊页面滚动逻辑：角色选择区与右侧详情区独立滚动，避免整个羁绊页整体下滑。

### 主要改动

- `js/story.js`
  - 故事解锁条件扩展为支持 `unlockStats`。
  - 锁定故事卡片支持半隐藏式预告信息。
- `js/data.js`
  - 为故事数据补充 `scope`、`route`、`characterIds`、`preview` 等元信息。
  - 增加经营 IF 示例故事：`口碑危机`。
- `css/style.css`
  - 增加故事预告标签样式。
  - 新增 `#shop-content.shop-content-bond`，使羁绊页不再使用商店内容区整体滚动。
- `css/ui.css`
  - 羁绊页改为内部双区域滚动：角色选择列表独立滚动，右侧角色详情独立滚动。
- `js/shop.js`
  - 根据当前商店页签为 `#shop-content` 切换 `shop-content-bond` class。

### 验证

- 已运行：`node tools/check_syntax.js`
- 结果：通过，`data.js`、`shop.js`、`story.js`、`ui.js`、`game.js` 等核心脚本均返回 `OK`。
- 文档整理后已再次运行：`node tools/check_syntax.js`
- 结果：通过，所有核心脚本均返回 `OK`。
- 手动检查重点：
  - 商店的“解锁/升级”页签仍保持正常整体滚动。
  - “羁绊”页签中，角色列表可独立下滑。
  - 右侧详情内容超过可视高度时可独立下滑。

### 已知问题 / 后续建议

- 当前归档为手动快照。后续可新增 `tools/create_archive.js` 自动生成版本目录、清单和文件备份。
- 故事系统下一阶段建议批量补充经营 IF 事件，使金币、订单表现、角色羁绊形成网状叙事。
- 3.0 阶段路线图已拆分到 `docs/V3_ROADMAP.md`。
- 多语言词库规划已补充到 `STORY_SYSTEM_ROADMAP.md`，原则为“内置词库保证网页开箱即玩，导入词库作为后续扩展”。

### 回退提示

本轮关键文件已归档至：

```text
archives/v0.2.0-20260613-2354/files/
```

如需回退，可将该目录中的同名文件复制回项目对应位置。

> 该目录名保留历史命名；语义上对应 `v3.1-baseline` 的文件级快照。