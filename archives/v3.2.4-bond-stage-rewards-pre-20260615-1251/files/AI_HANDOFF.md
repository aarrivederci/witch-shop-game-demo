# AI 协作交接入口

> 如果你刚接手本项目，且不知道从哪里开始，请先阅读项目根目录的 `START_HERE.md`。  
> `START_HERE.md` 是给用户和后续模型使用的唯一记忆入口；本文件负责提供更详细的协作规则。

本文件是后续 AI 模型、文本协作者或代码协作者接手 `witch-shop-game` 时的详细协作说明。目标是减少重复摸索，避免跨模型协作时破坏既有结构。

## 1. 接手前必读顺序

1. `START_HERE.md`：唯一入口，用户只需要记住这个文件。
2. `AI_HANDOFF.md`：当前交接规则与协作规范。
3. `FRAMEWORK.md`：项目模块、调用链、存档与核心系统说明。
4. `docs/V3_ROADMAP.md`：v3.0 阶段路线图与小版本边界。
5. `docs/VERSION_ARCHIVE.md`：版本归档、回退与多模型协作规范。
6. `docs/DATA_CONTRACTS.md`：数据字段、ID、存档兼容契约。
7. `docs/QA_CHECKLIST.md`：修改后的手动验证清单。
8. 如修改故事、角色、礼物、羁绊或内容包，必须阅读 `STORY_SYSTEM_ROADMAP.md`。

## 2. 当前项目阶段

当前项目处于 **v3.0 大版本规划下的 v3.2 商品赠礼与特殊 NPC 关系循环运行时落地阶段**。

最新上下文：角色故事正文已完成“中文优先”运行时清理。`js/data.js` 的 `ROLE_STORY_LIBRARY` 已从旧四元组 `[titleEN, titleCN, bodyEN, bodyCN]` 转为中文二元组 `[title, body]`；`js/story.js` 只渲染 `title/text`；旧英文标题与正文已归档到 `docs/STORY_EN_ARCHIVE.md`。店铺投资故事已接入 `unlockShopTraits`，未解锁故事卡片会展示店铺气质条件；羁绊页“下个故事”提示也已支持订单、羁绊、阶段、金币、消费统计、店铺气质与送礼条件等完整条件摘要。礼物驱动故事条件已接入：`State.bonds[roleId]` 会记录总送礼数、指定礼物计数、最近礼物与重复赠礼衰减；`STORY_ENTRIES` 可使用 `unlockGifts` 要求“累计送礼”或“赠送指定角色标志礼物”；故事页与羁绊页均会展示这些条件。`tools/handoff_status.js` 已改为从 `AI_HANDOFF.md` / `CHANGELOG.md` 动态提取当前阶段、推荐下一步与 Unreleased 亮点，避免交接状态再次停留在旧版本。2026-06-15 已再次校准 v3.2：下一步不再优先把“经营消耗品 / 风险控制”作为唯一收尾，而是先把商品介绍、商品赠礼、专精品质、一般/特殊 NPC 分层、特殊 NPC 羁绊来访台词与羁绊回馈提示打成最小闭环。详细计划见 `docs/V3_2_PRODUCT_GIFT_SPECIAL_NPC_PLAN.md`。v3.2.1 文档与数据契约整理已完成；v3.2.2 商品赠礼运行时核心已接入：首批商品拥有 `giftable / giftTags / giftBaseExp / giftCost / legacyGiftId`，羁绊页可把已解锁商品作为“商品样品”赠送，`State.bonds[roleId]` 已补齐 `byProductId / byGiftTag / productGifts / lastGiftSource / rewardFlags`，商品送礼会同步 `legacyGiftId` 到旧 `byGiftId`，故事/商店提示可从商品或 `BOND_GIFT_LABELS` 兜底查找旧礼物名称。旧 `BOND_GIFTS` 当前保留为空兼容数组，四个旧礼物 ID 已迁移为商品来源。商品首次解锁介绍已接入：`js/data.js` 为首批 10 个可赠送商品补齐 `intro`，`js/modules.js` 手动解锁配方时会展示 intro，且可赠送商品会提示可作为商品样品赠送。v3.2.3 特殊 NPC 来访第一版已接入：订单生成会约 20% 概率生成当前阶段可见的具名熟客，同一时间最多 1 个熟客订单；`SPECIAL_NPC_VISIT_LINES` 为 20 个角色提供 `bond0~bond3` 来访台词，订单卡片显示“普通来客 / 熟客 · 羁绊阶段”，熟客订单完成会继续计入原角色羁绊与故事条件。暂未完成：样品库存、羁绊阶段回馈提示、特殊 NPC 专属订单链。`requirements` 统一、半隐藏预告、流失订单叙事入口、完整 IF 网络、特殊 NPC 专属订单链仍后置到 v3.3 或更后。如未来推进 v3.4 多语言词库包，可从英文归档恢复/拆分资源。

核心目标是将游戏从：

```text
扁平经营 + 解锁后阅读故事
```

升级为：

```text
订单表现 → 金币产出/消耗 → 商品解锁/礼物/店铺投资 → 羁绊变化
→ 特殊 NPC 访问反馈/故事解锁/回馈助力 → 新订单/新反馈
```

后续优先方向：

```text
v3.2 商品赠礼与特殊 NPC 关系循环
v3.3 故事条件网络、特殊委托与半隐藏预告
v3.4 内置多语言词库包系统
v3.5 自定义词库导入
```

## 3. 修改前流程

1. 明确本轮目标、范围和成功标准。
2. 判断属于小改动还是大改动。
3. 创建归档：
   - 小改动：备份受影响文件到 `archives/<version>/files/`。
   - 大改动或基线：创建完整可运行快照 `archives/<version>-full/`。
4. 如涉及数据结构，先检查 `docs/DATA_CONTRACTS.md`。
5. 如涉及故事、角色、礼物、羁绊，先检查 `STORY_SYSTEM_ROADMAP.md`。

## 4. 修改后流程

修改完成后至少执行：

```bash
node tools/project_check.js
```

如果本轮只修改运行时代码且想快速定位语法问题，可额外或单独运行：

```bash
node tools/check_syntax.js
```

并根据改动类型参考：

```text
docs/QA_CHECKLIST.md
```

完成后更新：

1. `CHANGELOG.md`
2. 本轮归档目录中的 `MANIFEST.md`

## 5. 不要轻易做的事

- 不要无说明地改 `localStorage` 存档 key：`witchShopSave_v1`。
- 不要直接删除旧字段，例如故事旧字段 `unlockPhase / unlockCoins`。
- 不要重命名已有核心 ID，例如模块 ID、升级 ID、角色 ID。
- 不要删除历史归档目录。
- 不要把大型功能混进文档整理任务。
- 不要让玩家可见线索直接暴露后台字段，例如 `giftId = xxx`。

## 6. 当前推荐下一步

当前建议继续推进：

```text
v3.2：商品赠礼与特殊 NPC 关系循环
```

优先做一个小而闭合的运行时功能链：

```text
商品解锁介绍 / 商品赠礼 / 特殊 NPC 来访台词随羁绊变化
```

特殊 NPC 来访第一版已完成；建议下一步优先做“羁绊阶段回馈提示”：当某个角色羁绊首次达到 1/2/3/4 级时，写入 `State.bonds[roleId].rewardFlags` 并弹出一次 `noteOnly` 提示或在羁绊页展示，先不做复杂数值助力。样品库存 `sampleOnUnlock` 可继续后置。暂不继续新增故事条件字段、暂不重构故事预告、暂不扩写流失订单/IF 故事网络、暂不做完整特殊委托链。

随后进入：

```text
v3.3：故事条件网络、特殊委托与半隐藏预告
```

优先解决：

1. 商品已进入赠礼与角色关系循环，商品首次解锁介绍已完成；样品库存仍未完成，可选择后置或轻量实现。
2. 特殊 NPC 已进入订单来访主循环；后续可调 spawn 权重或补专属订单链。
3. 羁绊已影响熟客来访台词与订单卡表现；仍需新增阶段回馈提示。
4. 做完商品/NPC 闭环后，再判断经营消耗品是否作为 v3.2.5 追加或顺延。
