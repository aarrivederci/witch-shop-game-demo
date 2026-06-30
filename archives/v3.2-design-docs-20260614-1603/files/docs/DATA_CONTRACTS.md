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
  coinsSpentOnConsumables: 0
}
```

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

## 6. 礼物、羁绊与关系扩展契约

v3.2 及之后建议将礼物和羁绊作为附加结构接入，而不是直接重写故事系统。

推荐方向：

```js
bond: {
  [characterId]: {
    level: 0,
    points: 0,
    giftsReceived: {}
  }
}
```

礼物建议保留稳定字段：

```js
{
  id: 'moon_bell',
  name: '月铃',
  price: 120,
  rarity: 'common' | 'rare' | 'epic',
  tags: ['moon', 'quiet']
}
```

故事条件优先引用 `giftTags`，关键章节再引用具体 `giftId`，以降低礼物库调整成本。

## 7. 破坏性变更记录要求

如果必须进行破坏性变更，需要同时记录：

1. 变更原因。
2. 影响文件。
3. 旧字段到新字段的映射。
4. 旧存档是否兼容。
5. 回退方式。
