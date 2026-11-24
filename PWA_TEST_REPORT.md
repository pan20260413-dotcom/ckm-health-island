# V3.1.1 PWA 測試報告

## 程式碼與瀏覽器模擬通過

- manifest JSON 可讀，192/512 圖示與 180px PNG apple-touch icon 路徑存在；Service Worker 安裝及啟用成功。
- Chromium 本機 HTTP 下測試快取更新：建立 v311 shell、移除列入允許前綴的舊 CKM 快取，保留 unrelated-site-cache。
- 離線時導覽回傳 App Shell，任務 CSS 可用且任務資料可寫入 localStorage。
- Chromium 桌面 Playwright 功能流程無 console/page error；390px 手機 viewport 無水平溢位。
- Pixel 7 profile（Android Chrome 的 Chromium 裝置模擬）412px 無水平溢位，無 page error。

## 未測試

- iOS Safari / iPhone 真機主畫面新增、圖示、啟動畫面、冷啟動及更新後離線。
- Android 實機安裝及不同 OEM 瀏覽器。
- Firefox、WebKit、Edge 實際使用。
- 正式 GitHub Pages 或其他 HTTPS 主機部署、子路徑、CDN 與 MIME 設定。
- 真實飛航模式及作業系統清除／限制儲存空間時的行為。

## 解讀

離線、安裝與快取結果屬「本機 HTTP + Chromium 瀏覽器模擬」；非實際裝置驗收。程式碼具有可部署靜態檔案結構，但網站尚未發布。正式發布前請照 `DEPLOYMENT.md` 執行實機檢查。
