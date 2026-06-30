# 故事系统路线图与内容维护规范

本文档用于记录后续故事模块、礼物库、角色关系、自定义 NPC 等内容的设计方向与维护规则。目标是让故事不再只是“解锁后阅读的文本”，而是承载角色差分、经营结果、世界状态、玩家选择和后续自定义内容的核心系统。

> 给后续文本迭代模型/协作者的提醒：修改故事、礼物、角色、关系数据时，请优先阅读本文档，避免出现礼物标签、角色 ID、故事条件和玩家可见线索互相不匹配的问题。

---

## 1. 总体目标

### 当前要解决的问题

- 金币后期缺少持续消耗出口。
- 故事解锁与订单、礼物、羁绊、店铺经营状态之间的联动不够强。
- 角色故事目前更接近单线文本，缺少表层/深层/特殊 IF 的差分。
- 未来增加大量角色时，角色查找、故事筛选和关系管理需要提前规划。
- 后续可能支持玩家自定义 NPC 与分享内容，需要避免数据结构过度写死。

### 设计目标

- 将故事模块升级为“角色生态系统”。
- 将金币、礼物、羁绊、配方、流失顾客、世界观、角色关系纳入故事推进。
- 为后续文本扩写、礼物库迭代、自定义 NPC 编辑器预留规范。

---

## 2. 故事类型分层

建议每条故事都增加或遵循以下分类字段：

```js
scope: 'character' | 'relationship' | 'world' | 'shop' | 'prologue' | 'ending'
route: 'public' | 'inner' | 'if' | 'archive'
```

### 2.1 表故事 public

角色对玩家、对店铺、对外部世界呈现出来的常规故事线。

适合条件：

- 店铺阶段；
- 羁绊等级；
- 常规礼物；
- 常规配方；
- 完成订单数量。

用途：建立角色基础印象和主关系线。

### 2.2 里故事 inner

角色更私密、更矛盾、更深层的一面。注意：里故事不等于黑化，也不要求每个角色都有阴暗面。

例如：

- 骑士的里故事可以是长期压抑的疲惫、嫉妒、恐惧，或者对“秩序是否真的能拯救人”的怀疑。
- 阳光型角色的里故事可以仍然保持阳光本质，但展示他为何坚持乐观、害怕什么、曾经失去过什么。

适合条件：

- 高羁绊；
- 特定礼物或礼物 tag；
- 特殊配方；
- 角色关系事件；
- 店铺经营状态，例如流失顾客数量。

### 2.3 IF 线 if

特殊条件下出现的可能性分支，不一定是主线事实，也不一定影响结局。

适合条件：

- 流失顾客达到某个阈值；
- 玩家频繁赠送某类礼物；
- 某两个或多个角色羁绊都达到指定等级；
- 店铺声誉偏向温柔、危险、神秘、贪婪等方向；
- 玩家自定义 NPC 与内置角色产生关系。

用途：增加角色差分、重玩价值和世界反馈感。

### 2.4 关系故事 relationship

两个或多个角色之间的故事，不应强行挂在某一个单角色线里。

```js
scope: 'relationship',
characterIds: ['knight', 'demon']
```

适合内容：

- 角色之间的旧识、误解、竞争、合作；
- 多角关系故事；
- 玩家自定义 NPC 与原有角色的联动故事。

### 2.5 世界观故事 world

补充势力、地区、历史、魔法规则、店铺所在城镇生态等。

```js
scope: 'world',
factionIds: ['church', 'forest_court']
```

### 2.6 店铺故事 shop

围绕店铺本身、经营状态、名声、顾客反馈展开。

适合与以下条件联动：

- 累计金币；
- 累计消费；
- 流失顾客；
- 解锁模块；
- 特定配方销量。

### 2.7 序章与补遗 prologue / archive

当前早期版本中的“开头/结尾”内容不建议直接丢弃。推荐处理为：

- 固定开场，游戏开始时出现一次；
- 归档到故事页；
- 后续通过“序章补遗”重新解释早期事件。

示例：

```text
序章补遗：那天真正来过店门口的人
序章补遗：第一份契约的背面
```

---

## 3. 每个角色的故事包建议

每个角色不需要一开始写满，但建议按以下结构规划：

| 类型 | 建议数量 | 作用 |
|---|---:|---|
| 表故事 public | 4-8 | 建立基础关系线 |
| 里故事 inner | 2-4 | 展示深层性格与矛盾 |
| IF 故事 if | 1-3 | 利用特殊条件形成差分 |
| 关系故事 relationship | 按关系需要 | 强化角色生态 |
| 世界观关联 world | 不强制均分 | 补充阵营、地区、背景 |

---

## 4. 解锁条件规范

已有故事解锁条件不需要推翻重做，后续重点是统一字段语义，并让玩家可见线索与真实条件对应。

### 4.1 推荐 requirements 结构

```js
requirements: {
  phase: 3,
  recipes: ['moon_tea'],
  bond: [
    { characterId: 'lilith', level: 3 }
  ],
  gifts: [
    { characterId: 'lilith', giftId: 'moon_bell', count: 1 }
  ],
  giftTags: [
    { characterId: 'lilith', tag: 'moon', count: 1 }
  ],
  stats: {
    lostCustomersMin: 5,
    lostCustomersMax: 20,
    completedOrdersMin: 30,
    coinsSpentOnBondMin: 300
  },
  relationships: [
    { characterIds: ['knight', 'demon'], level: 2 }
  ]
}
```

### 4.2 条件使用建议

- 普通表故事：1-2 个条件即可。
- 关键角色章节：2-3 个条件。
- 里故事/IF线：可以使用更特殊的礼物、流失顾客或关系条件。
- 关键章节可使用 `giftId`，普通章节优先使用 `giftTags`，降低礼物库调整成本。

---

## 5. 流失顾客作为故事条件

流失顾客不应只作为失败统计，也可以成为世界状态和角色反应的依据。

### 5.1 低流失路线

```js
requirements: {
  stats: { lostCustomersMax: 3 },
  bond: [{ characterId: 'knight', level: 3 }]
}
```

表现：角色认为店铺可靠，愿意给予更重要的信任或委托。

### 5.2 高流失路线

```js
requirements: {
  stats: { lostCustomersMin: 10 },
  bond: [{ characterId: 'knight', level: 3 }]
}
```

表现：角色听说店铺近期混乱，前来质疑、试探、提醒或暴露自己的另一面。

### 5.3 口碑危机事件

```js
scope: 'shop',
route: 'if',
requirements: {
  stats: { lostCustomersMin: 20 }
}
```

用途：让经营失败不只是数值惩罚，也能产生叙事反馈。

---

## 6. 半隐藏式预告规范

玩家不应直接看到后台字段，例如 `giftId = moon_bell`。推荐显示为氛围线索。

### 6.1 推荐 preview 结构

```js
preview: {
  hiddenTitle: '月下的……',
  hint: '她似乎在等待一件能映出月光的礼物。',
  visibleHints: [
    '与她更加熟悉',
    '准备一件与月亮有关的小物'
  ],
  revealPolicy: 'partial'
}
```

### 6.2 preview 与 requirements 的对应关系

示例真实条件：

```js
requirements: {
  bond: [{ characterId: 'lilith', level: 3 }],
  giftTags: [{ characterId: 'lilith', tag: 'moon', count: 1 }]
}
```

对应玩家可见线索：

```js
visibleHints: [
  '与她更加熟悉',
  '准备一件与月亮有关的小物'
]
```

维护要求：线索必须能合理指向真实条件，不能出现“线索写月亮，但真实条件是火焰礼物”的错配。

---

## 7. 礼物库维护规范

### 7.1 礼物推荐字段

```js
{
  id: 'moon_bell',
  name: '银月铃铛',
  tags: ['moon', 'mystic', 'delicate'],
  favoredBy: ['lilith'],
  rarity: 'rare'
}
```

### 7.2 修改礼物时必须检查

- 修改礼物 `id`：检查所有 `requirements.gifts[].giftId`。
- 修改礼物 `tags`：检查所有 `requirements.giftTags[].tag` 和 `preview.visibleHints`。
- 修改角色偏好：检查该角色的表故事、里故事、IF线是否仍然合理。
- 新增礼物：建议至少配置 1-2 个 tag，方便故事条件引用。

### 7.3 角色-礼物-故事映射表建议

| 角色 | 偏好标签 | 关键礼物 | 可能关联故事 |
|---|---|---|---|
| Lilith | moon, mystic | moon_bell | lilith_inner_03 |
| Knight | honor, steel, oath | cracked_medal | knight_inner_02 |
| Fairy | flower, sweet, dew | dew_cake | fairy_public_02 |
| Demon | contract, ember, spicy | ember_seal | demon_if_01 |

---

## 8. 中英文本策略

当前中英对照正文可能带来：

- 排版拥挤；
- 阅读节奏被打断；
- AI 英文翻译质量不稳定；
- 文本迭代成本翻倍。

建议后续改为：

- 故事正文以中文为主；
- 角色名可保留英文别名，例如 `莉莉丝 Lilith`；
- 专有名词可在档案页保留英文别名；
- 不再强制每段故事正文中英对照。

---

## 9. 50 个角色时的界面规划

当前少量角色可以使用“左侧角色列表 + 右侧详情”。当角色扩展到 20-50 个时，需要追加查找能力。

### 9.1 搜索

支持搜索：

- 角色名；
- 标签；
- 阵营；
- 礼物偏好；
- 是否有新故事。

### 9.2 筛选

基础筛选：

```text
全部 | 已遇见 | 可送礼 | 有新故事 | 高羁绊 | 隐藏角色
```

世界观筛选：

```text
王国 | 森林 | 深渊 | 学院 | 教会 | 商会
```

### 9.3 排序

```text
按最近互动
按羁绊等级
按故事进度
按可解锁故事
按名称
按阵营
```

核心原则：有新内容、有可推进故事、有可送礼目标的角色应该浮到前面。

---

## 10. 自定义 NPC 与分享内容规划

未来如果允许玩家创建 NPC 并分享，需要将内容设计为可导入的内容包。

### 10.1 内容包结构

```js
{
  packId: 'player_pack_moon_guest',
  version: 1,
  characters: [],
  gifts: [],
  stories: [],
  relationships: []
}
```

### 10.2 自定义 NPC 基础字段

```js
{
  id: 'custom_moon_guest',
  name: '月下旅人',
  avatar: '🌙',
  tags: ['moon', 'traveler'],
  faction: 'unknown',
  giftPreferences: {
    favoriteTags: ['moon', 'memory'],
    dislikedTags: ['fire']
  }
}
```

### 10.3 自定义故事引用原角色

```js
{
  scope: 'relationship',
  characterIds: ['custom_moon_guest', 'knight'],
  route: 'if'
}
```

### 10.4 自定义内容校验

导入自定义内容时需要检查：

- ID 是否冲突；
- 引用的角色 ID 是否存在；
- 引用的礼物 ID/tag 是否存在；
- 故事条件是否可达成；
- 文本长度是否适合 UI；
- 是否包含不支持的字段版本。

---

## 11. 近期实施建议

### 第一阶段：规范与低风险 UI

- 修复羁绊页角色列表自适应高度。
- 建立本文档作为后续故事/礼物/角色关系维护规范。
- 明确中文正文策略。
- 明确表故事、里故事、IF线、关系故事、世界观故事、序章补遗的分类。

### 第二阶段：数据结构和故事页展示

- 给故事条目增加 `scope`、`route`、`characterIds`、`preview`。
- 支持 `stats.lostCustomersMin` / `stats.lostCustomersMax` 条件。
- 故事页显示半隐藏预告。
- 羁绊页显示对应角色的表故事/里故事线索。
- 逐步移除或隐藏故事正文英文。

### 第三阶段：长期扩展

- 角色搜索、筛选、排序。
- 关系故事界面。
- 世界观档案。
- 自定义 NPC 编辑器。
- 自定义内容包导入/导出。
- 分享内容的校验与冲突处理。

---

## 12. 多语言词库与打字模式规划

当前打字系统以英语单词拼写为核心：词库条目主要使用 `word / meaning / difficulty`，键盘输入只接受英文字母。后续如果要支持日文或其他语言，不建议直接把所有语言都硬塞进现有 `word` 字段，而应升级为“词库包 word pack”结构。

### 12.1 网页发布原则

如果游戏最终以网页形式发布，词库系统应遵循以下原则：

- **必须内置默认词库**：保证玩家打开网页即可游玩，不依赖额外导入。
- **导入词库作为扩展功能**：适合高级玩家、自定义学习内容和社区分享。
- **加载失败必须回退**：任意外部词库失败时，应回退到内置基础词库，避免游戏不可玩。
- **优先支持静态资源**：内置词库应作为项目文件随网页发布，例如 `data/wordpacks/core_en_cet.json`。
- **玩家本地导入不应依赖服务器**：网页可通过文件选择器读取 `.json`，再保存到 `localStorage` 或后续的 `IndexedDB`。

不建议早期实现：自动扫描玩家本地文件夹、直接写入玩家电脑文件、从任意 URL 自动拉取词库、依赖账号服务器同步。

### 12.2 推荐词库包结构

英语词库包示例：

```json
{
  "packId": "core_en_cet",
  "name": "英语 CET 基础词库",
  "language": "en",
  "inputMode": "spelling",
  "version": 1,
  "entries": [
    {
      "id": "en_magic_001",
      "text": "magic",
      "display": "magic",
      "meaning": "魔法",
      "difficulty": 1,
      "tags": ["magic", "basic"]
    }
  ]
}
```

日文罗马音词库包示例：

```json
{
  "packId": "core_ja_fantasy",
  "name": "日文幻想词库",
  "language": "ja",
  "inputMode": "romaji",
  "version": 1,
  "entries": [
    {
      "id": "ja_mahou_001",
      "text": "魔法",
      "reading": "まほう",
      "input": "mahou",
      "display": "魔法 / まほう",
      "meaning": "魔法",
      "difficulty": 1,
      "tags": ["magic", "basic"]
    }
  ]
}
```

### 12.3 输入模式分层

建议至少区分三类输入模式：

| 模式 | 适用语言 | 说明 | 建议阶段 |
|---|---|---|---|
| `spelling` | 英语、法语、西语等拉丁字母语言 | 显示和输入基本一致 | 近期可做 |
| `romaji` | 日文初期支持 | 显示日文，玩家输入罗马音 | 3.0 后半段可做 |
| `native-kana` | 日文进阶支持 | 玩家直接输入假名，需要处理 IME composition | 暂缓到 4.0 或更后 |

日文早期不建议直接做原生假名输入。更稳妥的方案是：**显示 `魔法 / まほう`，实际输入 `mahou`**。这样可以复用当前英文字母键盘输入逻辑，只需要让订单系统从 `word.word` 改为优先读取 `entry.input || entry.word || entry.text`。

### 12.4 与订单系统的兼容方向

后续订单逻辑应逐步从：

```js
currentWord.word[index]
```

过渡到：

```js
const answer = entry.input || entry.word || entry.text;
const label = entry.display || entry.text || entry.word;
```

这样旧英语词库仍可兼容，新词库也能支持 `display / reading / input / language / inputMode`。

### 12.5 导入词库校验

玩家导入词库时，应检查：

- `packId` 是否存在且不与内置包冲突；
- `version` 是否受支持；
- `language` 与 `inputMode` 是否受支持；
- `entries` 是否为数组且数量合理；
- 每个条目是否有可输入答案：`input`、`word` 或 `text` 至少一个；
- `difficulty` 是否在支持范围内；
- 文本长度是否适合 UI；
- 是否存在重复 ID 或空字符串。

### 12.6 与故事/角色系统的联动可能

多语言词库不应只作为学习功能，也可以与游戏系统发生轻量联动：

- 某些角色偏好特定语言词库，例如学院角色偏好英语词、异国旅人偏好日文词。
- 某些故事要求完成指定语言订单数量。
- 店铺升级可解锁“异国词库订单”。
- 高难词库可带来更高金币收益，但失败风险更高。

这些联动应放在核心玩法稳定之后再做，避免 3.0 前期范围失控。

---

## 13. 后续协作提醒

当使用其他模型或协作者迭代内容时，请明确说明：

1. 不要只改故事正文，还要同步检查 `requirements` 与 `preview`。
2. 改礼物库时必须检查故事条件中的 `giftId` 和 `giftTags`。
3. 新增角色故事时必须标注 `scope`、`route`、`characterIds`。
4. 半隐藏线索要有氛围感，但必须能合理指向真实条件。
5. 里故事不是强制黑化，而是更深层的角色理解。
6. 流失顾客可以触发特殊故事，但不应只作为惩罚，应当提供另一种叙事反馈。
7. 中文正文优先，英文只作为必要别名或专有名词保留。
8. 修改打字系统时必须保持内置默认词库可用，导入词库只能作为增强能力，不能成为网页发布的前置条件。
