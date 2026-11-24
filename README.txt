# CKM Health Island V3.1.1

Release Candidate 靜態 PWA 專案。正式候選版本不是醫療器材、臨床決策工具或臨床認證教材。詳細功能、資料安全及測試界線請參閱 `FINAL_AUDIT_REPORT.md`。

## 本機預覽

在專案資料夾執行 `python -m http.server 8000`，瀏覽 `http://localhost:8000/`。Service Worker/PWA 請使用 localhost 或 HTTPS，不要用 `file://`。

## 健康資料

紀錄保存在使用者瀏覽器 localStorage，不會由此 PWA 主動上傳。下載的 JSON 備份含個人健康紀錄，請妥善保管。換瀏覽器、網域或裝置不會自動同步。

## 主要檔案

- `index.html`：六島網站、護照與主要互動。
- `habit-system.js`、`habit-system.css`：60 項任務、紀錄及任務庫介面。
- `sw.js`、`manifest.webmanifest`、`icon-*`：PWA 離線及安裝資源。
- `MEDICAL_REVIEW_60_TASKS.md`、`REFERENCES.md`：健康內容審查及來源。
- `FINAL_AUDIT_REPORT.md`、`SECURITY_AUDIT.md`、`PWA_TEST_REPORT.md`：驗收限制及結果。
- `audit_*.py`：本機 Playwright 重現測試腳本（需另安裝 Playwright Chromium）。
