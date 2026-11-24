"""Shared local URL for all browser audit scripts. Override with CKM_BASE_URL."""
import os
BASE_URL = os.environ.get("CKM_BASE_URL", "http://127.0.0.1:8000/index.html").rstrip("/")
ROOT_URL = BASE_URL.rsplit("/", 1)[0]
