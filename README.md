# CropCare - Crop Disease Diagnosis App

Professional crop disease diagnosis application with integrated Python ML backend and React frontend. Uses trained PyTorch CNN model for accurate disease classification across 17 crop diseases.

## Features
- 🤖 **AI-Powered Diagnosis**: Upload crop photos → ML model identifies disease with confidence score (17 real diseases)
- 🌍 **Multi-language**: English, Hindi, Marathi, Gujarati
- 📱 **Responsive**: Desktop/mobile optimized
- 💊 **Expert Treatments**: Scientific + farmer-friendly steps for each disease
- 🗺️ **Nearby Shops**: Google Places API integration for agricultural supplies
- 📊 **Persistent History**: localStorage for diagnosis tracking
- 🔄 **Automatic Fallback**: Works offline with mock predictions if backend unavailable

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Flask + Python
- **ML Model**: PyTorch + torchvision + timm
- **Data**: localStorage for persistence

## Quick Start

### 1. **Easiest Way (Windows)**
```bash
start-dev.bat
```

### 2. **Manual Setup (All Platforms)**

**Terminal 1 - Backend:**
```bash
# Activate virtual environment
.venv\Scripts\Activate.ps1  # Windows
# or
source .venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start Flask backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

Open http://localhost:5173

## Architecture
```
React Frontend → Flask API → PyTorch Model
```

Backend endpoints:
- `POST /api/predict` - Analyze crop image
- `GET /api/classes` - List all disease classes
- `GET /health` - Health check

## Full Documentation
See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for:
- Detailed setup instructions
- API documentation
- Troubleshooting
- Development notes

## Model Information
- **Model**: RexNet-150 (pretrained ImageNet → fine-tuned)
- **Classes**: 17 crop diseases across corn, potato, rice, sugarcane, wheat
- **Location**: `saved_models/crop_cnn_best_model.pkl`
- **Framework**: PyTorch 2.0+

## File Structure
```
├── app.py                    # Flask backend
├── crop_disease_prediction.py # Model training script
├── requirements.txt          # Python dependencies
├── package.json             # Node dependencies
├── src/                     # React frontend
│   ├── services/api.js      # Backend API client
│   ├── lib/treatments.js    # Disease treatment database
│   └── pages/UploadPage.jsx # Image upload interface
├── saved_models/            # ML model files
└── Crop Diseases/           # Dataset directory
```

## Development
- Edit diseases: [src/lib/treatments.js](src/lib/treatments.js)
- Add languages: [src/constants/translations.js](src/constants/translations.js)
- API configuration: `.env.local` (copy from `.env.example`)

## Production Deployment

### Backend (Python/Flask)
```bash
pip install gunicorn
gunicorn --workers 4 app:app
```

### Frontend
```bash
npm run build
# Serve dist/ folder with any static web server
```

## Troubleshooting
See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md#troubleshooting)

## Disclaimer
Educational tool for crop disease identification. Always consult agricultural experts for real-world decisions. Model predictions are probabilistic estimates.

MIT License.

