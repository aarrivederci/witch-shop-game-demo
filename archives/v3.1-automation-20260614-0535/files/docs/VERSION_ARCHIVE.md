# 版本归档与协作规范

## 目的

版本归档用于支持：

- 后续查看每轮迭代内容。
- 修改前后自检。
- 多模型协作时快速交接上下文。
- 功能异常时进行文件级回退。

## 推荐目录结构

```text
witch-shop-game/
  CHANGELOG.md
  AI_HANDOFF.md
  docs/
    VERSION_ARCHIVE.md
    DATA_CONTRACTS.md
    QA_CHECKLIST.md
  archives/
    v版本号-YYYYMMDD-HHMM/
      MANIFEST.md
      files/
        关键文件快照
    v版本号-YYYYMMDD-HHMM-full/
      MANIFEST.md
      index.html
      js/
      css/
      docs/
```

## 归档类型

### 轻量归档

适用于小范围修改，只备份本轮可能被改动的文件：

```text
archives/<version>/files/
```

示例：只修改 `CHANGELOG.md` 与 `docs/VERSION_ARCHIVE.md` 时，可只备份这两个文件。

### 完整可运行快照

适用于以下情况：

- 大版本基线。
- 大规模重构前。
- 修改 `index.html`、多个 `js/`、多个 `css/` 或核心数据结构前。
- 用户明确要求保留一个可以直接打开的版本。

推荐目录：

```text
archives/<version>-full/
```

完整快照至少应包含：

```text
index.html
js/
css/
docs/
CHANGELOG.md
FRAMEWORK.md
STORY_SYSTEM_ROADMAP.md
MANIFEST.md
```

## 每轮迭代建议流程

1. 明确本轮目标、范围与成功标准。
2. 判断使用轻量归档还是完整可运行快照。
3. 在修改前创建归档目录。
4. 复制本轮可能被修改的关键文件到 `archives/<version>/files/`，或创建完整快照。
5. 完成代码或文档修改。
6. 运行必要验证，例如：

```bash
node tools/check_syntax.js
```

7. 按 `docs/QA_CHECKLIST.md` 做必要的手动检查。
8. 更新 `CHANGELOG.md`。
9. 在本轮归档目录写入 `MANIFEST.md`，记录修改文件、验证结果、已知问题与回退方式。

## 版本号建议

- `v2.0`：上一个稳定大版本，代表基础经营、订单、模块解锁与故事雏形已经存在。
- `v3.0`：当前大版本目标，代表经营、金币、羁绊、故事、词库扩展的系统化改造。
- `v3.1 / v3.2 / v3.3 ...`：3.0 大版本下的小版本迭代。
- `v3.x-baseline`：用于标记某个大阶段的整理基线。
- 时间戳格式：`YYYYMMDD-HHMM`。

示例：

```text
v3.1-baseline-20260613-2354
v3.2-20260614-1200
```

> 早期归档目录 `v0.2.0-20260613-2354` 属于历史命名，语义上对应 `v3.1-baseline`。如果后续没有外部引用依赖，可以在单独归档整理任务中再统一重命名目录。

## 回退方式

如果需要回退轻量归档中的某一轮修改：

1. 打开对应归档目录。
2. 从 `files/` 中找到目标文件。
3. 复制回项目原路径。
4. 重新运行验证脚本。

如果需要回退完整可运行快照：

1. 可直接打开对应快照中的 `index.html` 进行对比。
2. 按需复制 `index.html`、`js/`、`css/`、`docs/` 等目录回主项目。
3. 重新运行 `node tools/check_syntax.js`。
4. 根据 `docs/QA_CHECKLIST.md` 做关键流程检查。

## 多模型协作注意事项

- 每个模型接手前应先阅读 `AI_HANDOFF.md`、`CHANGELOG.md` 和最新 `MANIFEST.md`。
- 修改结构字段前必须阅读 `docs/DATA_CONTRACTS.md`。
- 修改后应参考 `docs/QA_CHECKLIST.md` 做手动验证。
- 不要直接删除历史归档。
- 大规模重构前，应优先归档 `js/`、`css/`、`index.html` 和相关文档。
- 若修改数据结构，应在日志中明确兼容性和迁移风险。