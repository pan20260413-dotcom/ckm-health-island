# 部署與更新說明 — V3.1.1

1. 將整個 `CKM_Health_Island_V3.1.1` 資料夾部署至 HTTPS 靜態網站，或用 localhost 預覽；不要用 `file://` 作 PWA 驗收。
2. 保持 HTML、JS、CSS、webmanifest、圖示及圖片的相對路徑。若部署於 GitHub Pages 專案子路徑，檢查所有資產與 `sw.js` scope/start_url 可在該路徑下正確載入。
3. 部署後用目標瀏覽器確認 `sw.js` 註冊、快取資源可載入、離線啟動與更新。當前快取名稱為 `ckm-health-island-v311-shell-1`；下一版更動快取內容時遞增尾碼。
4. 更新時保留相同來源（origin）與 localStorage key `ckmIslandState`，避免使用者需轉移資料。不同網域、瀏覽器、裝置不會自動同步。
5. Service Worker 僅刪除 CKM 專案命名空間快取；不得擴大刪除其他網站快取。
6. 健康紀錄存在瀏覽器本機。不要加入分析追蹤、雲端同步或外傳 API，除非另行完成隱私告知及使用者同意設計。提醒使用者下載備份並安全保管。
7. 部署前執行 `node --check habit-system.js`、`node --check sw.js`，並依 `FINAL_AUDIT_REPORT.md`、`PWA_TEST_REPORT.md` 做正式網域和實機測試。
8. 實際 iPhone Safari、Android 真機、GitHub Pages 正式部署尚未在本次執行；不得以本機模擬結果代替實機驗收。

本交付為可部署的靜態 PWA 候選版本，未替使用者發布至外部網站。
