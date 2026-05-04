# 🔧 Pre-Flight Checklist

Use this checklist before running the integrated CropCare application.

## ✅ Environment Setup

- [ ] Python 3.8+ installed
  ```bash
  python --version
  ```

- [ ] Virtual environment created at `.venv/`
  ```bash
  python -m venv .venv
  ```

- [ ] Virtual environment activated
  - Windows: `.venv\Scripts\Activate.ps1`
  - macOS/Linux: `source .venv/bin/activate`

- [ ] Python dependencies installed
  ```bash
  pip install -r requirements.txt
  ```

- [ ] Node.js 14+ installed
  ```bash
  node --version
  ```

- [ ] Node dependencies installed
  ```bash
  npm install
  ```

---

## ✅ Model Files

- [ ] `saved_models/crop_cnn_best_model.pkl` exists
- [ ] `saved_models/class_mapping.json` exists
- [ ] `saved_models/cnn_scaler.pkl` exists

**If missing:** Train the model
```bash
python crop_disease_prediction.py
```

---

## ✅ Configuration

- [ ] `.env.local` or `.env` configured with backend URL
  ```bash
  cp .env.example .env.local
  ```
  Then edit if needed:
  ```
  VITE_BACKEND_URL=http://localhost:5000
  ```

- [ ] Backend URL is correct in Vite config
- [ ] No other services using ports 5000 (backend) or 5173 (frontend)

---

## ✅ Source Files Integrity

- [ ] `app.py` exists and is readable
- [ ] `src/services/api.js` has been updated
- [ ] `crop_disease_prediction.py` exists
- [ ] `src/lib/treatments.js` has disease data

---

## ✅ Quick Validation

### Backend
```bash
python -c "import flask; import torch; import timm; print('✓ All backend dependencies available')"
```

### Frontend
```bash
npm list react react-dom react-router-dom
```

### Python Environment
```bash
python -c "import sys; print(f'Python: {sys.version}'); import torch; print(f'PyTorch: {torch.__version__}')"
```

---

## 🚀 Ready to Start!

### Option 1: Quick Start (Windows)
```bash
start-dev.bat
```

### Option 2: Manual Start

**Terminal 1:**
```bash
.venv\Scripts\Activate.ps1
python app.py
```

**Terminal 2:**
```bash
npm run dev
```

### Option 3: Manual Start (macOS/Linux)

**Terminal 1:**
```bash
source .venv/bin/activate
python app.py
```

**Terminal 2:**
```bash
npm run dev
```

---

## 🧪 Verification After Starting

1. **Backend is running?**
   - Visit: http://localhost:5000/health
   - Should return: `{"status":"ok","model_loaded":true,"device":"cpu"}`

2. **Frontend is running?**
   - Visit: http://localhost:5173
   - Should see CropCare homepage

3. **Can upload image?**
   - Click upload button
   - Select image
   - See upload preview

4. **Backend processes image?**
   - Check terminal where `python app.py` runs
   - Should see prediction logs

5. **Result page shows?**
   - Prediction results should appear
   - Treatments should be visible

---

## ❌ Common Issues

### "Port 5000 already in use"
```bash
# Find what's using port 5000
netstat -ano | findstr :5000
# Kill it or use different port
```

### "Model file not found"
Train it first:
```bash
python crop_disease_prediction.py
```

### "CORS error in browser"
- [ ] Backend is running
- [ ] VITE_BACKEND_URL matches backend URL
- [ ] Browser console shows actual error

### "Vite port 5173 already in use"
```bash
npm run dev -- --port 5174
```

---

## 📞 Need Help?

1. Check `INTEGRATION_GUIDE.md` for detailed docs
2. Check `QUICK_START.md` for quick reference
3. See troubleshooting section in each guide

---

**Checklist Version**: 1.0  
**Last Updated**: May 2026
