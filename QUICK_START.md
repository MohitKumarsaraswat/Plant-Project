# 🌱 CropCare Quick Start Card

## ⚡ Fastest Way to Run (Windows)
```bash
start-dev.bat
```
That's it! Opens backend on port 5000 and frontend on port 5173.

---

## 📋 Manual Steps (if needed)

### Step 1: Start Backend
```bash
# Activate environment
.venv\Scripts\Activate.ps1

# Run backend
python app.py
```
✅ You should see: "✓ Model loaded successfully on cpu"

### Step 2: Start Frontend (New Terminal)
```bash
npm run dev
```
✅ Opens browser to http://localhost:5173

---

## 🧪 Test the Integration

1. **Open** http://localhost:5173
2. **Upload** a crop disease image
3. **Watch** backend make real predictions
4. **Get** treatment recommendations

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| API Health | http://localhost:5000/health |

---

## ❌ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Model not found" | Train model: `python crop_disease_prediction.py` |
| "Connection refused" | Make sure backend is running on port 5000 |
| "CORS error" | Backend is already CORS-enabled, restart both services |
| Slow on first request | Normal - model loads on first prediction |

---

## 📁 Key Files

- **Backend**: `app.py` (Flask API)
- **Frontend API**: `src/services/api.js`
- **Treatments DB**: `src/lib/treatments.js`
- **Config**: `.env.local` (copy from `.env.example`)

---

## 📚 Need More Help?

See `INTEGRATION_GUIDE.md` for detailed documentation.

---

## 🎯 Development Workflow

```bash
# Terminal 1: Backend
python app.py

# Terminal 2: Frontend
npm run dev

# Terminal 3: Make changes, reload browser
# Changes auto-reload thanks to Vite HMR
```

---

## 🚀 Deploy to Production

**Backend:**
```bash
gunicorn --workers 4 app:app
```

**Frontend:**
```bash
npm run build
# Serve the 'dist' folder
```

---

**Last Updated**: May 2026  
**Status**: ✅ Ready to Use
