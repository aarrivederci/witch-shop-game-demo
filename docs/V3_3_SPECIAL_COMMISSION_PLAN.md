# v3.3 特殊委托链规划

本文档用于承接 v3.3.17 之后的特殊委托链规划：在 `another side` 第二批样例完成数据与 QA 闭环后，先定义特殊委托链的系统边界，再逐步进入静态样例与运行时实现。

## 1. 定位

特殊委托不是普通订单的高数值版本，也不是 `another side` 的替代品。

它的目标是把具名 NPC 从“偶尔作为熟客来访”推进到“在高羁绊、特定店铺状态或故事线索下，主动提出带有叙事目标的订单链”。

推荐关系：

```text
普通订单：提供基础经营节奏与金币产出
熟客订单：体现具名 NPC 的来访、羁绊阶段与关系记忆
特殊委托：把高羁绊、店铺方向、礼物或记录线索转化为一组有主题的经营目标
another side：表现角色关系中的另一面，不承担订单玩法主循环
店铺 IF：表现经营选择、投入方向与店铺世界线反馈
```

## 2. 边界原则

- 特殊委托可以由高羁绊、特定商品、店铺投资、记录阶段或前置故事触发。
- 特殊委托应服务角色关系、店铺身份或世界线推进，而不是单纯提高订单难度。
- 特殊委托可以解锁后续故事或改变来访反馈，但不应把 `another side` 改写成经营事故后果。
- 流失订单分类记录可以作为半隐藏门槛或记录线索，但不能写成“因为错过订单所以角色惩罚玩家”。
- 第一版应只规划结构和样例，不急于新增复杂状态字段或完整任务系统。

## 3. 推荐数据结构草案

v3.3.18 已在 `js/data.js` 中新增 `SPECIAL_COMMISSIONS` 静态样例，暂不接入运行时任务系统或新增存档字段。v3.3.19 起，羁绊页会读取静态样例并显示“特殊委托线索”只读卡片，用于提前提示前置条件与主题目标；该卡片不代表已经可接取任务，也不发放奖励。

```js
{
  id: 'knight_commission_01',
  roleId: 'knight',
  title: '未署名的夜巡委托',
  route: 'public',
  theme: 'guard',
  requirements: {
    bond: { roleId: 'knight', level: 2 },
    shopInvestments: ['private_workroom'],
    storyIds: ['knight_another_side_01']
  },
  objectives: [
    { type: 'completeOrders', identityId: 'knight', count: 2 },
    { type: 'giftTag', roleId: 'knight', tag: 'protection', count: 1 }
  ],
  preview: {
    hint: '某位熟客似乎把一份没有署名的夜巡记录留在了柜台边。',
    visibleHints: ['与对应熟客建立信任', '留意隐秘工坊中的侧面记录', '准备能回应守护主题的商品']
  },
  rewards: {
    plannedStoryId: 'knight_commission_after_01',
    bondExp: 20,
    noteOnly: true
  }
}
```

当前静态样例约束：

- `status` 应标记为 `static_sample`，避免误认为已经可在运行时接取。
- `requirements.storyIds` 必须引用已有故事；首条样例引用 `knight_another_side_01`。
- `objectives` 第一版只允许 `completeOrders` 与 `giftTag`，后续扩展新目标类型前应先补检查脚本。
- `rewards` 第一版使用 `plannedStoryId` + `noteOnly: true`，不直接解锁未实现故事。
- `preview` 只写玩家可读线索，不暴露 `giftId`、`lostOrdersByRole`、`lostOrdersByIdentity`、`customersLostMin` 等内部字段。

## 4. 触发条件建议

首批特殊委托不要一次覆盖所有角色，建议只选 2～3 条验证不同入口：

| 候选 | 推荐入口 | 主题 | 暂定原因 |
| --- | --- | --- | --- |
| 骑士 / 艾德里安 | 羁绊 Lv.2 + `knight_another_side_01` | 守护、夜巡、未署名委托 | 已有首批 another side 与记录页样例，可验证 side story 后续承接。 |
| 吸血鬼 | 羁绊 Lv.2 + `vampire_another_side_01` | 克制邀约、夜间来访 | 已有第二批 another side，可验证高羁绊后的异常访问。 |
| 精灵 | 自然类商品标签 + 森林线索 | 长寿、自然、礼物回应 | 适合作为 `elf_another_side_01` 前置铺垫，而不是马上写第三批 another side。 |
| 幼龙 | 宝物类商品 + 成长阶段 | 占有、成长、宝物委托 | 适合作为成长阶段系统明确后的后续候选。 |

## 5. UI 与运行时分层

第一版实现时建议尽量复用现有入口，避免新增过多面板：

- 商店 / 羁绊页可显示“可推进委托线索”，但不直接暴露内部条件字段；当前最小实现位于羁绊详情面板，只读展示 `preview.hint`、玩家可读提示、前置条件进度与主题目标进度。
- 订单卡可在特殊委托进行中显示“特殊委托”标记和主题提示。
- 故事页可承接完成后的委托后续故事。
- 记录页可显示委托阶段，但不进入当前统计数据面板。
- `WitchDebug` 可后续增加 `prepareCommission(roleId)`，但不在正式 UI 暴露。

## 6. 与礼物触发故事的关系

特殊委托可以成为礼物触发故事的中间层：

```text
商品标签 / 商品样品
→ 角色偏好与羁绊变化
→ 特殊委托线索出现
→ 完成主题订单或赠礼目标
→ 解锁后续故事 / 记录阶段
```

因此，精灵和幼龙不建议直接作为第三批 `another side` 接入；更稳妥的顺序是先补自然类、宝物类或成长类商品标签与委托主题，再决定故事正文。

## 7. v3.3.17 后推荐实施顺序

```text
v3.3.17：特殊委托链文档规划与 QA 边界
v3.3.18：特殊委托数据结构草案与首批 1 条静态样例
v3.3.19：羁绊页最小 UI 提示（已先接入只读线索卡；订单卡标记留待正式任务状态后实现）
v3.3.20：礼物标签或商品样品触发故事联动
```

每一步都应先创建归档，并在修改后运行：

```bash
node tools/project_check.js
```

v3.3.18 起，特殊委托数据还应额外通过：

```bash
node tools/check_special_commissions.js
```
