# v3.3.6-inner-if-branches-pre-20260616-0133 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/16 01:33:23
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/js/data.js`
- `witch-shop-game/CHANGELOG.md`
- `witch-shop-game/AI_HANDOFF.md`
- `witch-shop-game/docs/QA_CHECKLIST.md`

## 后续填写

- 本轮目标：扩展 v3.3 经营 IF / 里世界入口，在既有流失订单与店铺气质组合条件基础上，补充更多补救线、口碑修复线、后屋信号与双路径分歧故事。
- 修改文件：
  - `witch-shop-game/js/data.js`：新增 `shop_repair_counter_lamp`、`shop_rumor_repair_board`、`shop_underdoor_receipt`、`shop_two_paths_at_closing` 四条店铺故事，均保留旧 `unlockStats / unlockShopTraits` 并写入新 `requirements` 镜像。
  - `witch-shop-game/CHANGELOG.md`：记录 v3.3.6 Unreleased 变更、归档位置与验证结果。
  - `witch-shop-game/AI_HANDOFF.md`：更新当前 v3.3.1～v3.3.6 交接状态与推荐 QA 范围。
  - `witch-shop-game/docs/QA_CHECKLIST.md`：补充 v3.3.6 新增分支的手动验证项。
- 验证结果：`node tools/project_check.js` 通过。
- 回退方式：将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
