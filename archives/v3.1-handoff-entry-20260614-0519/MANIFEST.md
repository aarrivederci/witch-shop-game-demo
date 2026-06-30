# v3.1-handoff-entry 归档清单

## 归档目的

本归档用于保存新增唯一接手入口 `START_HERE.md` 前的关键文档状态，方便在交接入口调整不合适时回退。

## 版本说明

- 归档名称：`v3.1-handoff-entry-20260614-0519`
- 类型：轻量归档
- 创建时间：2026-06-14 05:19 左右
- 修改性质：文档与协作入口增强，不改变运行时代码

## 修改前备份文件

```text
files/AI_HANDOFF.md
files/V3_ROADMAP.md
files/CHANGELOG.md
```

## 本轮新增文件

```text
START_HERE.md
```

## 本轮修改文件

```text
AI_HANDOFF.md
docs/V3_ROADMAP.md
CHANGELOG.md
```

## 验证结果

本轮主要为 Markdown 文档修改，不改变运行时代码。已运行：

```bash
node tools/check_syntax.js
```

结果：通过，核心脚本均返回 `OK`。

## 回退方式

如需回退本轮交接入口变更：

1. 删除 `witch-shop-game/START_HERE.md`。
2. 将 `files/AI_HANDOFF.md` 复制回 `witch-shop-game/AI_HANDOFF.md`。
3. 将 `files/V3_ROADMAP.md` 复制回 `witch-shop-game/docs/V3_ROADMAP.md`。
4. 将 `files/CHANGELOG.md` 复制回 `witch-shop-game/CHANGELOG.md`。
5. 重新运行：

```bash
node tools/check_syntax.js
```
