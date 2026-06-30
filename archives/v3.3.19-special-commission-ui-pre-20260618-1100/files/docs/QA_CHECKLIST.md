# QA 验证清单

本文档用于在每轮修改后进行人工检查。`node tools/check_syntax.js` 只能发现语法问题，本清单用于补充玩法、状态和 UI 层面的验证。

## 1. 通用检查

- [ ] 页面可以正常打开。
- [ ] 控制台没有明显报错。
- [ ] 新开存档可以开始游戏。
- [ ] 旧存档加载后不会白屏或卡死。
- [ ] 重置存档功能正常。

## 2. 订单系统

- [ ] 顾客会按间隔生成。
- [ ] 订单卡片显示配方、顾客台词、按键序列和倒计时。
- [ ] 订单卡片能区分“普通来客”和“熟客”，熟客会显示当前羁绊阶段。
- [ ] 同一时间最多出现 1 个熟客订单；熟客订单存在时后续刷新会回退为普通来客。
- [ ] 提升某个角色羁绊后，该角色再次作为熟客来访时会使用更高羁绊阶段台词。
- [ ] 正确按键会推进订单进度。
- [ ] 错误按键会显示失败反馈，但不破坏订单状态。
- [ ] 完成订单后金币增加。
- [ ] 完成订单后 `totalEarned` 与 `customersServed` 更新。
- [ ] 完成熟客订单并触发新的羁绊阶段后，会出现一次“羁绊回馈”toast；刷新或继续完成订单不会重复弹出同一阶段回馈。
- [ ] 超时订单会失败，并更新 `customersLost`。

## 3. 商店与模块

- [ ] 金币足够时可以购买解锁项。
- [ ] 金币不足时按钮禁用或无法购买。
- [ ] 购买模块后对应模块 Tab 可用。
- [ ] 购买升级后对应效果生效。
- [ ] 已购买项目不会重复扣费。
- [ ] 商店购买后会触发故事检查。

## 4. 故事系统

- [ ] 初始故事或序章可正常显示。
- [ ] 达成阶段、金币或统计条件后，故事可以解锁。
- [ ] 锁定故事显示半隐藏预告，而不是完全空白。
- [ ] 预告不直接暴露后台字段，例如 `giftId` 或内部 tag。
- [ ] 使用新 `requirements` 字段的故事能正确显示锁定条件并在达成后解锁。
- [ ] 仍使用旧 `unlock*` 字段的故事保持兼容，不会因为迁移到 `requirements` 读取路径而失效。
- [ ] 运行 `node tools/check_story_conditions.js` 通过，确认 v3.3 流失订单 / 经营 IF / 里世界店铺故事的旧 `unlockStats / unlockShopTraits` 与新 `requirements.stats / requirements.shopTraits` 镜像一致。
- [ ] 故事页锁定卡片与羁绊页“下个故事”摘要读取同一条件结果，二者进度与达成状态一致。
- [ ] 流失订单故事线能按 `customersLost` 进度解锁：1 次解锁“柜台边的空纸袋”，3 次解锁“道歉名单”，5 次解锁“口碑危机”。
- [ ] 流失订单故事的锁定预告使用玩家可读线索，不直接暴露 `customersLostMin` 或 `unlockStats` 字段名。
- [ ] 经营 IF 扩展故事能按组合条件解锁：8 次流失 + 舒适度 2 解锁“第二次机会的窗口”；5 次流失 + 累计消费 1200 + 神秘 2 + 知识 2 解锁“后屋的低语账页”。
- [ ] v3.3.6 新增补救分支能按组合条件解锁：3 次流失 + 舒适度 1 + 名声 1 解锁“柜台上的补救灯”；5 次流失 + 名声 2 + 舒适度 1 解锁“传闻修补板”。
- [ ] v3.3.6 新增里世界/双路径分支能按组合条件解锁：6 次流失 + 累计消费 800 + 神秘 1 + 知识 1 解锁“门缝下的无名收据”；8 次流失 + 累计消费 1200 + 舒适 2 + 神秘 2 解锁“打烊时的两条路”。
- [ ] 组合条件故事的锁定预告能同时提示“经营失手 / 累计投入 / 店铺气质”等方向，但不直接暴露内部字段名。
- [ ] v3.3.3～v3.3.7 的全局 `customersLost` 故事仅按店铺线 / 历史样例验证，不作为 `another side` 角色故事样例继续扩张。
- [ ] 新增 `another side` 或 `route: inner` 角色侧面故事时，应要求隐秘工坊 `private_workroom`，并优先使用角色/职业分类记录，而不是全局 `customersLostMin`。
- [ ] `another side` 正文不把店铺流失订单、异常经营或口碑危机写成剧情发生原因；流失订单只作为后台判定指标。
- [ ] 运行 `node tools/check_another_side_stories.js` 通过，确认 ID 含 `another_side` 的角色侧面故事具备隐秘工坊、羁绊、分类叙事统计与玩家可读预告。
- [ ] 首批 `knight_another_side_01`、`demon_another_side_01`、`fairy_another_side_01` 在隐秘工坊 + 羁绊 Lv.2 + 对应分类记录达成后可解锁。
- [ ] v3.3.12 调试验收：控制台分别执行 `WitchDebug.prepareAnotherSide('knight')`、`WitchDebug.prepareAnotherSide('demon')`、`WitchDebug.prepareAnotherSide('fairy')` 后，故事页可解锁对应首批 another side。
- [ ] 单项条件调试：可用 `WitchDebug.unlockInvestment('private_workroom')`、`WitchDebug.setBondLevel('knight', 2)`、`WitchDebug.addLostOrderRecord('knight', 1, 'lostOrdersByIdentity')` 分步验证锁定提示从未达成到达成的变化。
- [ ] v3.3.13 首批样例 QA：分别从新存档执行 `WitchDebug.prepareAnotherSide('knight')`、`WitchDebug.prepareAnotherSide('demon')`、`WitchDebug.prepareAnotherSide('fairy')`，刷新故事页后确认三条首批 `another side` 均可解锁并可阅读。
- [ ] v3.3.13 锁定提示 QA：在未执行调试命令前，三条首批 `another side` 的锁定卡片应显示“隐秘工坊 / 更深信任 / 相关委托记录”等玩家可读线索，不显示 `lostOrdersByRole`、`lostOrdersByIdentity` 或 `customersLostMin`。
- [ ] v3.3.13 记录页联动 QA：执行首批样例调试命令后，故事页“记录”视图能看到对应职业/角色阶段记录进度变化，且不会进入当前统计数据面板。
- [ ] v3.3.13 扩写模板 QA：新增第二批 `another_side` 故事前，应先对照 `docs/V3_3_ANOTHER_SIDE_FRAMEWORK.md` 的 v3.3.13 模板，确认字段、正文边界与手动 QA 路径一致。
- [ ] v3.3.14 第二批规划 QA：确认 `vampire`、`necromancer`、`ghost` 作为第二批正式样例候选，`elf`、`dragon` 作为延后候选，且均使用现有角色 ID。
- [ ] v3.3.14 边界 QA：第二批规划只定义主题、推荐条件与正文边界，不在规划轮新增运行时故事数据或新统计 bucket。
- [ ] v3.3.14 接入前 QA：正式写入第二批 `another_side` 数据前，应先确认每条故事仍满足隐秘工坊、羁绊 Lv.2、分类记录与玩家可读锁定预告。
- [ ] v3.3.15 第二批样例 QA：分别从新存档执行 `WitchDebug.prepareAnotherSide('vampire')`、`WitchDebug.prepareAnotherSide('necromancer')`、`WitchDebug.prepareAnotherSide('ghost')`，刷新故事页后确认三条第二批 `another side` 均可解锁并可阅读。
- [ ] v3.3.15 锁定提示 QA：在未执行调试命令前，第二批 `another side` 的锁定卡片应显示“隐秘工坊 / 更深信任 / 相关委托记录”等玩家可读线索，不显示 `lostOrdersByRole`、`lostOrdersByIdentity` 或 `customersLostMin`。
- [ ] v3.3.15 边界 QA：吸血鬼、死灵法师、幽灵三条正文只写角色关系中的另一面，不把流失订单、店铺异常或口碑危机写成剧情发生原因。
- [ ] v3.3.16 第二批调试入口 QA：`WitchDebug.prepareAnotherSide('vampire')`、`WitchDebug.prepareAnotherSide('necromancer')`、`WitchDebug.prepareAnotherSide('ghost')` 会同时准备隐秘工坊、羁绊 Lv.2 与对应 `lostOrdersByRole` 分类记录。
- [ ] v3.3.16 第二批记录页 QA：执行第二批调试命令后，故事页“记录”视图能看到吸血鬼、死灵法师、幽灵对应阶段记录进度变化。
- [ ] v3.3.17 第二批手动 QA 封口：从新存档分别执行 `WitchDebug.prepareAnotherSide('vampire')`、`WitchDebug.prepareAnotherSide('necromancer')`、`WitchDebug.prepareAnotherSide('ghost')` 后，刷新故事页确认三条第二批 `another side` 可解锁、可阅读，且记录页阶段同步变化。
- [ ] v3.3.17 特殊委托规划 QA：推进特殊委托前，应先对照 `docs/V3_3_SPECIAL_COMMISSION_PLAN.md`，确认特殊委托与普通订单、熟客订单、`another side`、店铺 IF 的边界没有混淆。
- [ ] v3.3.17 后续实现前 QA：新增特殊委托运行时代码前，应先明确是否需要新数据结构、是否复用现有订单卡、是否新增 `WitchDebug.prepareCommission(roleId)`，避免一次性引入完整任务系统。
- [ ] v3.3.18 特殊委托静态样例 QA：运行 `node tools/check_special_commissions.js` 通过，确认 `SPECIAL_COMMISSIONS` 中首条 `knight_commission_01` 的角色、故事、店铺投资、目标与礼物标签引用有效。
- [ ] v3.3.18 静态样例边界 QA：特殊委托样例应标记 `status: 'static_sample'`，奖励使用 `plannedStoryId` + `noteOnly: true`，不应误接入正式运行时或直接解锁未实现故事。
- [ ] v3.3.18 预告 QA：特殊委托 `preview` 只显示“熟客信任 / 隐秘工坊 / 守护主题商品”等玩家可读线索，不暴露 `giftId`、`lostOrdersByRole`、`lostOrdersByIdentity` 或 `customersLostMin`。
- [ ] 职业/角色分类流失计数不出现在当前统计数据面板；后续应进入成就页 / 记录页并以阶段成就方式展示。
- [ ] 成就页 / 记录页展示职业或角色阶段记录时，不直接暴露 `lostOrdersByRole`、`lostOrdersByIdentity` 等后台字段名。
- [ ] 故事页“故事 / 记录”切换可用；“故事”视图保持原故事卡片，“记录”视图展示职业/角色阶段记录。
- [ ] 记录页读取 `State.storyStats` 的分类计数后，会显示“未抵达的委托”等玩家可读阶段标题、下个阶段进度与线索文案。
- [ ] 新存档或暂无分类记录时，记录页能显示空进度或锁定阶段，不会白屏，也不会污染当前统计数据面板。
- [ ] 控制台输入 `WitchDebug.status()` 可查看当前 QA 状态；`WitchDebug.addLostCustomers(8)`、`WitchDebug.setShopTrait('comfort', 2)`、`WitchDebug.spendCoins(1200)`、`WitchDebug.setShopTrait('mystery', 2)`、`WitchDebug.setShopTrait('wisdom', 2)` 后可快速触发对应故事检查。
- [ ] `WitchDebug` 仅作为本地控制台辅助存在，不应在正式游戏 UI 中出现按钮、面板或玩家可见调试文案。
- [ ] 新增故事不会引用不存在的角色、礼物或配方 ID。

## 5. 羁绊与礼物系统（v3.2 后重点检查）

- [ ] 手动解锁带 `intro` 的商品后，会弹出居中的“新商品解锁”卡片并显示商品介绍。
- [ ] 手动解锁可赠送商品后，解锁卡片提示获得商品样品、可赠送给熟客、羁绊基础收益与无样品金币回退成本。
- [ ] 商品解锁卡片可以通过“知道了”、右上角关闭按钮或点击遮罩关闭，关闭后不影响继续操作。
- [ ] 解锁可赠送商品后，`State.inventory.productSamples[productId]` 增加；未配置 `sampleOnUnlock` 的商品默认获得 1 份样品。
- [ ] 商店“收纳箱”页签能显示已解锁可赠送商品、样品总数、有库存品类与每个商品的样品数量。
- [ ] 收纳箱中样品耗尽的商品仍显示金币回退成本，且不会把内部 `giftTags` 暴露给玩家。
- [ ] 羁绊页商品样品按钮能显示库存消耗预览，例如 `样品 1→0`。
- [ ] 有样品库存时赠送商品样品不会扣金币。
- [ ] 样品耗尽后再次赠送同一商品，才会按 `giftCost` 或默认赠礼成本扣金币。
- [ ] 使用样品赠送商品仍会增加羁绊经验，并更新 `productGifts / byProductId / byGiftTag`。
- [ ] 使用样品赠送商品不会增加 `State.bonds[roleId].coinsSpent`、`coinSpendStats` 或金币消费类故事条件进度。
- [ ] 送礼会扣金币。
- [ ] 金币不足时不能送礼。
- [ ] 礼物偏好会影响羁绊收益。
- [ ] 礼物 tag 能被故事条件识别。
- [ ] 羁绊等级变化后，相关故事线索或故事解锁能更新。
- [ ] 羁绊页能显示阶段回馈说明，礼物推荐列表布局没有被阶段回馈样式破坏。
- [ ] 礼物消费统计会计入 `stats`。

## 6. v3.2.4 封版端到端场景

本段用于 v3.2 商品赠礼与特殊 NPC 关系循环封版前的完整手动验收。建议至少用一个新存档跑通一次，并用一个旧存档检查兼容性。

### 6.1 新存档完整闭环

- [ ] 新开存档后页面正常，初始订单可以完成，金币与基础统计正常增长。
- [ ] 手动解锁一个可赠送商品后，出现“新商品解锁”卡片，能看到商品介绍、样品数量、羁绊收益与金币回退成本。
- [ ] 进入商店“收纳箱”页签后，能看到该商品样品库存增加，样品总数与有库存品类统计正确。
- [ ] 进入“羁绊”页签，选择任意特殊 NPC 后，商品样品出现在赠礼列表中，并显示库存消耗预览。
- [ ] 第一次赠送该商品时优先消耗样品，不扣金币，但会增加该角色羁绊经验，并记录商品赠礼统计。
- [ ] 样品耗尽后再次赠送同一商品，会回退为金币赠礼；金币不足时按钮不可用或赠送失败且不破坏状态。
- [ ] 通过赠礼提升某个角色羁绊后，等待或生成该角色熟客订单时，订单卡能显示“熟客 · 羁绊阶段”，并使用对应阶段来访台词。
- [ ] 完成熟客订单并首次达到新羁绊阶段后，会弹出一次“羁绊回馈”toast；同一阶段不会反复弹出。
- [ ] 故事页或羁绊页的下一故事目标会随送礼、羁绊或统计变化刷新，锁定提示不暴露 `giftId`、内部 tag 或后台字段。

### 6.2 旧存档兼容

- [ ] 加载旧存档后不会白屏或卡死。
- [ ] 旧存档缺少 `inventory.productSamples`、`byProductId`、`byGiftTag`、`productGifts` 等字段时，会通过默认值补齐。
- [ ] 旧存档中已解锁商品可在收纳箱/羁绊页正常显示；缺少样品时仍能显示金币回退成本。
- [ ] 旧礼物条件仍能通过 `legacyGiftId` / `BOND_GIFT_LABELS` 显示可读名称，不会因为 `BOND_GIFTS` 为空而出现空白提示。

### 6.3 封版判断

- [ ] 上述新存档闭环无阻塞问题。
- [ ] 旧存档兼容无阻塞问题。
- [ ] `node tools/project_check.js` 通过。
- [ ] 如果只剩文案、数值或 UI 微调，可以记录为后续小修；不要在 v3.2 封版阶段扩张完整礼物库、特殊委托链或大规模故事条件网络。

## 7. 金币经济循环（v3.2 后重点检查）

- [ ] 中后期存在持续金币消耗项。
- [ ] 金币消耗不只是数值膨胀，而能影响羁绊、故事或订单反馈。
- [ ] 消费统计可被故事条件读取。
- [ ] 原有模块解锁和订单收益没有被破坏。

## 8. 归档与日志

- [ ] 修改前已创建对应归档。
- [ ] 修改后已更新 `CHANGELOG.md`。
- [ ] 归档目录中有 `MANIFEST.md`。
- [ ] `MANIFEST.md` 记录了修改范围、验证结果和回退方式。
