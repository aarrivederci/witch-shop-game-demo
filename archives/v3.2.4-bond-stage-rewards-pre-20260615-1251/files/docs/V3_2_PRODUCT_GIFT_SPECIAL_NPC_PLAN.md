# v3.2 商品赠礼与特殊 NPC 关系循环落地计划

本文档是 `docs/V3_ROADMAP.md` 中 v3.2 的实施细化。路线图负责小版本边界；本文档负责把“商品介绍 / 商品赠礼 / 专精品质 / 特殊 NPC / 羁绊台词变化 / 回馈提示”拆成可落地任务。

## 1. 本轮目标

建立最小闭环：

```text
商品解锁 → 商品介绍/样品 → 商品赠礼 → 羁绊提升
→ 特殊 NPC 来访台词变化 → 羁绊阶段回馈提示
```

玩家应能感到：

```text
我经营小店获得的商品，不只是订单素材，也可以成为送给熟客的礼物；
熟客收到合适礼物后，不只解锁故事，也会在之后来店时用更亲近的方式回应我。
```

---

## 2. 设计边界

### 本阶段要做

- 新商品解锁时提供简短介绍。
- 已解锁商品可作为礼物赠送给特殊 NPC。
- 商品拥有用于赠礼偏好的标签。
- 模块专精影响商品作为礼物时的品质或羁绊收益。
- 订单顾客区分为一般 NPC 与特殊 NPC。
- 特殊 NPC 使用已有 20 个具名角色。
- 特殊 NPC 来访台词随羁绊等级变化。
- 羁绊阶段达到阈值时提供一次明确回馈提示。

### 本阶段暂不做

- 每个特殊 NPC 的完整专属订单链。
- 每个商品对每个 NPC 的专属台词。
- 身份助力的复杂数值效果。
- 完整里世界 / IF 故事网络扩写。
- `requirements` 字段统一重构。
- 玩家自定义 NPC 或内容包导入。

---

## 3. NPC 分层

### 3.1 一般 NPC

一般 NPC 用于保持订单刷新与世界氛围。

建议结构：

```js
GENERAL_CUSTOMER_PERSONALITIES = [
  { id: 'gentle', label: '温柔的', lines: [...] },
  { id: 'impatient', label: '急躁的', lines: [...] }
]

GENERAL_CUSTOMER_IDENTITIES = [
  { id: 'traveler', label: '旅人', preferredModules: ['potions', 'charms'] },
  { id: 'merchant', label: '商贩', preferredModules: ['alchemy', 'charms'] }
]
```

生成结果示例：

```text
温柔的旅人
急躁的商贩
神秘的贵族
胆小的学生
```

一般 NPC 不进入完整羁绊系统，最多保留弱统计。

### 3.2 特殊 NPC

特殊 NPC 即当前已有的 20 个具名角色。它们应成为熟客池。

最小字段建议：

```js
{
  id: 'character_id',
  special: true,
  charName: '角色名',
  title: '身份/称号',
  giftTagPreferences: {
    loves: ['moon', 'dream'],
    likes: ['gentle', 'mystery'],
    dislikes: ['noise']
  },
  orderPreferences: {
    modules: { potions: 1.2, divination: 1.5 },
    tags: ['moon', 'dream']
  },
  visitLines: {
    bond0: ['听说这里能买到不太普通的东西。'],
    bond1: ['又见面了，小魔女。'],
    bond2: ['今天还是来找你比较安心。'],
    bond3: ['有些事，我只想拜托你。']
  },
  bondRewards: []
}
```

第一版可以先为 20 个特殊 NPC 补齐最小可用字段，台词允许短句占位，后续逐步精修。

---

## 4. 商品赠礼

### 4.1 商品标签

商品需要补充赠礼可用标签，例如：

```text
healing / protection / moon / dream / memory / noble / shadow / forest / chaos / knowledge
```

标签用于匹配特殊 NPC 偏好。

### 4.2 商品介绍

商品首次解锁时建议展示：

```text
商品名
所属模块
一句世界观介绍
可作为礼物赠送给可能喜欢它的熟客
```

第一版只需要弹出或追加到日志，不要求复杂图鉴。

### 4.3 样品与库存

推荐第一版采用轻量策略：

```text
商品解锁后获得 1 个赠礼样品；
之后可花金币补购礼物份数，或暂时只允许“消耗金币赠送该商品”。
```

具体实现可根据现有 `BOND_GIFTS` 与商店 UI 选择：

```text
方案 A：保留 BOND_GIFTS，新增 productGift 类型。
方案 B：把商品转成礼物选项，旧 BOND_GIFTS 作为兼容礼物池继续存在。
```

实际实施说明（2026-06-15）：运行时采用了更轻量的商品化策略。旧 `BOND_GIFTS` 保留为空兼容数组，避免旧引用报错；四个旧礼物 ID 迁移到商品/配方数据中，并通过 `legacyGiftId` 与 `BOND_GIFT_LABELS` 兼容旧故事条件和提示文案。后续如需要重新提供“非商品通用礼物”，可以再向 `BOND_GIFTS` 追加新条目，但当前主要赠礼来源是已解锁商品。

---

## 5. 专精影响礼品品质

模块专精来自经营对应模块的订单。商品作为礼物时，可以根据所属模块专精计算品质：

```text
专精低：普通品质，基础羁绊收益
专精中：精致品质，羁绊收益提高
专精高：大师品质，额外提高回馈触发或阶段提示表现
```

第一版可以只做羁绊收益系数：

```text
giftBondGain = baseGain × preferenceMultiplier × masteryMultiplier × repeatPenalty
```

---

## 6. 特殊 NPC 来访

### 6.1 订单生成

订单生成时先决定顾客类型：

实际实施说明（2026-06-15 / v3.2.3）：订单生成已接入第一版特殊 NPC 分流。`customers.js` 以约 20% 概率从当前阶段可见的 20 个具名角色中生成熟客订单；同一时间若已有熟客待处理订单，则回退普通来客。普通来客仍复用原身份与动态性格池，但不会作为具名角色进入订单显示。熟客订单会读取 `getBondLevel(roleId)`，并从 `SPECIAL_NPC_VISIT_LINES[roleId].bond0~bond3` 选择来访台词；订单卡片显示“熟客 · 羁绊阶段”。

```text
特殊 NPC 概率：20%-30%
一般 NPC 概率：70%-80%
```

第一版不需要复杂权重。后续可让高羁绊 NPC 或故事阶段提高出现率。

### 6.2 订单卡表现

一般 NPC：

```text
温柔的旅人
“请问有能让人睡得安稳一点的东西吗？”
```

特殊 NPC：

```text
莉塔 · 梦游诗人  Lv.2 熟客
“今天想让你帮我留住一个梦。”
```

### 6.3 台词等级

建议第一版使用 4 档：

```text
bond0：陌生 / 初见
bond1：记得小店
bond2：熟悉 / 信任
bond3：亲近 / 特殊委托前置
```

如果现有羁绊是数值，可先用阈值映射：

```text
0-24   → bond0
25-59  → bond1
60-99  → bond2
100+   → bond3
```

阈值应以现有羁绊成长速度为准，实施时可调整。

---

## 7. 羁绊回馈

第一版回馈先以“记录 + 提示”为主，避免数值系统膨胀。

示例：

```text
骑士：承诺帮你拦下危险客人。
学者：愿意帮你整理配方笔记。
诗人：为小店写下一首短歌，提高名声线索。
游商：下次带来更少见的样品。
```

数据建议：

```js
bondRewards: [
  {
    id: 'knight_guard_note',
    bondLevel: 2,
    title: '骑士的承诺',
    description: '他答应在危险客人靠近时留意这间小店。',
    effectType: 'noteOnly'
  }
]
```

后续版本再把 `effectType` 接入真实效果。

---

## 8. 小版本拆分

### v3.2.1 文档与数据契约整理

当前状态：已完成。

交付物：

- 更新 `docs/V3_ROADMAP.md`。
- 新增本文档。
- 更新 `docs/DATA_CONTRACTS.md`。
- 明确旧 `BOND_GIFTS` 与商品赠礼兼容策略。
- 明确商品赠礼、一般/特殊 NPC 分层、特殊 NPC 订单、羁绊回馈的新增字段边界。

验收：

- 后续模型能从文档判断字段、范围和不做什么。
- 后续实现 v3.2.2/v3.2.3 时，不需要重新猜测 `productGift`、`npcType`、`visitLines`、`bondRewards` 等字段语义。

关键决策：

- `BOND_GIFTS` 不删除，继续作为通用社交礼物池。
- 商品赠礼作为 `productGift` 来源接入，商品数据补 `giftable / giftTags / giftBaseExp / intro / sampleOnUnlock` 等附加字段。
- 角色羁绊记录保留 `exp / gifts / coinsSpent / byGiftId / lastGiftId / repeatGiftStreak`，新增 `byProductId / byGiftTag / productGifts / lastGiftSource / rewardFlags` 时必须提供默认值。
- 一般 NPC 使用 `npcType: 'generic'`，不进入完整羁绊和角色故事；特殊 NPC 使用 `npcType: 'special'`，沿用现有 20 个具名角色 ID。
- 特殊 NPC 订单第一版限制为同一时间最多 1 个，生成失败或已有特殊 NPC 订单时回退一般 NPC，避免订单断流。
- 羁绊回馈第一版使用 `effectType: 'noteOnly'`，只记录和提示，不立即扩张数值系统。

### v3.2.2 商品介绍与赠礼样品

当前状态：部分完成（商品赠礼运行时核心与商品首次解锁介绍已完成；样品库存仍待做）。

交付物：

- 商品数据补充介绍与赠礼标签。
- 商品解锁时展示介绍。（已完成：`js/modules.js` 解锁 toast 会展示 `intro`，并提示可作为商品样品赠送）
- 已解锁商品可作为礼物赠送。（已完成）
- 礼物收益接入偏好与专精系数。（已完成偏好与重复衰减；专精系数后续可继续补强）

已完成实现：

- `js/data.js` 首批商品补充 `giftable / giftTags / giftBaseExp / giftCost / legacyGiftId`。
- `js/data.js` 新增 `ROLE_PRODUCT_GIFT_PREFERENCES`，按角色与商品标签计算偏好。
- `js/state.js` 补齐 `byProductId / byGiftTag / productGifts / lastGiftSource / rewardFlags`，并记录商品送礼。
- `js/shop.js` 羁绊页展示“商品样品”赠礼列表；消耗金币赠送已解锁商品后提升羁绊。
- `js/story.js` 与 `js/shop.js` 的礼物名称查找支持商品 ID、`legacyGiftId` 与 `BOND_GIFT_LABELS` 兜底。
- `js/data.js` 已为首批 10 个可赠送商品补充 `intro` 文案。
- `js/modules.js` 已在手动解锁配方时展示商品介绍；若该商品可赠送，会额外提示“可作为商品样品赠送给熟客”。

验收：

- 至少 1 个商品解锁后出现介绍。（待手动 QA；运行时代码已实现）
- 至少 1 个商品可送给特殊 NPC。（已满足：初始解锁商品即可作为商品样品赠送）
- 送出偏好匹配商品时，羁绊收益高于普通礼物。（基本满足：按 `ROLE_PRODUCT_GIFT_PREFERENCES` 与 `giftTags` 计算）

### v3.2.3 特殊 NPC 来访

交付物：

- 一般 NPC / 特殊 NPC 数据分层。
- 订单生成能抽到特殊 NPC。
- 特殊 NPC 订单卡显示角色名、身份与羁绊等级。
- 特殊 NPC 台词随羁绊等级变化。

验收：

- 同一特殊 NPC 在不同羁绊档位来访时显示不同台词。
- 一般 NPC 订单仍能正常刷新，不被特殊 NPC 系统阻塞。

### v3.2.4 羁绊回馈与收尾

交付物：

- 羁绊阶段回馈记录。
- 达到阶段时显示一次提示。
- 更新 `CHANGELOG.md`、`AI_HANDOFF.md`、`docs/QA_CHECKLIST.md`。
- 运行 `node tools/project_check.js`。

验收：

- 至少 1 个特殊 NPC 在羁绊提升后触发回馈提示。
- 文档与检查脚本通过。

---

## 9. 是否需要单独小版本文档

判断原则：

```text
如果一个小版本只涉及 1-2 个文件、1 个闭环，可以写在 V3_ROADMAP.md 和 CHANGELOG.md。
如果涉及数据结构、UI、订单生成、状态存档、QA 多处联动，应生成单独小版本文档。
```

当前 v3.2 商品赠礼与特殊 NPC 循环涉及：

```text
数据结构 + 商店 UI + 羁绊系统 + 订单生成 + NPC 文案 + 存档兼容 + QA
```

因此需要本文档作为单独小版本细化文档。
