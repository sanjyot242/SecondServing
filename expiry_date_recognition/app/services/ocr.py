# app/services/ocr.py
import cv2
import numpy as np
import pytesseract

# Tesseract path 'C:\Users\rusht\AppData\Local\Programs\Tesseract-OCR'

pytesseract.pytesseract.tesseract_cmd = r"C:\Users\rusht\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"

def extract_text_from_image(image_bytes: bytes) -> str:
    # Convert byte array to OpenCV image
    file_bytes = np.asarray(bytearray(image_bytes), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    
    # Optional preprocessing (tune later)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return pytesseract.image_to_string(gray)
