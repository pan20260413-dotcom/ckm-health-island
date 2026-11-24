# 部署指南｜V3.1.2

## 正式網址

- GitHub Repository：____________________________
- GitHub Pages 網址（部署成功後填）：____________________________
- 部署日期／執行者：____________________________

目前**尚未正式部署**。專案沒有 GitHub 帳號授權或 Repository 寫入能力，因此不宣稱已上線，也不填造正式網址。

## GitHub Pages 部署步驟

1. 登入 GitHub，建立你管理的空白 Repository，記下 Repository 名稱及 Pages 子路徑。
2. 將 `CKM_Health_Island_V3.1.2` 資料夾內網站檔案上傳至 `main` 分支根目錄。保留所有相對檔案、圖片及文件。
3. Repository → **Settings → Pages**，選 **Deploy from a branch**，選 `main` 與 `/(root)`，儲存並等待建置完成。
4. GitHub 顯示 Pages URL 後才填入上方網址欄。首度建置可能需數分鐘。
5. 用 HTTPS 網址檢查首頁、CSS/JS/圖片、manifest、180px 圖示及 Service Worker；重新整理 `index.html` 確認沒有 404。
6. `manifest.webmanifest` 的 `start_url`、`scope` 為相對路徑 `./index.html`、`./`；Service Worker 以 `./sw.js` 註冊，scope 應限網站子目錄。
7. 在線開啟一次，待 Service Worker 控制頁面，再測離線。確認 Cache Storage 只含 CKM 項目。
8. 按 `REAL_DEVICE_TEST_CHECKLIST.md` 用實際 iPhone 和 Android 測安裝、離線、紀錄及備份。

## 更新版本

- 保持相同 Repository、Pages 路徑及 localStorage key `ckmIslandState`，維持同一瀏覽器來源資料。
- 每次更動快取內容，遞增 `sw.js` 的 `CACHE_NAME` 尾碼；Service Worker 僅清理 CKM 命名空間舊快取。
- 不要使用根絕對資源路徑（例如 `/habit-system.js`）；GitHub Pages 專案網站位於子目錄，需使用相對路徑。
- 先在測試環境驗證新版、備份及還原，再更新正式網站。瀏覽器可能暫留舊 Service Worker，關閉舊分頁或依提示更新後再測。
- 發布前檢查控制台、網路資源、離線重啟及 localStorage。清快取後確認可重新取得 App Shell。

## 使用者安裝方式（網站部署後）

- Android Chrome：Chrome 選單選「安裝應用程式」或「加到主畫面」（名稱依版本不同）。
- iPhone/iPad Safari：分享 →「加入主畫面」→ 加入，然後從主畫面圖示啟動。
- iOS Safari 不一定顯示瀏覽器安裝提示；網站提供 180px apple-touch icon。圖示、啟動畫面及離線行為仍待實機確認。

## 部署驗收範圍

本機子目錄測試不是 GitHub 帳號或正式 Pages 部署驗收。正式網址須待 GitHub Pages 成功建置後填入，不能以本機預覽 URL 代替。
