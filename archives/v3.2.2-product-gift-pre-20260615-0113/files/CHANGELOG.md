# 开发日志 / Changelog

本文件用于记录 `witch-shop-game` 每轮迭代的目标、改动、验证结果与回退提示，方便后续查看、自检、多模型协作和功能回退。

## Unreleased

- v3.2.1 文档与数据契约整理：为商品赠礼与特殊 NPC 关系循环补齐实施前契约。
  - `docs/DATA_CONTRACTS.md` 新增商品赠礼字段、`State.bonds[roleId]` 扩展字段、一般/特殊 NPC 分层、特殊 NPC 订单与羁绊回馈契约。
  - `docs/V3_2_PRODUCT_GIFT_SPECIAL_NPC_PLAN.md` 标记 v3.2.1 完成，并记录 `BOND_GIFTS` 兼容、`productGift` 接入、`npcType` 分层、特殊 NPC 同时最多 1 单与 `noteOnly` 回馈等关键决策。
  - 本轮是文档/契约整理，不修改运行时代码；后续可进入 v3.2.2 商品介绍与赠礼样品。
  - 修改前归档：`archives/v3.2.1-data-contracts-pre-20260615-0038/`。
- v3.2 路线优化：将商品赠礼与特殊 NPC 关系循环纳入 v3.0 大版本主框架。
  - `docs/V3_ROADMAP.md` 更新 v3.0 总目标：从“订单→金币→礼物/投资→故事”扩展为“订单→商品/礼物/投资→羁绊→特殊 NPC 访问反馈/故事/回馈”。
  - 重新整理 v3.2：当前优先级从“经营消耗品 / 风险控制收尾”调整为“商品介绍、商品赠礼、专精品质、一般/特殊 NPC 分层、特殊 NPC 羁绊来访台词、羁绊回馈提示”的最小闭环。
  - 新增 `docs/V3_2_PRODUCT_GIFT_SPECIAL_NPC_PLAN.md`，作为 v3.2 商品赠礼与特殊 NPC 关系循环的文件级落地计划。
  - `AI_HANDOFF.md` 与 `START_HERE.md` 更新当前阶段和推荐下一步，后续接手应优先阅读该细化文档。
  - 修改前归档：`archives/v3.2-product-gift-npc-roadmap-pre-20260615-0020-20260615-0019/`。
- v3.2 路线校准：重新明确当前阶段目标、已完成内容与下一步边界。
  - `docs/V3_ROADMAP.md` 增加 v3.2 当前状态与边界校准，明确店铺投资、金币消费统计、礼物故事线索已形成最小闭环。
  - 明确 v3.2 后续不继续扩展完整故事条件网络，`requirements` 统一、半隐藏预告、流失订单叙事入口和经营 IF 网络后置到 v3.3。
  - `AI_HANDOFF.md` 将推荐下一步收束为“经营消耗品 / 风险控制最小闭环”。
  - 修改前归档：`archives/v3.2-roadmap-realign-pre-20260614-2009-20260614-2009/`。
- 礼物驱动故事条件：送礼现在可以直接参与角色故事解锁与目标提示。
  - `js/state.js` 为羁绊记录补充 `byGiftId`、`lastGiftId`、`repeatGiftStreak`，支持统计总送礼数与指定礼物次数，并对连续重复礼物做收益衰减。
  - `js/data.js` 为中后段角色故事生成 `unlockGifts` 条件：部分故事要求累计送礼，后段故事要求赠送角色标志礼物。
  - `js/story.js` 支持检查并展示 `unlockGifts` 未解锁提示。
  - `js/shop.js` 的“下个故事”摘要补充送礼与指定礼物目标，避免玩家只看到羁绊等级但不知道还差哪份礼物。
  - 修改前归档：`archives/v3.2-gift-story-conditions-pre-20260614-1900-20260614-1900/`。
- 交接状态工具刷新：`tools/handoff_status.js` 不再输出过期的 v3.1 固定摘要。
  - 当前阶段从 `AI_HANDOFF.md` 自动提取。
  - 推荐下一步从 `AI_HANDOFF.md` 的“优先解决”列表自动提取。
  - Unreleased 亮点从 `CHANGELOG.md` 自动提取，方便新模型快速理解最近改动。
  - 修改前归档：`archives/v3.2-handoff-status-refresh-pre-20260614-1848-20260614-1848/`。
- 羁绊页故事目标补强：`js/shop.js` 的“下个故事”提示现在会汇总显示完整解锁条件。
  - 支持订单、羁绊等级、店铺阶段、累计金币、累计消费统计与 `unlockShopTraits` 店铺气质条件。
  - 修复羁绊页只显示订单/羁绊，导致店铺投资或消费条件缺失时玩家不知道下一步目标的问题。
  - 修改前归档：`archives/v3.2-story-target-summary-pre-20260614-1803/`。
- 故事锁定提示补齐：`js/story.js` 的未解锁故事卡片现在会展示 `unlockShopTraits` 店铺气质条件。
  - 修复店铺投资故事已可解锁但锁定卡片不显示“店铺舒适/知识/名声”等进度的问题。
  - 修改前归档：`archives/v3.2-story-shoptrait-hints-pre-20260614-1721/`。
- 故事文本中文优先清理：游戏运行时不再携带/渲染角色故事英文正文。
  - `js/data.js` 将 `ROLE_STORY_LIBRARY` 从旧四元组 `[titleEN, titleCN, bodyEN, bodyCN]` 转为中文二元组 `[title, body]`。
  - `js/story.js` 移除双语标题/正文渲染分支，只读取 `title/text`。
  - `js/shop.js` 移除下个故事目标中的 `titleCN` 兼容读取。
  - `css/ui.css` 删除故事双语展示专用样式。
  - 新增 `docs/STORY_EN_ARCHIVE.md`，归档 160 条旧英文标题与正文，供未来多语言包/校对/追溯使用。
  - 已验证：JS/CSS 无 `titleEN/titleCN/bodyEN/bodyCN` 与双语 story class 运行时残留；`node tools/project_check.js` 通过。
- v3.2 运行时代码：新增“店铺投资”页签与金币消费统计。
  - `index.html` 新增商店“投资”页签。
  - `js/state.js` 新增 `coinSpendStats`、`shopTraits`、`shopInvestments`，并让 `spendCoins()` 记录消费分类。
  - `js/data.js` 新增 `SHOP_INVESTMENTS` 与 2 条店铺投资故事。
  - `js/shop.js` 新增投资列表、购买逻辑与店铺气质汇总。
  - `js/story.js` 支持 `unlockShopTraits` 与累计金币消费故事条件。
  - `css/ui.css` 补充投资说明样式。
  - 修改前归档：`archives/v3.2-shop-investments-pre-20260614-1642/`。
- 自动化工具：补充 `tools/handoff_status.js` 交接状态输出脚本。
  - 一键输出当前入口文档、关键交接文档、最近归档、推荐下一步与新 AI 最短提示。
  - `tools/project_check.js` 新增协作工具存在性检查。
  - `tools/README.md` 补充 handoff status 使用说明。
- 设计文档：补充 v3.2/v3.3 金币消耗、店铺投资、里世界入口与故事条件网络方向。
  - `docs/V3_ROADMAP.md` 明确金币应成为推进角色、店铺与里世界线索的主动资源，而不是单纯数值黑洞。
  - `STORY_SYSTEM_ROADMAP.md` 补充里故事、店铺故事、流失订单与半隐藏条件的设计语义。
  - `docs/DATA_CONTRACTS.md` 补充金币消费统计、店铺气质 `shopTraits` 与故事条件兼容契约。

## v3.1-automation - 2026-06-14 05:35

### 迭代目标

- 把修改前归档与修改后检查从手动流程推进为脚本化流程。
- 降低多模型协作时用户需要记忆的命令和目录结构。
- 保持工具放在仓库根目录 `tools/`，默认操作 `witch-shop-game/` 项目目录。

### 主要改动

- 新增 `tools/create_archive.js`
  - 支持轻量归档：`--files <path1,path2,...>`。
  - 支持完整快照：`--full`。
  - 自动写入基础 `MANIFEST.md`。
- 新增 `tools/project_check.js`
  - 统一运行 `tools/check_syntax.js`。
  - 统一运行 `tools/check_refs.js`。
  - 检查关键交接文档是否存在。
  - 检查 `witch-shop-game/archives/` 目录。
- 更新 `tools/README.md`
  - 补充新工具说明与推荐检查命令。
- 更新 `START_HERE.md`、`AI_HANDOFF.md`、`docs/VERSION_ARCHIVE.md`
  - 将推荐验证命令升级为 `node tools/project_check.js`。
  - 将自动归档命令写入归档规范。

### 验证

- 已运行：`node tools/project_check.js`。
- 结果：通过，语法检查、引用扫描、关键交接文档检查、归档目录检查均通过。

### 回退提示

本轮修改前已创建轻量归档：

```text
archives/v3.1-automation-20260614-0535/files/
```

其中包含修改前的：

```text
START_HERE.md
AI_HANDOFF.md
CHANGELOG.md
docs/VERSION_ARCHIVE.md
tools/README.md
```

如需回退，可删除：

```text
tools/create_archive.js
tools/project_check.js
```

并将归档中的文件复制回对应路径。

## v3.1-handoff-entry - 2026-06-14 05:19

### 迭代目标

- 解决用户不想记复杂交接指令、文档路径和协作流程的问题。
- 为多模型接手建立一个更短、更显眼、更稳定的唯一入口。
- 更新路线图，使当前阶段从“v3.1 基线整理”推进到“v3.1 自动化准备”。

### 主要改动

- 新增 `START_HERE.md`
  - 作为用户和后续模型的唯一记忆入口。
  - 明确接手项目时应读取哪些文档。
  - 提供可直接复制给新模型的最短提示语。
- 更新 `AI_HANDOFF.md`
  - 顶部增加 `START_HERE.md` 引导。
  - 将自身定位从“第一入口”调整为“详细协作说明”。
  - 更新当前阶段为“v3.1 基线完成与自动化准备阶段”。
- 更新 `docs/V3_ROADMAP.md`
  - 将 `START_HERE.md`、`AI_HANDOFF.md`、`DATA_CONTRACTS.md`、`QA_CHECKLIST.md` 纳入 v3.1 成果。
  - 新增 `v3.1-automation：归档与检查自动化` 小版本。
  - 将当前推荐下一步更新为先做 v3.1-automation，再进入 v3.2。

### 验证

- 本轮主要为 Markdown 文档修改，不改变运行时代码。
- 已运行：`node tools/check_syntax.js`。
- 结果：通过，`data.js`、`state.js`、`renderer.js`、`keyboard.js`、`customers.js`、`orders.js`、`modules.js`、`shop.js`、`story.js`、`ui.js`、`game.js` 均返回 `OK`。

### 回退提示

本轮修改前已创建轻量归档：

```text
archives/v3.1-handoff-entry-20260614-0519/files/
```

其中包含修改前的：

```text
AI_HANDOFF.md
V3_ROADMAP.md
CHANGELOG.md
```

如需回退，可删除：

```text
START_HERE.md
```

并将归档中的文件复制回对应路径。

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