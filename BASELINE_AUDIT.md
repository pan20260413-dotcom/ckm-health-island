# V3.2 Phase 0｜基線盤點

盤點日期：2026-11-24

## 基線與保護

- 指令指定的基線為 `CKM_Health_Island_V3.1.1`。此資料夾未修改。
- V3.2 工作副本由 V3.1.1 原始專案複製而來；本階段只新增盤點文件，不改動 HTML、CSS、JavaScript、圖示或 PWA 資源。
- 另有已推送 GitHub 的 V3.1.2；它含特殊字元顯示修正及更新後測試，但不是本指令指定的 Phase 0 基線。
- V3.1.1 原始提交 ZIP 保留於 CKM 專案根目錄。

## 架構

- `index.html`：單頁應用，內含視覺樣式、島嶼/護照/既有互動任務、核心本機資料初始化與儲存、JSON 匯入匯出介面。
- `habit-system.css`、`habit-system.js`：四大主題 60 項任務、難度/輪替/自選、打卡與 XP、統計、歷史及任務資料匯入匯出擴充。
- `manifest.webmanifest`、`sw.js`、PNG/SVG 圖示：PWA 安裝資訊、App Shell 快取與離線行為。
- `island_growth_base.png`、`island_growth_preview.png`：小島視覺素材。
- 沒有建置工具或伺服器端程式；靜態 HTTP 主機即可提供網站。

## 儲存與資料流

- 主資料唯一已確認的 localStorage key：`ckmIslandState`。
- 主體狀態由 `index.html` 初始化與儲存，包含島嶼天數、舊版樹木與 `passport`；任務擴充將 `habitSystem` 合併至同一狀態物件。
- `passport` 含 XP、角色/暱稱、學習任務、歷史、目標、活動、睡眠與心情紀錄等欄位。
- `habitSystem` 含版本、舊版樹數、任務紀錄、自選任務、難度及活動/睡眠/鈉指標。
- 匯出格式：`{appId:"CKM-Health-Island", backupVersion:2, exportedAt, data}`；匯入驗證後寫回同一狀態。舊任務格式有合併路徑。詳細欄位見 `DATA_SCHEMA.md`。
- 本機儲存失敗時，既有程式使用最後成功寫入快照復原；JSON 匯入錯誤會保留原資料並提示。

## 統計與獎勵摘要

- 舊島樹與新健康任務樹分開計算；每個完成任務記錄有日期、任務 ID、狀態、獎勵欄位。
- 首次任務完成依現有程式增加 4 XP；同一日期同一主題避免重複領取；取消會撤回該紀錄的任務獎勵，保留取消軌跡。
- 統計在瀏覽器端根據任務紀錄與使用者自行填寫的活動分鐘、睡眠時數、鈉估值計算。缺值呈現方式、週期與已知限制列於 `DATA_SCHEMA.md`。

## PWA

- Service Worker 快取名稱為 `ckm-health-island-v311-shell-1`。
- 安裝時快取首頁、CSS、JS、manifest、圖示及小島圖；啟用時只清理已列出的 CKM 管理前綴快取。
- 導覽請求採網路優先，離線回退首頁；其他靜態資源走快取策略。使用相對路徑，適用靜態主機子目錄。
- 以程式碼檢查與既有 V3.1.2 Chromium/PWA 測試腳本對 V3.1.1 的部分執行作為基線證據；由於部分腳本硬編碼 V3.1.2 cache 名及新版 UI 期望，相關測試不適用並明列於 `BASELINE_TEST_REPORT.md`，不可視為 V3.1.1 功能失敗或通過。

## 待後續 Phase 檢視

- 無障礙設定與引導目前尚未有完整全站三級字體/高對比偏好流程。
- 個人週報、知識中心與前後測為 V3.2 待新增範圍，尚未實作。
- 臨床審查與真機測試狀態須依原始報告，不以本盤點代替專業簽核。
