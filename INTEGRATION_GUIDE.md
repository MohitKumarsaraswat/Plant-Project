# CropCare Backend-Frontend Integration Guide

## Overview
This project now integrates a Python ML model (PyTorch) with a React frontend using a Flask backend API.

## Architecture

```
┌─────────────────────────────────────────┐
│        React Frontend (Vite)            │
│  ┌─────────────────────────────────────┐│
│  │  UploadPage.jsx                     ││
│  │  - Captures crop images             ││
│  │  - Sends to Flask backend           ││
│  └─────────────────────────────────────┘│
└──────────────────┬──────────────────────┘
                   │ HTTP API
                   ▼
┌─────────────────────────────────────────┐
│     Flask Backend (app.py)              │
│  ┌─────────────────────────────────────┐│
│  │ /api/predict                        ││
│  │ - Loads PyTorch model               ││
│  │ - Processes image                   ││
│  │ - Returns disease prediction        ││
│  └─────────────────────────────────────┘│
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  PyTorch ML Model (saved_models/)       │
│  - crop_cnn_best_model.pkl             │
│  - class_mapping.json                  │
│  - cnn_scaler.pkl                      │
└─────────────────────────────────────────┘
```

## Setup Instructions

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

Make sure you're in the virtual environment:
```bash
# Windows (PowerShell)
.\.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate
```

### 2. Verify the Model Files
Ensure these files exist in the `saved_models/` directory:
- `crop_cnn_best_model.pkl` - The trained PyTorch model
- `class_mapping.json` - Class name mappings
- `cnn_scaler.pkl` - Feature scaler (if needed)

If the model file is missing, you'll need to train the model first using `crop_disease_prediction.py`.

### 3. Start the Flask Backend
```bash
python app.py
```

The backend will start on `http://localhost:5000` and display:
```
Starting Crop Disease Prediction API...
✓ Model loaded successfully on cpu
✓ Transforms initialized
 * Running on http://0.0.0.0:5000
```

### 4. Configure Frontend Environment
Create a `.env.local` file in the root (or copy from `.env.example`):
```env
VITE_BACKEND_URL=http://localhost:5000
```

### 5. Start the Frontend (in a new terminal)
```bash
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy).

## API Endpoints

### POST `/api/predict`
**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response:**
```json
{
  "disease": "Corn Common Rust",
  "confidence": 0.92,
  "severity": "moderate",
  "is_healthy": false,
  "all_predictions": {
    "Corn___Common_Rust": 0.92,
    "Corn___Gray_Leaf_Spot": 0.05,
    ...
  },
  "timestamp": null
}
```

### GET `/health`
Health check endpoint. Returns:
```json
{
  "status": "ok",
  "model_loaded": true,
  "device": "cpu"
}
```

### GET `/api/classes`
Get list of all disease classes:
```json
{
  "classes": [
    "Corn___Common_Rust",
    "Corn___Gray_Leaf_Spot",
    ...
  ],
  "total": 17
}
```

## Key Features

✅ **Real ML Model Integration** - Uses trained PyTorch model for predictions
✅ **Automatic Fallback** - Falls back to offline mode if backend is unavailable
✅ **CORS Enabled** - Allows frontend to communicate with backend
✅ **Error Handling** - Graceful error messages and fallbacks
✅ **Image Preprocessing** - Automatic image resizing and normalization

## Troubleshooting

### "Model file not found at saved_models/crop_cnn_best_model.pkl"
**Solution:** Train the model first:
```bash
python crop_disease_prediction.py
```

### "Connection refused" when frontend tries to call backend
**Solutions:**
1. Make sure Flask backend is running: `python app.py`
2. Check if the backend URL in `.env.local` is correct
3. Verify no firewall is blocking port 5000

### "CORS error" in browser console
**Solution:** CORS is already enabled in `app.py`. If issues persist, check:
- Backend is running
- Frontend URL matches the backend's allowed origins

### Model predictions seem random
**Possible Causes:**
1. The wrong model file is being loaded
2. The class mapping is incorrect
3. Image preprocessing steps differ from training

**Solution:** Verify the model was trained with the same image normalization constants (MEAN, STD in app.py).

## Development Notes

- **Frontend API:** `src/services/api.js` - Handles both backend and offline modes
- **Treatments DB:** `src/lib/treatments.js` - Contains disease treatment info
- **Backend API:** `app.py` - Flask application with model inference
- **Model Training:** `crop_disease_prediction.py` - Original training script

## Future Enhancements

- [ ] Add model versioning
- [ ] Implement request rate limiting
- [ ] Add prediction confidence logging
- [ ] Create admin dashboard for model statistics
- [ ] Support GPU acceleration
- [ ] Add model retraining via API

## Files Modified

1. **app.py** (NEW) - Flask backend with ML inference
2. **requirements.txt** - Added Flask dependencies
3. **src/services/api.js** - Updated to call backend
4. **.env.example** (NEW) - Environment configuration template
