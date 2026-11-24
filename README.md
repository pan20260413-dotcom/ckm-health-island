# CKM Health Island V3.1.2

**健康群島共和國｜社區 CKM 健康識能與生活習慣學習 PWA**

此版本從 V3.1.1 複製後做小幅修正；保留六島地圖、健康護照、任務資料庫、四大健康主題、種樹、XP、徽章、統計、瀏覽器本機儲存及舊版 JSON 備份匯入相容。

## 本機預覽

需要 Python 3。於專案資料夾執行：

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

瀏覽 `http://127.0.0.1:8000/index.html`。PWA Service Worker 僅於 localhost 或 HTTPS 可用；不要以 `file://` 開啟。停止伺服器按 `Ctrl+C`。

## 自動化測試重現

需要 Python 3、Node.js 和 Playwright Chromium。從專案資料夾另開 PowerShell：

```powershell
python -m pip install -r requirements-test.txt
python -m playwright install chromium
python audit_playwright.py
python audit_roundtrip_empty.py
python audit_data_security.py
python audit_pwa.py
python audit_pwa_lifecycle.py
python audit_date_rollover.py
node --check habit-system.js
node --check sw.js
```

六支瀏覽器測試共用 `test_config.py`，預設網址為 `http://127.0.0.1:8000/index.html`。若測 GitHub Pages 子目錄，可設定：

```powershell
$env:CKM_BASE_URL = 'http://127.0.0.1:8001/CKM_Health_Island_V3.1.2/index.html'
```

需在父資料夾另外執行 `python -m http.server 8001 --bind 127.0.0.1`。測試使用獨立 Playwright browser context，不讀取或清除一般瀏覽器個人資料。`audit_roundtrip_empty.py` 只清除其新建的暫時測試 context。

## 個人資料

健康任務、日誌及設定保存在目前瀏覽器來源的 `localStorage`。不會由此 PWA 主動上傳。換手機、瀏覽器或網站網域不會自動同步。請定期下載 JSON 備份；備份可能含健康與生活紀錄，請妥善保管，不要任意轉傳。

## 限制

健康內容是一般教育，不診斷、不分期、不取代醫療照護。醫療數值示意題使用虛構資料。醫師、營養師或其他臨床專業人員尚未簽核；正式社區試辦前應完成 `MEDICAL_REVIEW_CHECKLIST.md`。

網站尚未部署。部署及正式網址欄位見 `DEPLOYMENT_GUIDE.md`。本版的自動化和本機子目錄測試結果見 `TEST_REPORT.md`；真實 iPhone／Android 項目請填 `REAL_DEVICE_TEST_CHECKLIST.md`。

## 主要檔案

- `index.html`：六島網站、護照與互動教材。
- `habit-system.js`、`habit-system.css`：60 項任務及紀錄。
- `manifest.webmanifest`、`sw.js`、`icon-*.png`：PWA 安裝／離線資源。
- `REFERENCES.md`：健康數值、教育內容及 60 項任務來源索引。
- `MEDICAL_REVIEW_60_TASKS.md`：逐項內容檢視；`MEDICAL_REVIEW_CHECKLIST.md`：臨床專業人員待審核／簽核表。
- `DATA_PRIVACY.md`：資料儲存及使用者須知。

