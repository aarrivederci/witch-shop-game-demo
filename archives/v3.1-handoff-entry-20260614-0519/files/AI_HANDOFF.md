# AI 协作交接入口

本文件是后续 AI 模型、文本协作者或代码协作者接手 `witch-shop-game` 时的第一入口。目标是减少重复摸索，避免跨模型协作时破坏既有结构。

## 1. 接手前必读顺序

1. `AI_HANDOFF.md`：当前交接入口与协作规则。
2. `FRAMEWORK.md`：项目模块、调用链、存档与核心系统说明。
3. `docs/V3_ROADMAP.md`：v3.0 阶段路线图与小版本边界。
4. `docs/VERSION_ARCHIVE.md`：版本归档、回退与多模型协作规范。
5. `docs/DATA_CONTRACTS.md`：数据字段、ID、存档兼容契约。
6. `docs/QA_CHECKLIST.md`：修改后的手动验证清单。
7. 如修改故事、角色、礼物、羁绊或内容包，必须阅读 `STORY_SYSTEM_ROADMAP.md`。

## 2. 当前项目阶段

当前项目处于 **v3.0 大版本规划下的 v3.1 基线整理阶段**。

核心目标是将游戏从：

```text
扁平经营 + 解锁后阅读故事
```

升级为：

```text
订单表现 → 金币产出/消耗 → 礼物/店铺投资 → 羁绊变化 → 故事解锁 → 新订单/新反馈
```

后续优先方向：

```text
v3.2 金币消耗与羁绊经济循环
v3.3 故事条件网络与半隐藏预告
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

在协作框架补齐后，建议进入：

```text
v3.2：金币消耗与羁绊经济循环
```

优先解决：

1. 金币后期缺少持续用途。
2. 故事解锁与经营、礼物、羁绊的关联不足。
3. 模块之间较扁平，缺少互相反馈。
