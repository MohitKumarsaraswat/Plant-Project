import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Leaf, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../constants/translations';
import { analyzeImage } from '../services/api';
import PageWrapper from '../components/layout/PageWrapper';

const UploadPage = () => {
  const { language, addToHistory } = useApp();
  const navigate = useNavigate();
  const t = translations[language];

  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleFile = useCallback((file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const resizeImage = (base64, maxWidth = 224, maxHeight = 224) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        ctx.drawImage(img, 0, 0, maxWidth, maxHeight);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = base64;
    });
  };

  const runAnalysis = useCallback(async () => {
    if (!preview) return;
    setIsAnalyzing(true);
    setProgress(0);

    // Resize image for ML-like processing
    const resizedPreview = await resizeImage(preview);
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 5, 90));
    }, 150);

    // Always offline - no try/catch needed
    const data = await analyzeImage(resizedPreview);
    clearInterval(interval);
    setProgress(100);

    setTimeout(() => {
      addToHistory(data);
      setIsAnalyzing(false);
      navigate('/result');
    }, 500);
  }, [preview, addToHistory, navigate, resizeImage]);

  return (
    <PageWrapper>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-900 mb-2 font-display">{t.uploadTitle}</h1>
          <p className="text-green-700/70">We'll help identify any issues</p>
        </div>

        <div className="leaf-card rounded-3xl p-6 sm:p-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
              isDragging ? 'border-green-500 bg-green-50' : 'border-green-300 hover:border-green-400 hover:bg-green-50/50'
            }`}
          >
            {preview ? (
              <div className="space-y-4 animate-grow-in">
                <div className="relative inline-block rounded-2xl overflow-hidden shadow-lg">
                  <img src={preview} alt="Preview" className="max-h-56 mx-auto" />
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                  className="text-sm text-green-600 hover:text-red-500 transition-colors font-medium"
                  data-testid="btn-clear"
                >
                  <X className="w-4 h-4 inline mr-1" /> Remove photo
                </button>
              </div>
            ) : (
              <div className="animate-fade-up">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center animate-sway">
                  <Camera className="w-9 h-9 text-green-600" />
                </div>
                <p className="text-green-800 font-medium mb-2">{t.dragDrop}</p>
                <p className="text-sm text-green-600/70">JPG, PNG up to 10MB</p>
              </div>
            )}
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
              data-testid="input-file"
            />
          </div>

          {preview && (
            <div className="mt-6 space-y-4 animate-fade-up">
              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Analyzing your crop...</span>
                    <span className="text-green-600 font-medium">{progress}%</span>
                  </div>
                  <div className="h-3 bg-green-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="w-full btn-nature py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 disabled:opacity-60"
                data-testid="btn-analyze"
              >
                <Leaf className={isAnalyzing ? 'animate-spin' : ''} />
                {isAnalyzing ? 'Checking...' : t.analyze}
              </button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default UploadPage;

