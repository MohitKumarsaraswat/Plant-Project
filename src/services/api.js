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
  // Default center is near Amity University, Noida.
  // Mock shops are used only when Google Places key/coords are missing or API fails.
  return [
    { id: 1, name: 'Green Valley Agro', address: 'Sector 44 Market, Near Crossing', distance: '0.8 km', phone: '+91 98765 43210', rating: 4.8, location: { latitude: lat + 0.0040, longitude: lng - 0.0060 } },
    { id: 2, name: 'Kisan Seva Kendra', address: 'Noida-Greater Noida Rd, Sector 44', distance: '1.6 km', phone: '+91 98765 43211', rating: 4.5, location: { latitude: lat + 0.0100, longitude: lng + 0.0030 } },
    { id: 3, name: 'Organic Farm Store', address: 'Amity Road, Near Local Chowk', distance: '2.2 km', phone: '+91 98765 43212', rating: 4.7, location: { latitude: lat - 0.0035, longitude: lng + 0.0100 } },
    { id: 4, name: 'Agri Mart & Seeds', address: 'Sector 45, Shop No. 12', distance: '2.6 km', phone: '+91 98765 43213', rating: 4.4, location: { latitude: lat + 0.0065, longitude: lng + 0.0080 } },
    { id: 5, name: 'Fertilizer Point', address: 'Sector 43, Near Bus Stop', distance: '1.1 km', phone: '+91 98765 43214', rating: 4.6, location: { latitude: lat + 0.0015, longitude: lng + 0.0045 } },
    { id: 6, name: 'Pesticide & Sprayer Hub', address: 'Noida Sector 46, Market Lane', distance: '3.4 km', phone: '+91 98765 43215', rating: 4.3, location: { latitude: lat - 0.0060, longitude: lng + 0.0020 } },
    { id: 7, name: 'Krishi Kendra', address: 'Sector 44, Near Temple Gate', distance: '2.8 km', phone: '+91 98765 43216', rating: 4.2, location: { latitude: lat + 0.0090, longitude: lng - 0.0015 } },
    { id: 8, name: 'Seed World', address: 'Sector 47, Main Market', distance: '4.1 km', phone: '+91 98765 43217', rating: 4.7, location: { latitude: lat - 0.0020, longitude: lng - 0.0120 } },
    { id: 9, name: 'Verde Plant Supplies', address: 'Sector 48, Near Park', distance: '5.0 km', phone: '+91 98765 43218', rating: 4.1, location: { latitude: lat + 0.0120, longitude: lng + 0.0105 } },
    { id: 10, name: 'FarmFresh Inputs', address: 'Noida Expressway Side Market', distance: '6.2 km', phone: '+91 98765 43219', rating: 4.6, location: { latitude: lat - 0.0100, longitude: lng + 0.0060 } },
    { id: 11, name: 'AgriCare Chemicals', address: 'Sector 43, Near Clinic', distance: '3.0 km', phone: '+91 98765 43220', rating: 4.4, location: { latitude: lat + 0.0030, longitude: lng + 0.0140 } },
    { id: 12, name: 'Smart Seeds & Tools', address: 'Sector 46, Hardware Junction', distance: '4.7 km', phone: '+91 98765 43221', rating: 4.5, location: { latitude: lat + 0.0160, longitude: lng - 0.0040 } },
    { id: 13, name: 'Bio Fertilizer Store', address: 'Sector 45, Near Community Center', distance: '2.9 km', phone: '+91 98765 43222', rating: 4.3, location: { latitude: lat - 0.0048, longitude: lng - 0.0030 } },
    { id: 14, name: 'Irrigation & Drip Mart', address: 'Sector 48, Near Water Tank', distance: '7.8 km', phone: '+91 98765 43223', rating: 4.2, location: { latitude: lat + 0.0080, longitude: lng - 0.0170 } },
    { id: 15, name: 'Krishi Solutions', address: 'Noida Sector 42, Market Road', distance: '8.5 km', phone: '+91 98765 43224', rating: 4.6, location: { latitude: lat - 0.0140, longitude: lng - 0.0070 } },
    { id: 16, name: 'Soil Testing & Inputs', address: 'Sector 47, Near Metro Connector', distance: '9.6 km', phone: '+91 98765 43225', rating: 4.7, location: { latitude: lat + 0.0200, longitude: lng + 0.0040 } },
    { id: 17, name: 'Garden & Agro Supplies', address: 'Sector 49, Local Chowk', distance: '10.8 km', phone: '+91 98765 43226', rating: 4.1, location: { latitude: lat - 0.0080, longitude: lng + 0.0180 } },
    { id: 18, name: 'Neem & Bio Remedies', address: 'Sector 43, Near Overbridge', distance: '1.9 km', phone: '+91 98765 43227', rating: 4.4, location: { latitude: lat + 0.0060, longitude: lng - 0.0100 } },
    { id: 19, name: 'Agronomy Supplies', address: 'Sector 46, Near Petrol Pump', distance: '5.6 km', phone: '+91 98765 43228', rating: 4.5, location: { latitude: lat - 0.0115, longitude: lng - 0.0005 } },
    { id: 20, name: 'Kisan Agro Store', address: 'Sector 45, Main Road', distance: '3.7 km', phone: '+91 98765 43229', rating: 4.2, location: { latitude: lat + 0.0010, longitude: lng - 0.0150 } }
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

