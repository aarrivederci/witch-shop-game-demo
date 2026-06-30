# v3.3 Another Side 框架纠偏

本文档记录 v3.3.8 后对 `another side / side story / 里世界入口` 的统一定义。它用于纠正早期把“流失订单、经营失手、口碑危机”直接写成里世界剧情因果的偏差，并为后续成就页、职业流失计数与首批角色侧面故事提供边界。

## 1. 核心结论

`another side` 是乙女向角色侧面故事，不是店铺经营事故故事。

正确关系应为：

```text
隐秘工坊开启 side story 系统入口
职业/角色相关订单记录提供后台判定指标
羁绊、礼物、特殊来访等关系数据提供角色亲近条件
another side 正文表现角色关系中的另一面
```

错误关系是：

```text
店铺流失订单 / 异常经营 / 口碑下滑
→ 直接导致角色 another side 剧情发生
```

后续写作、数据配置和 QA 均应避免把流失订单写成“故事发生原因”。它只能代表玩家在某类职业、身份或角色相关订单上积累了足够多的特殊记录。

## 2. 隐秘工坊是 side story 总入口

现有店铺投资：

```js
id: 'private_workroom'
name: '隐秘工坊'
```

后续统一定义为：

```text
private_workroom = another side / side story / 里世界入口总开关
```

推荐规则：

- 未购买隐秘工坊时，`public` 故事和普通关系反馈可以正常推进。
- 未购买隐秘工坊时，`inner / another side` 类故事不应正式解锁；最多显示非常模糊的锁定预告。
- 购买隐秘工坊后，系统可以追溯读取购买前已经累计的职业/角色流失记录。
- 隐秘工坊只是系统门槛与入口，不应在正文中被简单写成“因为店铺经营异常所以发生了这段故事”。

## 3. 职业/角色流失计数的定位

现有全局统计：

```js
State.stats.customersLost
```

继续保留给统计页和基础经营反馈使用。

后续 side story 判定不应直接依赖全局 `customersLostMin`，而应增加独立叙事统计：

```js
State.storyStats = {
  lostOrdersByRole: {},
  lostOrdersByIdentity: {}
}
```

语义：

- `lostOrdersByRole[roleId]`：具名特殊 NPC / 角色相关订单流失次数。
- `lostOrdersByIdentity[identityId]`：普通职业/身份订单流失次数，例如骑士、旅人、商贩等职业维度。
- 订单如果能解析出 `bondRoleId`，优先计入角色维度。
- 订单如果只有普通 `identityId`，计入职业/身份维度。
- 这类计数用于成就页、side story 条件和半隐藏线索，不进入当前统计页。

## 4. 成就页承接分类流失记录

职业/角色流失次数不应塞进当前“统计数据”面板。统计页只保留全局经营指标，例如服务顾客、流失顾客、按键数、最高连击。

未来成就页或记录页用于展示更细的阶段记录：

```text
骑士 · 未抵达的委托 I
骑士 · 未抵达的委托 II
骑士 · 未抵达的委托 III
```

推荐表现：

- 玩家可以看到某个职业/角色相关记录已经进入第几阶段。
- 不直接写“再流失 1 个骑士订单即可解锁 another side”。
- 隐秘工坊开启后，可以在成就页显示更明确但仍半隐藏的提示。
- 成就阶段可以作为 side story 的玩家可见前置线索，但不替代真实 `requirements`。

## 5. 推荐 side story 条件结构

示例：

```js
{
  id: 'knight_another_side_1',
  scope: 'character',
  route: 'inner',
  roleId: 'knight',
  characterIds: ['knight'],
  requirements: {
    shopInvestments: ['private_workroom'],
    bond: { roleId: 'knight', level: 2 },
    storyStats: {
      lostOrdersByRole: { knightMin: 3 }
    }
  },
  preview: {
    hiddenTitle: '骑士守则之外',
    hint: '有些没有抵达终点的委托，被隐秘工坊记在了另一页。',
    visibleHints: ['开启隐秘工坊', '与骑士建立更深信任', '留意骑士相关委托的另一种记录'],
    revealPolicy: 'partial'
  }
}
```

正文方向应是：

```text
骑士在亲密关系中显露更强的保护欲、边界感、压抑疲惫或守序之外的占有。
```

而不是：

```text
因为店铺流失了骑士订单，所以骑士来追责经营问题。
```

## 6. 对 v3.3.3～v3.3.7 店铺故事的定位

v3.3.3～v3.3.7 已存在的 9 条 `customersLost` / 店铺 IF / 经营分支故事可作为历史店铺线样例或条件检查样例保留，但它们不再代表 `another side` 的正确设计方向。

后续处理建议：

- 短期保留这些条目，避免立即破坏运行时和 QA 工具。
- 文档中明确它们属于店铺线 / 历史样例，不是角色 another side 样例。
- 后续如继续推进 side story，应新增角色维度样例，而不是继续扩充全局 `customersLostMin` 店铺故事。
- `tools/check_story_conditions.js` 未来可拆分为店铺故事历史检查与 another side 条件检查。

## 7. 推荐实施顺序

```text
v3.3.8：框架纠偏、数据契约、文档和 QA 边界
v3.3.9：State.storyStats 分类计数运行时与 requirements.storyStats 读取
v3.3.10：成就页 / 记录页展示职业与角色阶段记录
v3.3.11：首批骑士、恶魔、花仙子等 another side 样例（已接入）
```

后续实现时应优先保证：

1. 分类计数不影响当前统计页。
2. 隐秘工坊是所有 `another side` 的总入口。
3. 流失订单只作为判定指标，不作为剧情因果。
4. 成就页展示阶段记录，但保留乙女向半隐藏氛围。

## 8. v3.3.11 首批样例落地

v3.3.11 已在 `js/data.js` 新增 3 条首批角色侧面故事：

- `knight_another_side_01`：艾德里安 / 骑士，主题为未署名夜巡记录与职责之外的守护。
- `demon_another_side_01`：阿扎泽尔 / 恶魔，主题为不把心意伪装成交易。
- `fairy_another_side_01`：蒂娜 / 花仙子，主题为花影后的空铃与等待被听见。

共同条件：

```js
requirements: {
  shopInvestments: ['private_workroom'],
  bond: { roleId: '<roleId>', level: 2 },
  storyStats: {
    lostOrdersByRole 或 lostOrdersByIdentity: { '<key>Min': 1 }
  }
}
```

本轮同时新增 `tools/check_another_side_stories.js` 并接入 `node tools/project_check.js`。该检查只针对 ID 含 `another_side` 的角色侧面故事，避免把既有普通 `inner` 角色故事误判为新框架样例。

## 9. v3.3.13 后续扩写模板

新增 `another side` 时，优先复制 v3.3.11 首批三条样例的结构，而不是从旧店铺 IF 故事改写。

推荐字段：

```js
{
  id: '<roleId>_another_side_01',
  scope: 'character',
  route: 'inner',
  roleId: '<roleId>',
  characterIds: ['<roleId>'],
  requirements: {
    shopInvestments: ['private_workroom'],
    bond: { roleId: '<roleId>', level: 2 },
    storyStats: {
      lostOrdersByRole: { '<roleId>Min': 1 }
    }
  },
  preview: {
    hiddenTitle: '<玩家可读的半隐藏标题>',
    hint: '<不暴露后台字段的氛围线索>',
    visibleHints: ['开启隐秘工坊', '与角色建立更深信任', '留意相关委托记录'],
    revealPolicy: 'partial'
  }
}
```

扩写规则：

- `id` 建议使用 `<roleId>_another_side_序号`，便于 `tools/check_another_side_stories.js` 自动纳入检查。
- `scope` 固定优先使用 `character`，`route` 使用 `inner`，并明确 `roleId` 或 `characterIds`。
- `requirements.shopInvestments` 必须包含 `private_workroom`，作为 side story 总入口。
- `requirements.bond` 应与目标角色一致，首批建议从 Lv.2 起步；更深层故事再提高等级。
- `requirements.storyStats` 只使用 `lostOrdersByRole` 或 `lostOrdersByIdentity`，且 key 使用 `Min` 后缀。
- `preview` 只能写玩家可理解线索，不写 `lostOrdersByRole`、`lostOrdersByIdentity`、`customersLostMin` 等后台字段。

正文边界：

- 可以写角色在亲密关系、职责之外、伪装背后、等待与信任中的另一面。
- 可以让分类记录作为“玩家曾经错过、旁观或积累过相关委托痕迹”的半隐藏门槛。
- 不应写成“因为店铺流失了某个订单，所以角色来追责 / 惩罚 / 触发剧情”。
- 不应把全局经营失败、口碑危机、店铺异常直接当作角色 `another side` 的剧情原因。

手动 QA 推荐路径：

```js
WitchDebug.prepareAnotherSide('<roleId>')
```

如果要分步检查锁定提示，应依次验证：

```js
WitchDebug.unlockInvestment('private_workroom')
WitchDebug.setBondLevel('<roleId>', 2)
WitchDebug.addLostOrderRecord('<roleId>', 1, 'lostOrdersByRole')
```

若目标使用职业/身份维度，应把最后一步的 bucket 改为 `lostOrdersByIdentity`，key 改为对应身份 ID。