from fastapi import FastAPI, UploadFile, File
import uvicorn
from fastapi.responses import JSONResponse
from services.ocr import extract_text_from_image
from services.date_extractor import extract_expiry_dates

# Create FastAPI instance
app = FastAPI()

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Expiry Date Recognition API"}

# Example endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/extract-expiry")
async def extract_expiry(image: UploadFile = File(...)):
    contents = await image.read()
    text = extract_text_from_image(contents)
    dates = extract_expiry_dates(text)
    
    return JSONResponse(content={
        "received": image.filename,
        "extracted_text": text,
        "expiry_dates": dates
    })
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)