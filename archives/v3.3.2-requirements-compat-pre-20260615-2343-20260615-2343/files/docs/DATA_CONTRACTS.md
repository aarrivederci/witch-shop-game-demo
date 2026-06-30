# 数据结构契约

本文档记录 `witch-shop-game` 中不应随意改名、删除或改变语义的数据字段。它服务于多模型协作、存档兼容和后续内容扩展。

## 1. 总原则

- 新增字段必须有默认值，旧存档读取时不能报错。
- 旧字段进入兼容期后才能废弃，不应一次性删除。
- ID 一旦被存档、故事条件、商店购买或 UI 引用，就视为稳定契约。
- 展示文案可以调整，结构字段和 ID 需要谨慎调整。
- 如果确实需要破坏性变更，必须在 `CHANGELOG.md` 和对应归档 `MANIFEST.md` 中记录迁移方式。

## 2. 存档契约

当前本地存档 key：

```text
witchShopSave_v1
```

不要无迁移方案地修改该 key。

新增状态字段时，应在默认状态中提供值，并依赖现有深合并逻辑兼容旧存档。

## 3. 核心状态字段

以下字段属于稳定状态契约：

```text
coins
totalEarned
phase
modules
unlockedRecipes
upgrades
storyUnlocked
stats
```

`stats` 中已有或规划中的统计字段应保持语义稳定，例如：

```text
customersServed
customersLost
totalKeyPresses
highestCombo
```

后续 v3.2 可新增金币消费统计，但应采用附加方式，例如：

```js
stats: {
  coinsSpentTotal: 0,
  coinsSpentOnGifts: 0,
  coinsSpentOnShopInvestments: 0,
  coinsSpentOnConsumables: 0,
  coinsSpentOnBond: 0,
  usedProtectionItems: 0
}
```

金币消费统计的语义应表示“玩家把金币花在什么方向”，不建议只依赖当前持有金币或累计获得金币判断故事条件。

后续如果引入店铺气质，应作为附加结构保存，例如：

```js
shopTraits: {
  warm: 0,
  mystic: 0,
  dangerous: 0,
  luxury: 0,
  scholarly: 0,
  forbidden: 0
}
```

`shopTraits` 应由店铺投资、经营行为或特殊事件累积得出，不应与某一个升级 ID 完全绑定，避免后续调整商店升级时破坏故事条件。

## 4. 模块与商店 ID 契约

现有模块 ID 应保持稳定：

```text
potions
divination
charms
alchemy
```

商店解锁、升级、效果 ID 一旦被 `State.upgrades`、购买记录或 UI 引用，不应随意重命名。

已有升级效果语义包括：

```text
faster_brew
patience
tips
more_orders
vip
auto_recipes
```

如果后续要调整展示名称，可以只改文案，不改 effect ID。

## 5. 故事字段契约

旧字段仍需兼容：

```text
unlockPhase
unlockCoins
unlockStats
```

v3.0 后推荐新增结构：

```js
{
  scope: 'character' | 'relationship' | 'world' | 'shop' | 'prologue' | 'ending',
  route: 'public' | 'inner' | 'if' | 'archive',
  characterIds: [],
  preview: {
    hiddenTitle: '',
    hint: '',
    visibleHints: [],
    revealPolicy: 'partial'
  },
  requirements: {}
}
```

兼容原则：

- `requirements` 是增强字段，不应立即替代并删除旧解锁字段。
- `preview` 只负责玩家可见线索，不应作为唯一真实解锁条件。
- 玩家可见线索不应直接暴露后台字段，例如 `giftId`、内部 tag 或精确数值阈值。
- `requirements.stats` 可引用金币消费方向，例如 `coinsSpentOnGiftsMin`、`coinsSpentOnShopInvestmentsMin`、`usedProtectionItemsMin`。
- `requirements.shopTraits` 可引用店铺气质，但应保持为增强字段；旧存档缺失时默认视为 0。
- 流失顾客相关条件不应被硬编码为单一口碑惩罚，它也可以服务于 `inner`、`if`、`shop` 或 `world` 故事入口。

## 6. 礼物、羁绊与关系扩展契约

v3.2 及之后应将礼物、商品赠礼和羁绊作为附加结构接入，而不是直接重写故事系统。

当前运行时已有 `State.bonds[roleId]`，其旧字段必须继续兼容：

```js
State.bonds[roleId] = {
  exp: 0,
  gifts: 0,
  coinsSpent: 0,
  byGiftId: {},
  lastGiftId: null,
  repeatGiftStreak: 0
}
```

后续新增字段必须以默认空值补齐，推荐扩展为：

```js
State.bonds[roleId] = {
  exp: 0,
  gifts: 0,
  coinsSpent: 0,
  byGiftId: {},
  lastGiftId: null,
  repeatGiftStreak: 0,

  // v3.2 商品赠礼扩展
  byProductId: {},
  byGiftTag: {},
  productGifts: 0,
  lastGiftSource: 'bondGift',

  // v3.2 羁绊回馈扩展
  rewardFlags: {}
}
```

兼容原则：

- `BOND_GIFTS` 继续作为兼容数组存在，不应删除变量；当前运行时允许其为空，旧四个礼物 ID 可由商品 `legacyGiftId` 与 `BOND_GIFT_LABELS` 承接。
- 商品赠礼作为新的 `productGift` 来源接入。
- `gifts` 表示该角色收到的礼物总数，应同时统计旧 `BOND_GIFTS` 与商品赠礼。
- `byGiftId` 统计旧礼物 ID，用于兼容现有 `unlockGifts.giftId` 故事条件；商品送礼若设置 `legacyGiftId`，也应同步计入这里。
- `byProductId` 统计商品 ID，用于后续商品赠礼条件。
- `byGiftTag` 统计商品或礼物标签，用于低耦合故事条件与 NPC 偏好。
- `lastGiftSource` 用于区分最近一次送礼来源；旧存档缺失时默认视为 `'bondGift'`。

商品样品库存作为独立背包结构保存，旧存档缺失时应默认补为空对象：

```js
State.inventory = {
  productSamples: {
    moon_cookie: 1
  }
}
```

兼容原则：

- `inventory.productSamples[productId]` 表示该商品可免费赠送的样品数量。
- 手动解锁 `giftable` 商品时可按 `sampleOnUnlock` 发放样品；若商品未显式配置，运行时可使用默认值 1。
- 商品样品赠礼优先消耗库存；无库存时才按 `giftCost` 消耗金币。
- 使用库存样品不应计入 `coinSpendStats` 或 `State.bonds[roleId].coinsSpent`，但仍应计入 `productGifts / byProductId / byGiftTag` 与羁绊经验。
- `rewardFlags` 用于记录某角色某个羁绊回馈是否已经提示或领取，避免重复触发。

旧礼物建议保留稳定字段：

```js
{
  id: 'moon_cookie',
  name: '月糖饼干',
  cost: 30,
  exp: 2,
  rarity: 'common' | 'rare' | 'epic',
  category: '点心',
  desc: '带着月光甜味的小饼干。'
}
```

后续故事条件优先引用 `giftTags` 或 `productId`，关键章节再引用具体 `giftId`，以降低礼物库调整成本。

## 7. 商品赠礼字段契约

现有商品数据位于：

```text
POTIONS
DIVINATIONS
CHARMS
ALCHEMY
```

已有稳定字段包括：

```js
{
  id: 'heal',
  name: '治愈药水',
  icon: '🧪',
  price: 20,
  tier: 1,
  desc: '治愈轻伤，回复体力',
  unlocked: true,
  unlockCost: 50
}
```

v3.2 后商品可选扩展字段：

```js
{
  giftable: true,
  giftTags: ['healing', 'warm', 'potion'],
  giftBaseExp: 1,
  intro: '第一瓶治愈药水让小店闻起来像雨后的草药架。',
  sampleOnUnlock: 1
}
```

字段语义：

- `giftable`：是否可以作为商品礼物赠送给特殊 NPC。
- `giftTags`：内部偏好标签，用于计算 NPC 反应；不要在玩家可见 UI 中原样暴露。
- `giftBaseExp`：商品作为礼物时的基础羁绊收益。
- `intro`：首次解锁商品时展示的简短世界观介绍。
- `sampleOnUnlock`：首次解锁时赠送的样品数量；若暂未实现库存，可先只作为规划字段。

商品赠礼不应替代订单商品价格。`price` 仍表示订单售卖价值；商品作为礼物时的成本、样品库存或消耗规则可另由赠礼逻辑决定。

## 8. 一般 NPC 与特殊 NPC 分层契约

v3.2 后 NPC 应区分两类：

```text
generic：一般 NPC，用于订单流量与世界氛围。
special：特殊 NPC，即当前已有 20 个具名角色，用于羁绊、故事、来访台词与回馈。
```

当前 `CUSTOMER_TYPES` 里的具名角色可以作为特殊 NPC 第一版来源，不建议立即迁移到全新角色表，以避免破坏 `roleId`、故事、订单与羁绊引用。

特殊 NPC 推荐附加字段：

```js
{
  id: 'traveler',
  name: '旅行者',
  charName: '塞勒斯',
  emoji: '🧳',
  personality: 'friendly',

  npcType: 'special',
  title: '远行的制图师',
  giftTagPreferences: {
    travel: 1.5,
    memory: 1.3,
    warm: 1.1,
    forbidden: 0.8
  },
  visitLines: {
    bond0: ['第一次来访台词'],
    bond1: ['熟客台词'],
    bond2: ['信赖台词'],
    bond3: ['亲近台词']
  },
  bondRewards: [
    {
      id: 'traveler_map_tip_lv1',
      level: 1,
      title: '远方传闻',
      description: '塞勒斯开始替小店带来远方传闻。',
      effectType: 'noteOnly'
    }
  ]
}
```

一般 NPC 可由动态生成逻辑产生，推荐保证以下语义字段：

```js
{
  id: 'traveler_cautious',
  npcType: 'generic',
  identityId: 'traveler',
  name: '谨慎的旅行者',
  personality: 'cautious',
  _isDynamic: true
}
```

一般 NPC 规则：

- 可以提供订单。
- 可以参与弱统计，例如服务次数、流失次数。
- 不进入完整羁绊页。
- 不解锁专属 8 段角色故事。
- 不读取 `visitLines` 与 `bondRewards`。
- 不应阻塞特殊 NPC 订单出现。

## 9. 特殊 NPC 来访与订单契约

特殊 NPC 应进入订单主循环，但必须满足以下约束：

- 同一时间最多存在 1 个特殊 NPC 订单。
- 特殊 NPC 订单出现时应在订单列表中置顶展示，避免玩家错过。
- 如果特殊 NPC 生成失败或当前已有特殊 NPC 订单，应回退生成一般 NPC 订单，避免订单断流。
- 特殊 NPC 出现概率可受 `phase`、羁绊等级、最近送礼、刚解锁故事等因素影响，但第一版可使用固定概率。

推荐订单顾客字段扩展：

```js
order.customer = {
  id: 'traveler',
  npcType: 'special',
  identityId: 'traveler',
  charName: '塞勒斯',
  roleName: '旅行者',
  title: '远行的制图师',
  emoji: '🧳',
  personality: 'friendly',
  bondLevel: 2,
  visitLine: '今天还是来找你比较安心。'
}
```

订单 UI 可使用 `npcType === 'special'` 判断置顶和特殊样式；不要只通过 `charName` 是否存在推断，因为后续一般 NPC 也可能拥有随机姓名。

`visitLines` 建议按羁绊等级映射：

```text
bond0：Lv.0 初识
bond1：Lv.1 熟客
bond2：Lv.2 信赖
bond3：Lv.3+ 亲近 / 命定
```

不要直接绑定精确经验值；如果未来调整 `BOND_LEVELS` 阈值，台词档位仍应稳定。

## 10. 羁绊回馈契约

羁绊回馈第一版以“记录 + 提示”为主，避免直接引入复杂数值系统。

推荐数据结构：

```js
bondRewards: [
  {
    id: 'knight_guard_note_lv2',
    level: 2,
    title: '骑士的承诺',
    description: '他答应在危险客人靠近时留意这间小店。',
    effectType: 'noteOnly'
  }
]
```

状态记录放入对应角色羁绊记录：

```js
State.bonds[roleId].rewardFlags = {
  knight_guard_note_lv2: true
}
```

兼容原则：

- `effectType: 'noteOnly'` 表示当前仅提示，不改变数值。
- 后续如果接入真实效果，应新增 effect 类型，不要改变旧 `noteOnly` 语义。
- 回馈提示应在达到等级后只出现一次，除非未来明确加入“回顾/日志”入口。

## 11. 破坏性变更记录要求

如果必须进行破坏性变更，需要同时记录：

1. 变更原因。
2. 影响文件。
3. 旧字段到新字段的映射。
4. 旧存档是否兼容。
5. 回退方式。
