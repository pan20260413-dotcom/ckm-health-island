# V3.1.1 測試報告

執行日期：2026-11-23。此報告補充 V3.1 初版靜態測試報告；完整結果以 `FINAL_AUDIT_REPORT.md`、`SECURITY_AUDIT.md` 及 `PWA_TEST_REPORT.md` 為準。

## 實際執行

- JavaScript 語法檢查：`habit-system.js`、`sw.js` 及 `index.html` 兩段 inline script 通過 Node 檢查。
- Chromium Playwright 透過本機 HTTP：四主題共 60 任務、每主題 15；難度篩選、每日任務同日穩定、自選、打卡、取消、重複防護、舊版遷移、六島頁面、紀錄欄位、趨勢、備份還原端到端均通過。
- 不合法 JSON、任務 ID、`__proto__` key、XSS payload、localStorage 損毀資料及寫入配額錯誤案例均按預期拒絕或復原。
- 390px 手機 viewport 及 Pixel 7 Chromium 裝置設定模擬無水平溢位。
- Service Worker／Cache API 安裝、更新快取範圍、無關快取保留、離線導覽和離線寫入通過 Chromium 模擬。
- 測試流程未觀察到 console 或 page errors；初始化沒有外部網路請求。

## 未測試

iOS Safari 真機、Android 實機、Firefox／WebKit、正式 HTTPS 網址/GitHub Pages 部署、真實飛航模式冷啟動及跨版本真實資料庫長期遷移。本機模擬不能取代實機及正式部署驗收。
