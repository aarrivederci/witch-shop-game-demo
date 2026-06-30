# 工具目录说明

本目录集中存放项目辅助工具、测试脚本、检查脚本和系统清理伴生文件，避免与 `witch-shop-game/` 运行目录混在一起。

## 通用检查工具

- `check_syntax.js`：检查 `witch-shop-game/js/` 下主要脚本的 Node 语法。
  - 运行：`node tools/check_syntax.js`
- `check_refs.js`：粗略扫描主要模块、函数和状态字段引用情况。
  - 运行：`node tools/check_refs.js`

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
node tools\check_syntax.js && node tools\witch-shop-game\check.js && node tools\witch-shop-game\test-runner.js
```
