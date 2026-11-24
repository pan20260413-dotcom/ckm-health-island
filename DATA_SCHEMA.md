# V3.1.1 資料結構盤點

## 儲存位置

- localStorage key：`ckmIslandState`（單一 JSON 狀態物件；未發現其他應用自有 key）。
- 資料只由前端讀寫；沒有伺服器 API 或雲端同步程式。

## 主要欄位

| 欄位 | 用途 |
|---|---|
| `days` | 日期字串 → 舊四主題打卡代碼陣列 |
| `trees` | 舊小島樹數 |
| `lastDate` | 舊版日期狀態欄位 |
| `passport.xp` | 健康護照 XP |
| `passport.role`, `nickname` | 角色及暱稱 |
| `passport.tasks` | 學習/互動任務狀態 |
| `passport.history` | 任務活動歷史與 XP 紀錄 |
| `passport.goal` | 使用者自選健康目標 |
| `passport.activityLog` | 活動日期、類型、分鐘 |
| `passport.sleepLogs` | 睡眠日誌 |
| `passport.moodLogs` | 心情自我觀察 |
| `passport.sleepChallengeDays` | 睡眠挑戰日期 |
| `habitSystem.version` | 任務模組資料版本（目前 1） |
| `habitSystem.legacyTrees` | 舊版島樹相容計數 |
| `habitSystem.records` | 任務日期、ID、主題、狀態、筆記及獎勵 |
| `habitSystem.selections` | 日期 → 主題 → 自選任務 ID |
| `habitSystem.level` | 1、2 或 3 |
| `habitSystem.metrics.activity/sleep/sodium` | 依日期保存的使用者自填數值 |

初始化流程會修正部分欄位，並將不可用資料放入 `ckmRecoveryData` 或復原欄位。資料遷移需保留這些復原內容，不得靜默丟棄。

## JSON 備份

外層：`appId`、`backupVersion`、`exportedAt`、`data`。目前完整匯出使用 `backupVersion: 2`。匯入支援完整 CKM 備份及舊版任務資料合併形式；匯入後仍寫入同一 `ckmIslandState`，沒有獨立的每日飲食資料庫。

## V3.2 相容注意

新增模組應以新欄位/版本化命名空間增量保存於既有狀態，或使用明確遷移器；匯出匯入驗證需容許舊資料缺少新欄位。飲食互動完成狀態不得混入既有健康任務完成紀錄而造成重複 XP。
