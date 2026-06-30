# 多语言 / i18n 状态

## 当前定位

**中文优先，英文未在维护。**

- 运行时 UI / 故事正文 / 角色台词均以简体中文为唯一可读语言。
- `js/data.js` 在 v3.3 早期已完成"中文优先"清理。
- 历史上存在英文翻译尝试，相关产物归档在：
  - `witch-shop-game/docs/STORY_EN_ARCHIVE.md`
  - `archives/_root_legacy_scripts/fix_translations_*.py / .js`
  - `archives/_root_legacy_scripts/HANDOFF_STORY_TRANSLATION.md`

这些**仅供考古**，不要直接复用。

## 路线图位置

- `v3.4` 计划：**内置多语言词库包系统**（仅词库，不是 UI / 故事全量翻译）。
- `v3.5` 计划：自定义词库导入。
- 完整 i18n（含 UI 文案、故事正文）目前**没有路线图位置**，需要单独立项。

## 给接手 AI 的提示

- 新增字符串时写中文即可，不要为可能的多语言提前抽 `i18n.t(key)` 包装。
- 如果用户要求做英文翻译，先确认范围（词库 / UI / 故事），并把决议写入本文件再开 backlog。
- 不要重启 `archives/_root_legacy_scripts/` 中的翻译脚本。
