# V3.1.2 最終測試報告

執行日期：2026-11-24。來源為獨立複製的 V3.1.1 專案資料夾；所有瀏覽器測試以全新 Playwright browser context 或暫存 persistent profile 操作，不使用一般瀏覽器／使用者健康資料。

## 測試摘要

- 自動化 Chromium checks：89 項全部 PASS（各組明細見下表及 `QA_RESULTS/` 原始結果 JSON）。
- JavaScript 語法：`habit-system.js`、`sw.js` 及 `index.html` 兩個 inline script 通過 Node 檢查。
- 本機主路徑：`http://127.0.0.1:8000/index.html`，HTTP 200；本機子目錄 `http://127.0.0.1:8001/CKM_Health_Island_V3.1.2/index.html` 模擬通過。
- 發現的重大自動化失敗：無。
- 未測試的實際環境：正式 GitHub Pages、iPhone Safari 真機、Android 真機、Firefox／WebKit、臨床專業人員簽核。

## 自動化測試明細

| 測試項目 | 方法 | 預期結果 | 實際結果 | 狀態 |
|---|---|---|---|---|
| 任務庫數量／ID／Level | Chromium 讀取真實互動頁與 task registry | 60 項、四主題各 15、ID 唯一、Level 各 20 | 60；四主題 15；唯一 ID；Level 1–3 各 20 | 通過 |
| 六島／舊版遷移／資料保留 | 以隔離 browser context 載入 V3 舊格式樣本 | 六島可開；保留舊樹、XP、護照歷史與日誌 | 開啟；舊樹 11、XP 37、歷史／活動／睡眠樣本保留 | 通過 |
| 難度、輪替、自選及跨難度 | 真實選擇 Level、重整、選任務及切換難度 | 當日穩定；更換難度清除不相容的自選；歷史保留 | 同日 ID 穩定；不相容選擇清除；歷史保留 | 通過 |
| 完成、撤銷、重複保護 | 由 UI 點擊及重複呼叫任務動作 | 首次 +1 任務樹／4 XP；重複不加；取消撤回並保留軌跡 | 增減一致；舊版島樹不變；重複完成／取消冪等 | 通過 |
| 活動、睡眠、鈉及統計 | 輸入表單資料並查看護照 | 數值保存；週率、近 7 日與 4 週趨勢可見 | 均可輸入保存；統計介面可見 | 通過 |
| 護照特殊字元及 XSS | 輸入 `& < > " '` 與 `<img onerror>` 測試字串 | 特殊字元原樣顯示；不產生 HTML 或程式碼 | 兩項檢查通過；未建立注入節點、無執行 | 通過 |
| 完整 JSON 還原 | UI 匯出 → 清空隔離測試 profile → UI 匯入 → canonical data 全欄比較 | 島嶼、護照、樹／XP、任務、選擇、Level、紀錄、目標全部一致 | 完整 round-trip equality；每日紀錄、活動／睡眠／鈉、護照與任務皆保留 | 通過 |
| 匯入失敗安全 | 匯入空檔、空物件、錯 JSON、無效日期、超範圍數值、主題／ID 不符、>5MB | 拒絕匯入，原資料不變 | 7 種案例均拒絕且狀態一致 | 通過 |
| 原型鍵／localStorage 損毀／Quota | `__proto__` 備份、巢狀損毀、非 JSON 原文、模擬 QuotaExceededError | 危險資料拒絕；損毀資料可復原保留；寫入錯誤不錯發獎 | 5 項安全 checks 通過，無 page error | 通過 |
| 日期跨日 | Chromium clock 固定台北時間並快轉 24 小時 | 跨日可完成新任務；每日獎勵各一次；連續日數正確 | 11/24、11/25 各完成一次；XP 8；streak 2 天 | 通過 |
| PWA manifest／安裝資源／快取範圍 | Chromium Service Worker 與 Cache API 測試 | relative start/scope 正確；離線 App Shell；不刪除其他網站快取 | 10 checks 通過；保留 unrelated cache，舊 CKM cache 移除 | 通過 |
| 關閉重開／完全離線／清快取 | 暫存 persistent Chromium profile 關閉並重開、切離線、清 cache 後重載 | localStorage 保留；離線任務可記錄；更新不重複發 XP | 5 checks 通過；閉開及清快取後資料仍在，離線完成可重整保存 | 通過 |
| GitHub Pages 子目錄相容模擬 | 本機父目錄 HTTP server + `CKM_BASE_URL` + Service Worker | 資源、manifest、scope、圖示及離線以子目錄運作 | 10 checks 通過；HTTPS Pages 實站仍未測 | 本機模擬通過 |
| 手機排版 | Chromium 390px viewport 與 Pixel 7 browser profile 412px 模擬 | 無水平捲動、無 JS 錯誤 | 390px／412px 均無水平溢位 | 模擬通過 |
| HTTP 資源與 console | Chromium 收集初始載入網路回應／錯誤 | 本機資源均 2xx；無 console/page error；不主動打外網 | 本機資源錯誤 0；測試流程 console/page errors 0；初始流程無外部 request | 通過 |
| 程式語法 | `node --check` 與抽取 inline scripts 檢查 | JavaScript 無語法錯誤 | `habit-system.js`、`sw.js`、2 inline scripts 通過 | 通過 |

## 測試證據檔

- `QA_RESULTS/audit_playwright.json`：43 項互動回歸。
- `QA_RESULTS/audit_roundtrip_empty.json`：11 項備份／匯入驗收。
- `QA_RESULTS/audit_data_security.json`：5 項安全／復原驗收。
- `QA_RESULTS/audit_pwa.json`：10 項 PWA 模擬。
- `QA_RESULTS/audit_pwa_lifecycle.json`：5 項關閉重開／離線生命週期。
- `QA_RESULTS/audit_date_rollover.json`：5 項日期跨日。
- `QA_RESULTS/audit_pwa_pages_subdir.json`：Pages 子目錄的 10 項 PWA 模擬。

## 未測試項目

| 項目 | 方法／原因 | 預期 | 實際結果 | 狀態 |
|---|---|---|---|---|
| GitHub Pages 真正部署及公網 HTTPS | 未取得 Repository 權限；尚未建立或發布 Repository | 公開 HTTPS URL 能載入／重整／離線 | 無正式網站 URL；不得以本機 server 代替 | 未測試 |
| iPhone Safari／主畫面／離線冷啟動／匯入匯出 | 無可操作 iPhone 實機 | Safari 安裝、離線和資料操作正常 | 尚無實機結果；照 `REAL_DEVICE_TEST_CHECKLIST.md` 填寫 | 未測試 |
| Android 真機 Chrome 安裝／離線／檔案備份 | 無可操作 Android 實機 | 實機安裝與資料行為正常 | Pixel 7 僅為 Chromium 裝置模擬，不是手機 | 未測試 |
| Firefox、WebKit、Microsoft Edge | 對應瀏覽器未安裝／未操作 | 各自顯示與儲存正常 | 未執行 | 未測試 |
| 臨床專業／倫理審查 | 開發者不能代替醫療專業簽核 | 60 任務逐項簽核並核准試辦族群 | 尚無醫師、營養師、藥師、運動專業或 IRB 簽核 | 未測試 |
| 無障礙及長者使用者實地測試 | 未招募社區使用者／讀屏設備 | 字級、觸控、讀屏理解符合需求 | 目前僅桌面及手機寬度自動化檢查 | 未測試 |

## 部署及社區試辦判定

- **程式碼及靜態部署準備：**可進行 GitHub Pages 手動部署；相對路徑與本機子目錄模擬已檢查。這不是已上線。
- **社區試辦：**不建議直接用於收集真實個人健康資料或作臨床建議。需先完成臨床專業審查、實機測試、部署網址驗收及社區參與者隱私說明；初期使用匿名／假資料示範。
- **剩餘風險：**瀏覽器 localStorage 可能被使用者清除，跨裝置不同步；備份 JSON 未加密，下載後由使用者負責保護；一般衛教仍可能被誤讀為個人處方，需保留醒目安全提醒。
