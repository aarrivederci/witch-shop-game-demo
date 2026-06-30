# 工具目录说明

本目录集中存放项目辅助工具、测试脚本、检查脚本和系统清理伴生文件，避免与 `witch-shop-game/` 运行目录混在一起。

## 通用检查工具

- `create_archive.js`：自动创建 `witch-shop-game/archives/` 下的轻量归档或完整快照。
  - 轻量归档示例：`node tools/create_archive.js --name v3.2-economy --files witch-shop-game/js/state.js,witch-shop-game/CHANGELOG.md`
  - 完整快照示例：`node tools/create_archive.js --name v3.2-baseline --full`
- `project_check.js`：统一运行语法检查、引用扫描、关键文档检查和归档目录检查。
  - 运行：`node tools/project_check.js`
- `handoff_status.js`：输出当前交接状态、关键入口、最近归档和可复制给新 AI 的最短提示。
  - 运行：`node tools/handoff_status.js`
- `check_syntax.js`：检查 `witch-shop-game/js/` 下主要脚本的 Node 语法。
  - 运行：`node tools/check_syntax.js`
- `check_refs.js`：粗略扫描主要模块、函数和状态字段引用情况。
  - 运行：`node tools/check_refs.js`
- `check_story_conditions.js`：静态检查 v3.3 流失订单 / 经营 IF / 里世界店铺故事的旧 `unlock*` 字段与新 `requirements` 镜像是否一致，并检查标题、正文、预告、路线和关键条件字段是否齐全。
  - 运行：`node tools/check_story_conditions.js`
- `check_another_side_stories.js`：静态检查首批 `another_side` 角色侧面故事是否要求隐秘工坊、角色羁绊与 `requirements.storyStats`，并确认预告不暴露后台字段。
  - 运行：`node tools/check_another_side_stories.js`

## 女巫小店项目工具

- `witch-shop-game/check.js`：对游戏主要 JS 文件做函数构造级语法检查。
  - 运行：`node tools/witch-shop-game/check.js`
- `witch-shop-game/test-runner.js`：Node 自动化测试 runner，会把结果写入同目录的 `test-results.json`。
  - 运行：`node tools/witch-shop-game/test-runner.js`
- `witch-shop-game/test-game.html`：浏览器内手动/半自动测试页面。
- `witch-shop-game/test-results.json`：最近一次自动化测试结果。

## 系统清理伴生文件

- `system-cleanup/step8_cleanup.ps1`：系统清理脚本，涉及用户目录、缓存目录和回收站，请只在明确需要时运行。
- `system-cleanup/realscan.txt`：磁盘扫描记录。

## 常用验证命令

```bat
node tools\handoff_status.js
node tools\check_story_conditions.js
node tools\check_another_side_stories.js
node tools\project_check.js
```

更完整的游戏测试可额外运行：

```bat
node tools\witch-shop-game\check.js && node tools\witch-shop-game\test-runner.js
```
