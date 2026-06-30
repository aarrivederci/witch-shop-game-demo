# v3.1-baseline-full 归档清单

## 归档目的

本目录用于保存当前 `witch-shop-game` 的完整可运行基线快照，作为后续 `v3.2+` 迭代前的安全恢复点。

此前目录 `archives/v0.2.0-20260613-2354/` 只保存了关键文件级快照，不能独立打开网页；本归档补充为完整页面级快照。

## 版本说明

- 归档名称：`v3.1-baseline-20260614-0428-full`
- 语义版本：`v3.1-baseline-full`
- 创建时间：2026-06-14 04:28 左右
- 项目阶段：3.0 大版本下的 v3.1 基线

## 已归档内容

```text
index.html
CHANGELOG.md
FRAMEWORK.md
STORY_SYSTEM_ROADMAP.md
css/
js/
assets/
docs/
MANIFEST.md
```

其中 `assets/` 当前为空或无可复制文件；保留目录语义，方便后续补充资源。

## 运行方式

可直接打开：

```text
witch-shop-game/archives/v3.1-baseline-20260614-0428-full/index.html
```

如浏览器对本地 JSON 文件或模块加载有限制，可在该目录下启动本地静态服务器：

```bash
cd witch-shop-game/archives/v3.1-baseline-20260614-0428-full
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000/
```

## 回退方式

如果后续开发出现问题，可以从本目录复制文件回主项目目录。例如：

```bash
copy archives\v3.1-baseline-20260614-0428-full\index.html index.html
xcopy /E /I /Y archives\v3.1-baseline-20260614-0428-full\js js
xcopy /E /I /Y archives\v3.1-baseline-20260614-0428-full\css css
```

> 注意：以上命令需在 `witch-shop-game/` 目录下执行。

## 备注

- 当前工作目录不是 Git 仓库，无法通过 Git 标签恢复历史 2.0 版本。
- 本归档不是历史原始 `v2.0`，而是当前可运行的 `v3.1-baseline` 完整快照。
- 若未来找到真正的旧版 2.0 文件，建议另建 `archives/v2.0-full/` 保存。