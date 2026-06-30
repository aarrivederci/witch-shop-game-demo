# 下一步候选 backlog

> 本文件是 `AI_HANDOFF.md §6 "推荐下一步"` 的结构化版本。Planner 角色每轮先读这里。
> 当 backlog 条目落地，由 Archivist 把对应条目移到下方 "## 已完成" 段并写一行成果。

## 当前推进中

无（v3.3.23 多模型协作框架整治本身刚刚完成）。

## 候选 — 高优先级

### NEXT-1 验收 v3.3.19～v3.3.21 体验

- **scope**：羁绊页特殊委托线索卡、故事页角色档案"正篇 / 另一面"模块、统计页"小店成就" 三处 UI 的端到端手动验收。
- **blockers**：无。
- **archive_to_make**：`v3.3.24-uat-verify-pre-<ts>` 轻量归档（仅 QA_CHECKLIST.md）。
- **success_criteria**：在 `QA_CHECKLIST.md` 内勾选 v3.3.19～v3.3.21 相关条目并补充实测截图描述；如发现回归则开新 backlog 项。

### NEXT-2 礼物触发故事联动

- **scope**：在不新增任务系统的前提下，让特定商品作为礼物送给特定角色时解锁一条隐藏故事。复用 `requirements.giftEvents` 字段（需在 `DATA_CONTRACTS.md` 中先扩展）。
- **blockers**：需先完成 NEXT-1，确认当前 UI 没有回归。
- **archive_to_make**：`v3.4.0-gift-story-link-pre-<ts>` 完整快照。
- **success_criteria**：至少 2 条样例故事可被礼物触发解锁；`tools/check_story_conditions.js` 扩展支持 `giftEvents` 字段；旧存档兼容。

## 候选 — 中优先级

### NEXT-3 正式特殊委托任务系统

- **scope**：把 v3.3.18～v3.3.19 的 `SPECIAL_COMMISSIONS` 只读线索卡升级为可接取、可进度跟踪、可领取奖励的任务。需引入 `State.activeSpecialCommissions` 字段。
- **blockers**：礼物触发联动（NEXT-2）或角色羁绊深化的方向定稿；存档兼容方案。
- **archive_to_make**：`v3.4.x-special-commission-runtime-pre-<ts>` 完整快照。
- **success_criteria**：至少 1 条委托能从接取走到完成；奖励发放不破坏现有 storyStats / bond 计数；`check_special_commissions.js` 扩展运行时校验。

### NEXT-4 精灵 / 幼龙第三批 another side

- **scope**：补齐 `elf_another_side_01`、`dragon_another_side_01`，主题分别围绕"礼物标签 / 成长阶段"。
- **blockers**：礼物标签矩阵（NEXT-2 的副产物）或成长阶段判定（待 NEXT-3 引入）需先有一个。
- **archive_to_make**：`v3.4.x-another-side-batch3-pre-<ts>` 轻量归档。
- **success_criteria**：`check_another_side_stories.js` 通过；玩家可读预告不暴露后台字段。

## 候选 — 长期 / 治理

### NEXT-5 data.js 拆分

- **scope**：把单文件 `js/data.js` 按 `data/characters/`、`data/commissions/`、`data/shop/` 拆分。需引入轻量构建步骤或运行时多脚本加载。
- **blockers**：现有静态检查脚本须改读多文件；浏览器多脚本顺序需保证。
- **archive_to_make**：`v3.5.0-data-split-pre-<ts>` 完整快照（强制）。
- **success_criteria**：旧存档兼容；所有 `tools/check_*` 通过；首屏加载未明显变慢。

### NEXT-6 GitHub 私有仓库上传

- **scope**：用户创建 GitHub private repo 后，设置 `origin`，推送 `main` 分支。
- **blockers**：需要用户提供远程仓库地址；本地 Git 准备已完成。
- **archive_to_make**：不需要额外归档；仅远程同步。
- **success_criteria**：`git remote -v` 指向正确仓库；`git push -u origin main` 成功；另一台设备可 clone 后运行 `node tools/project_check.js`。

## 已完成

- v3.3.24 Git 准备整理：新增根目录 `README.md`、`.gitignore`、`.gitattributes`，确认全仓约 7 MB、归档可直接纳入 Git，并初始化本地 Git 仓库。
- v3.3.23 多模型协作框架整治：清理根目录历史脚本、引入 STATUS.json 与一致性检查、归档自动 post-flight、MANIFEST 机读化、`docs/AGENT_ROLES.md`、`docs/NEXT.md`、`docs/ARCHIVE_LIFECYCLE.md`、`docs/SCRATCH.md`、`docs/I18N_STATUS.md` 创建、`tools/witch-shop-game/` 重命名为 `tools/legacy-tests/`。
