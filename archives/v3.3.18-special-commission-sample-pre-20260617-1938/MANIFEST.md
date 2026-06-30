# v3.3.18-special-commission-sample-pre-20260617-1938 归档清单

## 归档信息

- 类型：轻量归档
- 创建时间：2026/6/17 19:38:17
- 创建工具：`node tools/create_archive.js`

## 已备份内容

- `witch-shop-game/js/data.js`
- `tools/project_check.js`
- `tools/README.md`
- `witch-shop-game/docs/DATA_CONTRACTS.md`
- `witch-shop-game/docs/QA_CHECKLIST.md`
- `witch-shop-game/docs/V3_ROADMAP.md`
- `witch-shop-game/docs/V3_3_SPECIAL_COMMISSION_PLAN.md`
- `witch-shop-game/AI_HANDOFF.md`
- `witch-shop-game/START_HERE.md`
- `witch-shop-game/CHANGELOG.md`

## 本轮目标

- 在 v3.3.17 特殊委托规划后，新增首批 1 条特殊委托静态样例，验证数据结构和引用边界。
- 新增特殊委托静态检查脚本，并接入统一项目检查。
- 同步交接文档、路线图、QA 清单、数据契约与工具说明。

## 修改文件

- `witch-shop-game/js/data.js`：新增 `SPECIAL_COMMISSIONS` 与 `knight_commission_01` 静态样例。
- `tools/check_special_commissions.js`：新增特殊委托静态检查脚本。
- `tools/project_check.js`：接入 special commission check。
- `tools/README.md`：补充新检查脚本说明与常用命令。
- `witch-shop-game/docs/DATA_CONTRACTS.md`：记录 `SPECIAL_COMMISSIONS` 静态样例契约。
- `witch-shop-game/docs/QA_CHECKLIST.md`：补充 v3.3.18 特殊委托样例 QA。
- `witch-shop-game/docs/V3_ROADMAP.md`：更新 v3.3.18 当前状态与推荐下一步。
- `witch-shop-game/docs/V3_3_SPECIAL_COMMISSION_PLAN.md`：从规划更新为已落地首条静态样例的边界说明。
- `witch-shop-game/AI_HANDOFF.md`、`witch-shop-game/START_HERE.md`、`witch-shop-game/CHANGELOG.md`：同步交接入口与开发日志。

## 验证结果

- `node tools/check_special_commissions.js` 通过。
- `node tools/project_check.js` 通过。

## 回退方式

- 将本归档中的对应文件复制回主项目，或参考 `docs/VERSION_ARCHIVE.md`。
