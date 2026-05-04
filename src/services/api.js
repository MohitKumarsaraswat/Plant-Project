// CropCare API - Connected to Python/Flask Backend
import { getTreatmentRecommendations, toDisplayDisease, canonicalizeDiseaseName, assessSeverity, isHealthyClassification, getOfflineDiagnosis } from '../lib/treatments.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export async function analyzeImage(imageBase64) {
  try {
    // Try to call backend API
    const response = await fetch(`${BACKEND_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageBase64 })
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    
    // Format response to match expected structure
    const canonical = canonicalizeDiseaseName(data.disease);
    const treatment = getTreatmentRecommendations(canonical);
    const displayDisease = toDisplayDisease(canonical);
    
    return {
      disease: displayDisease,
      diseaseCode: canonical,
      severity: data.severity || assessSeverity(data.confidence),
      scientific: treatment.scientific,
      farmerSteps: treatment.farmerSteps,
      confidence: Math.round(data.confidence * 100) / 100,
      isHealthy: data.is_healthy || isHealthyClassification(canonical),
      image: imageBase64,
      date: new Date().toISOString(),
      allPredictions: data.all_predictions || {}
    };
    
  } catch (error) {
    console.warn('Backend unavailable, falling back to offline mode:', error.message);
    // Fallback to offline diagnosis if backend is down
    return getOfflineDiagnosis(imageBase64);
  }
}

export async function fetchShops(latitude, longitude, apiKey = null) {
  // Direct Google Places (provide apiKey) or fallback mocks - no backend proxy
  if (!apiKey || !latitude || !longitude) {
    return getMockShops(latitude, longitude);
  }
  const radiusKm = 10;
  const radiusM = radiusKm * 1000;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radiusM}&keyword=agri|kisan|fertilizer|pesticide&key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Google API error');
    const data = await res.json();
    if (data.status !== 'OK') return getMockShops(latitude, longitude);
    return data.results.slice(0, 10).map((place) => ({
      name: place.name,
      address: place.vicinity || 'N/A',
      phone: place.formatted_phone_number || 'N/A',
      rating: place.rating || 0,
      distance: '<5km',
      location: place.geometry.location
    }));
  } catch {
    return getMockShops(latitude, longitude);
  }
}

export function getMockShops(lat = 28.6139, lng = 77.2090) {
  return [
    { id: 1, name: 'Green Valley Agro', address: 'Main Market, Near Temple', distance: '0.5 km', phone: '+91 98765 43210', rating: 4.8, location: { latitude: lat, longitude: lng } },
    { id: 2, name: 'Kisan Seva Kendra', address: 'Highway Road, Block B', distance: '1.2 km', phone: '+91 98765 43211', rating: 4.5, location: { latitude: lat, longitude: lng } },
    { id: 3, name: 'Organic Farm Store', address: 'Village Center', distance: '2.0 km', phone: '+91 98765 43212', rating: 4.7, location: { latitude: lat, longitude: lng } }
  ];
}

export function fetchDiagnoses() {
  // Offline localStorage history - MongoDB/SQLite removed
  try {
    const str = localStorage.getItem('cropcareDiagnoses') || '[]';
    return JSON.parse(str);
  } catch {
    return [];
  }
}

export function saveDiagnosis(diagnosis) {
  try {
    const diagnoses = fetchDiagnoses();
    diagnoses.unshift(diagnosis);
    if (diagnoses.length > 50) diagnoses.length = 50;
    localStorage.setItem('cropcareDiagnoses', JSON.stringify(diagnoses));
  } catch (e) {
    console.error('localStorage error:', e);
  }
}

