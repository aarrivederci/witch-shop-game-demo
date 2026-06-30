# 🧙 Witch Shop Game — 功能框架文档

> 生成时间：2026-06-07  
> 项目路径：`witch-shop-game/`

---

## 一、项目结构总览

```
witch-shop-game/
├── index.html              # 游戏入口 HTML（含所有 DOM 结构）
├── css/
│   ├── style.css           # 全局基础样式
│   ├── ui.css              # UI 组件样式（卡片、面板、按钮）
│   └── pixels.css          # 像素风/字体装饰样式
└── js/
    ├── data.js             # 静态数据（配方、顾客、商店、故事、阶段）
    ├── state.js            # 游戏状态管理（存储/读取/修改）
    ├── game.js             # 游戏总协调器（启动、事件串联）
    ├── orders.js           # 订单系统（接单、计时、完成/失败）
    ├── customers.js        # 顾客生成系统（随机生成、配方匹配）
    ├── keyboard.js         # 键盘输入处理
    ├── ui.js               # UI 渲染管理（面板、Header、Toast、弹窗）
    ├── modules.js          # 配方面板（药水/占卜/符咒/炼金 Tab）
    ├── shop.js             # 商店面板（解锁/升级购买）
    ├── story.js            # 故事面板（日记/剧情解锁展示）
    └── renderer.js         # Canvas 场景渲染（魔女小店画面）
```

---

## 二、数据层 — `data.js`

### 2.1 阶段系统 `PHASES[]`
| 属性 | 说明 |
|------|------|
| `id` | 阶段编号 0~4 |
| `name` | 阶段名称（初学者→大魔女）|
| `coinsNeeded` | 解锁该阶段所需总收入金币数 |
| `label` | 显示标签 |

**5个阶段：** 初学者 → 魔药师(200) → 占卜者(600) → 符文师(1400) → 大魔女(3000)

---

### 2.2 配方数据

每条配方结构：
```js
{
  id:      string,   // 唯一ID
  name:    string,   // 中文名称
  icon:    string,   // Emoji 图标
  price:   number,   // 基础售价（金币）
  tier:    1|2|3|4,  // 稀有度等级
  keys:    string[], // 需要按下的字母键序列，如 ['H','E','A','L']
  desc:    string,   // 描述文字
  unlocked:boolean,  // 是否初始解锁
}
```

| 类别 | 常量名 | 数量 | 说明 |
|------|--------|------|------|
| 药水 | `POTIONS` | 8 条 | Tier 1~3，前3条默认已解锁 |
| 占卜 | `DIVINATIONS` | 4 条 | Tier 2~3，解锁占卜模块后可用 |
| 符咒 | `CHARMS` | 4 条 | Tier 3~4，解锁符咒模块后可用 |
| 炼金 | `ALCHEMY` | 3 条 | Tier 4，解锁炼金模块后可用 |

---

### 2.3 顾客类型 `CUSTOMER_TYPES[]` / `CUSTOMERS`
每类顾客属性：
```js
{
  id:            string,    // 顾客类型ID
  name:          string,    // 中文名
  emoji:         string,    // 头像
  dialogue:      string[],  // 随机对话池
  preferModule:  string,    // 偏好模块（影响接单概率）
  tipMultiplier: number,    // 打赏倍率（0.8~2.0）
  phase:         number,    // 需要达到的阶段才会出现
}
```

**10种顾客：** 旅行者、骑士、商人、学生（阶段0）→ 贵族、农夫（阶段1）→ 恋人、幽灵、精灵（阶段2）→ 学者（阶段3）

---

### 2.4 商店数据

**解锁类 `SHOP_UNLOCKS[]`**（3项，解锁新功能模块）：
| ID | 名称 | 费用 | 解锁内容 |
|----|------|------|---------|
| unlock_divination | 占卜工作台 | 150🪙 | divination 模块 |
| unlock_charms | 符文刻印台 | 400🪙 | charms 模块 |
| unlock_alchemy | 炼金熔炉 | 1000🪙 | alchemy 模块 |

**升级类 `SHOP_UPGRADES[]`**（6项）：
| ID | 名称 | 效果 | 费用 |
|----|------|------|------|
| faster_brew | 快速调配 | 键序列减少1个键 | 80🪙 |
| customer_patience | 客人耐心 | 计时器延长50% | 120🪙 |
| better_tips | 慷慨小费 | 订单奖励+20% | 200🪙 |
| more_orders | 客源广泛 | 同时接3个订单 | 300🪙 |
| vip_customers | VIP接待 | 偶现高价值客人 | 500🪙 |
| auto_unlock_recipes | 古籍解读 | 自动解锁全部Tier-1配方 | 800🪙 |

`SHOP_ITEMS` = SHOP_UNLOCKS + SHOP_UPGRADES（合并列表别名）

---

### 2.5 故事条目 `STORY_ENTRIES[]`（7条）
每条解锁条件：`unlockPhase`（达到阶段）+ `unlockCoins`（总收入达到）

---

### 2.6 别名常量
```js
SHOP_ITEMS        // = [...SHOP_UNLOCKS, ...SHOP_UPGRADES]
PHASE_THRESHOLDS  // = PHASES.map(p => p.coinsNeeded) → [0,200,600,1400,3000]
CUSTOMERS         // = CUSTOMER_TYPES
MAX_PHASE         // = PHASES.length - 1 → 4
```

---

## 三、状态层 — `state.js`

### 3.1 State 对象结构
```js
State = {
  witchName:      string,   // 魔女姓名
  coins:          number,   // 当前持有金币
  totalEarned:    number,   // 历史总收入（用于阶段推进）
  phase:          0~4,      // 当前阶段
  ordersCompleted:number,
  ordersFailed:   number,

  modules: {                // 功能模块解锁状态
    potions:    true,       // 默认已解锁
    divination: false,
    charms:     false,
    alchemy:    false,
  },

  recipeUnlocks: {},        // { recipeId: true/false }
  shopPurchased: {},        // { itemId: true }

  upgrades: {               // 已激活的升级效果
    faster_brew, patience, tips,
    more_orders, vip, auto_recipes
  },

  storyUnlocked: ['intro'], // 已解锁的故事条目ID数组
  stats: {                  // 游戏统计数据
    potionsBrewed, divinationsDone, charmsMade, alchemyDone,
    customersServed, customersLost, highestCombo, totalKeyPresses
  },

  activeModule:   string,   // 当前激活配方Tab
  activeShopTab:  string,   // 当前商店Tab ('unlock'|'upgrade')
}
```

### 3.2 State 别名属性
```js
State.unlockedRecipes  // → State.recipeUnlocks（只读别名）
State.purchases        // → State.shopPurchased（只读别名）
```

### 3.3 状态管理函数

| 函数 | 说明 |
|------|------|
| `initState()` | 从 localStorage 加载存档，合并默认值，初始化配方解锁状态 |
| `saveState()` | 序列化 State 写入 localStorage |
| `resetState()` | 清除存档，重置为默认值 |
| `addCoins(n)` | 增加金币，同步累计 totalEarned |
| `spendCoins(n)` | 扣除金币，余额不足返回 false |
| `checkPhaseUp()` | 检测是否达到下一阶段门槛，自动升级 |
| `advancePhase()` | 强制升一阶段 |
| `getNextPhaseThreshold()` | 返回下一阶段所需总收入（或 Infinity）|
| `unlockModule(name)` | 解锁指定功能模块 |
| `unlockRecipe(id)` | 解锁指定配方 |
| `isRecipeUnlocked(id)` | 查询配方是否已解锁 |
| `purchaseShopItem(id)` | 标记商店物品已购买 |
| `isShopPurchased(id)` | 查询商店物品购买状态 |
| `activateUpgrade(effect)` | 激活升级效果 |
| `unlockStoryEntry(id)` | 解锁故事条目 |
| `bumpStat(key, n)` | 统计数据累加 |
| `getMaxOrders()` | 返回同时可接订单数（2 或 3）|
| `getTimerMultiplier()` | 返回计时器倍率（1.0 或 1.5）|
| `getRewardMultiplier()` | 返回奖励倍率（1.0 或 1.2）|

---

## 四、核心游戏循环

```
[DOM Ready]
    │
    ▼
Game.init()
    │
    ├─ 有存档 witchName → _startGame()
    └─ 无存档            → _showNameScreen() → 输入名称 → _startGame()
                                                                │
                                                      _bootSystems()
                                                          │
                                        ┌─────────────────┼────────────────────┐
                                        │                 │                    │
                                   Renderer.init()    Orders.init()      Keyboard.init()
                                   UI.init()          Customers.init()
                                   Modules.render()
                                   Story.checkUnlocks()
```

### 事件驱动流程

```
玩家按键
    │
Keyboard._handleKey(e)  ← 过滤非字母键、组合键
    │
Game._onKeyPress(key)
    │
Orders.processKey(key)  ← 与活跃订单的 keys[] 逐键匹配
    │
    ├── 匹配成功，订单未完成 → 更新 order.progress
    ├── 匹配成功，订单完成   → _completeOrder()
    │       ├── addCoins(reward)
    │       ├── bumpStat('customersServed')
    │       ├── saveState()
    │       └── 回调 Game._onOrderComplete()
    │               ├── UI.flashOrderResult(✅)
    │               ├── UI.refreshHeader()
    │               ├── Shop.render()
    │               ├── Game._checkPhaseUp() → 可能触发 UI.showPhaseUp()
    │               └── Story.checkUnlocks()
    └── 未匹配 → flashKey(❌)
```

```
定时器（每100ms）
    │
Orders._tick()
    │
    └── 超时订单 → _failOrder()
            ├── bumpStat('customersLost')
            ├── saveState()
            └── 回调 Game._onOrderFail()
                    └── UI.flashOrderResult(❌)
```

```
顾客生成（随机间隔 3000~8000ms，随阶段加快）
    │
Customers._trySpawn()
    │
    ├── _pickCustomer()   ← 按阶段过滤，VIP升级影响概率
    ├── _pickRecipe()     ← 70% 偏好模块，30% 任意已解锁配方
    └── _buildOrder()     ← 合并计时器倍率、奖励倍率、faster_brew
            │
        Orders.addOrder(order)  ← 队列未满则接受
```

---

## 五、模块功能说明

### 5.1 Orders（订单系统）
- 维护 `_orders[]` 活跃订单队列
- `getMaxOrders()` 控制最大并发数（2 或 3）
- `processKey(key)` 按"首匹配"原则：遍历订单，第一个期待该键的订单获得进度
- `getActiveOrder()` 优先返回有进度的订单，否则返回第一个
- 每 100ms tick 一次，超时订单自动失败

### 5.2 Customers（顾客系统）
- 生成间隔 = `max(8000 - phase×800, 3000)` × 随机抖动(±30%)
- 配方池 = 已解锁模块 × 已解锁配方
- 订单时限 = `(3000 + keys.length×2000) × (1 + (tier-1)×0.1)` × `getTimerMultiplier()`
- `faster_brew` 升级：键序列长度 -1（最少2键）

### 5.3 UI（界面系统）
- 4个侧边面板：`modules`（配方）| `shop`（商店）| `story`（故事）| `stats`（统计）
- Header HUD：当前金币、阶段、总收入、阶段进度条
- 订单卡片：配方图标 + 客人对话 + 键序列进度 + 倒计时条（<25%时变红）
- 键盘区：当前活跃订单的键序列可视化 + 进度条 + 按键反馈
- Toast 通知：3秒淡出，支持 `info / success / error` 三种样式
- 阶段升级横幅：`showPhaseUp()` 全屏弹出 3.5 秒

### 5.4 Modules（配方面板）
- Tab 切换：potions / divination / charms / alchemy
- 未解锁模块的 Tab 显示为 `locked` 状态（灰色，不可点击）
- 配方卡片：已解锁显示配方详情，未解锁显示 🔒 和解锁费用（售价×2）
- 点击未解锁配方 → 花费金币手动解锁

### 5.5 Shop（商店面板）
- 两个 Tab：解锁项目（SHOP_UNLOCKS）| 升级项目（SHOP_UPGRADES）
- 按 `item.phase <= State.phase` 过滤可见项
- 已购买标记 ✅，余额不足按钮灰色
- 购买解锁类 → `unlockModule()` + 自动解锁该模块所有Tier-1配方
- 购买升级类 → `activateUpgrade(effect)`，`auto_recipes` 效果批量解锁

### 5.6 Story（故事面板）
- `checkUnlocks()` 在每次订单完成、阶段升级、商店购买后调用
- 解锁条件：`totalEarned >= entry.unlockCoins && phase >= entry.unlockPhase`
- 已解锁条目按时间顺序展示，带封面标题和正文

### 5.7 Renderer（Canvas 渲染）
- 在 `#room-canvas` 上绘制魔女小店场景
- 包含背景、装饰物（`ROOM_DECORATIONS`）、魔女精灵（`WITCH_EMOJI`）
- 动画帧循环，魔女状态：idle / working / success

### 5.8 Keyboard（键盘处理）
- 监听 `document.keydown`，过滤组合键（Ctrl/Alt/Meta）
- 仅接受单个字母键（A-Z），统一转为大写
- 每次按键累加 `State.stats.totalKeyPresses`

---

## 六、阶段推进逻辑

```
订单完成
    │
totalEarned 累加
    │
Game._checkPhaseUp()
    │
State.totalEarned >= PHASE_THRESHOLDS[phase+1] ?
    │
    ├── 是 → advancePhase()
    │         UI.showPhaseUp(newPhase)
    │         Shop.render()        ← 新的商店项目出现
    │         Modules.render()
    │         Story.checkUnlocks() ← 可能触发新故事
    └── 否 → 继续
```

---

## 七、升级效果一览

| 升级名 | `State.upgrades` 键 | 生效位置 | 效果 |
|--------|---------------------|---------|------|
| 快速调配 | `faster_brew` | `Customers._buildOrder()` | keys 长度 -1 |
| 客人耐心 | `patience` | `getTimerMultiplier()` | 计时×1.5 |
| 慷慨小费 | `tips` | `getRewardMultiplier()` | 奖励×1.2 |
| 客源广泛 | `more_orders` | `getMaxOrders()` | 并发订单 2→3 |
| VIP接待 | `vip` | `Customers._pickCustomer()` | 10%概率选最高阶顾客 |
| 古籍解读 | `auto_recipes` | `Shop._buyUpgrade()` | 批量解锁全部Tier-1配方 |

---

## 八、存档系统

- **Key：** `witchShopSave_v1`（localStorage）
- **保存时机：** 每次 `saveState()` 调用（金币变动、购买、配方解锁、故事解锁、阶段升级等）
- **加载：** `initState()` 使用 `deepMerge` 将存档数据合并到默认值，兼容新字段
- **重置：** `resetState()` 删除 localStorage 并还原默认状态

---

## 九、待完善 / 扩展建议

| 区域 | 建议 |
|------|------|
| `renderer.js` | 完善 Canvas 动画（魔女工作状态切换、粒子效果）|
| `orders.js` | 连击 Combo 系统（`highestCombo` 统计已预留）|
| `story.js` | 故事解锁动画/过场效果 |
| `modules.js` | 配方升级系统（同一配方多级强化）|
| 音效 | 按键音效、成功/失败音效、BGM |
| 移动端 | 虚拟键盘支持 |
| 成就系统 | 基于 `State.stats` 触发徽章/成就 |
