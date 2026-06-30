# 工具目录说明

本目录集中存放项目辅助工具、检查脚本和系统清理伴生文件，避免与 `witch-shop-game/` 运行目录混在一起。

## 通用检查工具

- `create_archive.js`：创建 `witch-shop-game/archives/` 下的轻量归档或完整快照。**默认会在归档创建后自动运行 `project_check.js`，失败则把归档目录重命名为 `<name>.DIRTY` 并以非零码退出。** 使用 `--skip-check` 可跳过 post-flight（仅在已知中间态时使用）。
  - 轻量归档示例：`node tools/create_archive.js --name v3.2-economy --files witch-shop-game/js/state.js,witch-shop-game/CHANGELOG.md`
  - 完整快照示例：`node tools/create_archive.js --name v3.2-baseline --full`
  - 同时写入 `MANIFEST.md`（人读）与 `manifest.json`（机读：`schemaVersion / archiveName / archiveType / createdAt / files / verifiedBy / postFlightStatus`）。
- `project_check.js`：统一运行语法检查、引用扫描、故事条件检查、another side 检查、特殊委托检查、状态一致性检查、关键文档检查和归档目录检查。
  - 运行：`node tools/project_check.js`
- `handoff_status.js`：输出当前交接状态、关键入口、最近归档和可复制给新 AI 的最短提示。
  - 运行：`node tools/handoff_status.js`
- `check_syntax.js`：检查 `witch-shop-game/js/` 下主要脚本的 Node 语法。
  - 运行：`node tools/check_syntax.js`
- `check_refs.js`：粗略扫描主要模块、函数和状态字段引用情况。
  - 运行：`node tools/check_refs.js`
- `check_status_consistency.js`：校验 `witch-shop-game/docs/STATUS.json` 中的 `currentVersion` 与 `START_HERE.md` / `AI_HANDOFF.md` / `CHANGELOG.md` 三处的版本号一致，并确认 `latestArchive` 目录存在。
  - 运行：`node tools/check_status_consistency.js`
- `check_story_conditions.js`：静态检查 v3.3 流失订单 / 经营 IF / 里世界店铺故事的旧 `unlock*` 字段与新 `requirements` 镜像是否一致。
  - 运行：`node tools/check_story_conditions.js`
- `check_another_side_stories.js`：静态检查 `another_side` 角色侧面故事是否要求隐秘工坊、角色羁绊与 `requirements.storyStats`。
  - 运行：`node tools/check_another_side_stories.js`
- `check_special_commissions.js`：静态检查 `SPECIAL_COMMISSIONS` 特殊委托样例字段。
  - 运行：`node tools/check_special_commissions.js`

## 历史测试目录（未串入主流程）

- `legacy-tests/check.js`：早期对游戏主要 JS 文件做函数构造级语法检查（已被 `tools/check_syntax.js` 覆盖）。
- `legacy-tests/test-runner.js`：早期 Node 自动化测试 runner，输出 `test-results.json`。
- `legacy-tests/test-game.html`：浏览器内手动 / 半自动测试页面。
- `legacy-tests/test-results.json`：最近一次自动化测试结果。

> 这些脚本**没有**接入 `project_check.js`，结果可能与当前数据结构不一致。重新启用前请先评估是否需要重写。如不再维护，可在 NEXT.md 中开 backlog 决定是否归档。

## 系统清理伴生文件

- `system-cleanup/step8_cleanup.ps1`：系统清理脚本，涉及用户目录、缓存目录和回收站，请只在明确需要时运行。
- `system-cleanup/realscan.txt`：磁盘扫描记录。

## 常用验证命令

```bat
node tools\handoff_status.js
node tools\project_check.js
```

`project_check.js` 已包含全部静态检查，平时只需要这一条。

## 一次完整迭代的推荐流程

```bat
:: 1) 修改前归档（会自动跑 post-flight）
node tools\create_archive.js --name v3.x.y-<topic>-pre --files <a>,<b>

:: 2) 修改代码 / 文档

:: 3) 再次验证
node tools\project_check.js

:: 4) 同步 STATUS.json 与 CHANGELOG / START_HERE / AI_HANDOFF
:: 5) （可选）更新 archives\<name>\manifest.json 的 verifiedBy 字段
```
