# v3.1-baseline 归档清单

> 历史说明：本目录创建时使用 `v0.2.0-20260613-2354` 命名。根据后续版本规则，当前项目处于 **v3.0 大版本阶段**，本归档语义调整为 `v3.1-baseline`。目录名暂时保留，以避免破坏已有路径引用。

## 本轮目标

- 建立开发日志与版本归档机制。
- 修正羁绊界面滚动逻辑。
- 保留本轮故事系统增强相关关键文件快照。

## 已备份文件

```text
files/story.js
files/data.js
files/style.css
files/ui.css
files/shop.js
```

## 本轮修改文件

```text
witch-shop-game/CHANGELOG.md
witch-shop-game/docs/VERSION_ARCHIVE.md
witch-shop-game/docs/V3_ROADMAP.md
witch-shop-game/STORY_SYSTEM_ROADMAP.md
witch-shop-game/archives/v0.2.0-20260613-2354/MANIFEST.md
witch-shop-game/js/shop.js
witch-shop-game/css/style.css
witch-shop-game/css/ui.css
```

## UI 修正说明

羁绊页采用双区域独立滚动：

- `#shop-content.shop-content-bond`：羁绊页外层不整体滚动。
- `.bond-character-grid`：角色选择列表独立滚动。
- `.bond-selected-panel`：右侧角色详情独立滚动。

## 验证记录

- 已运行：`node tools/check_syntax.js`
- 结果：通过，核心脚本均返回 `OK`。
- 文档整理后再次运行：`node tools/check_syntax.js`，结果通过。
- 待手动检查：羁绊页角色列表和详情区滚动行为。

## 回退方式

将 `files/` 下的同名文件复制回项目原路径，例如：

```bash
copy archives\v0.2.0-20260613-2354\files\ui.css css\ui.css
```

> 注意：该归档目录位于 `witch-shop-game/` 内，上述命令需在 `witch-shop-game` 目录下执行。