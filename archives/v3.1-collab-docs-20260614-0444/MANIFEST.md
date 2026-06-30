# v3.1-collab-docs 归档清单

## 归档目的

本归档用于保存本轮“多模型协作框架加固”前的关键文件状态，方便在文档规范调整出现问题时回退。

## 版本说明

- 归档名称：`v3.1-collab-docs-20260614-0444`
- 类型：轻量归档
- 创建时间：2026-06-14 04:44 左右
- 修改性质：文档与协作规范增强，不改变运行时代码

## 修改前备份文件

```text
files/CHANGELOG.md
files/VERSION_ARCHIVE.md
```

## 本轮新增文件

```text
AI_HANDOFF.md
docs/DATA_CONTRACTS.md
docs/QA_CHECKLIST.md
```

## 本轮修改文件

```text
CHANGELOG.md
docs/VERSION_ARCHIVE.md
```

## 验证计划

本轮主要为 Markdown 文档修改，不改变运行时代码。仍需运行：

```bash
node tools/check_syntax.js
```

## 回退方式

如需回退本轮文档规范变更：

1. 将 `files/CHANGELOG.md` 复制回 `witch-shop-game/CHANGELOG.md`。
2. 将 `files/VERSION_ARCHIVE.md` 复制回 `witch-shop-game/docs/VERSION_ARCHIVE.md`。
3. 删除本轮新增文件：

```text
witch-shop-game/AI_HANDOFF.md
witch-shop-game/docs/DATA_CONTRACTS.md
witch-shop-game/docs/QA_CHECKLIST.md
```

4. 如有必要，重新运行：

```bash
node tools/check_syntax.js
```
