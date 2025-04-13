# Expiry Date Recognition API

A FastAPI-based microservice that extracts expiry dates from uploaded food label images using OCR.

## Quickstart

### 1. Clone the repo

### 2. Install Requirements (.txt)

### 3. Tesseract OCR setup (Required)

This project uses [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) to extract text from images. You need to install it **separately**:
1. Download the installer: [UB Mannheim Build](https://github.com/UB-Mannheim/tesseract/wiki)
2. Install it (default path is `C:\Program Files\Tesseract-OCR\tesseract.exe`)
3. Add that folder to your **System PATH**
4. OR set it in code like this:

```python
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"yourPathToExe\tesseract.exe"
```

### 4. RUN
```bash
uvicorn main:app --reload --port 5001
```