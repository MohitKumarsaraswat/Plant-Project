/* Offline Treatments & Disease Logic - Ported from backend.py */

export const DISEASE_CLASSES = [
  'Corn___Common_Rust',
  'Corn___Gray_Leaf_Spot',
  'Corn___Healthy',
  'Corn___Northern_Leaf_Blight',
  'Potato___Early_Blight',
  'Potato___Healthy',
  'Potato___Late_Blight',
  'Rice___Brown_Spot',
  'Rice___Healthy',
  'Rice___Leaf_Blast',
  'Rice___Neck_Blast',
  'Sugarcane_Bacterial Blight',
  'Sugarcane_Healthy',
  'Sugarcane_Red Rot',
  'Wheat___Brown_Rust',
  'Wheat___Healthy',
  'Wheat___Yellow_Rust'
];

export function normalizeDiseaseKey(disease) {
  if (!disease) return '';
  return disease.trim().toLowerCase().replace(/___/g, ' ').replace(/_/g, ' ').replace(/[^a-z0-9 ]+/g, '').replace(/\\s+/g, ' ').trim();
}

export function toDisplayDisease(disease) {
  if (!disease) return 'Unknown';
  return disease.replace(/___/g, ' ').replace(/_/g, ' ').trim().replace(/\\s+/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function canonicalizeDiseaseName(disease) {
  const normalized = normalizeDiseaseKey(disease);
  for (const cls of DISEASE_CLASSES) {
    if (normalizeDiseaseKey(cls) === normalized) {
      return cls;
    }
  }
  return disease;
}

export function isHealthyClassification(disease) {
  return normalizeDiseaseKey(disease).includes('healthy');
}

export function assessSeverity(confidence) {
  if (confidence > 0.8) return 'severe';
  if (confidence > 0.6) return 'moderate';
  return 'mild';
}

export function getTreatmentRecommendations(disease) {
  const diseaseKey = normalizeDiseaseKey(disease);
  const treatments = {
    'corn common rust': {
      scientific: { medicine: 'Propiconazole or Tebuconazole fungicide', dosage: '1-2 ml per liter of water', frequency: 'Every 10-14 days' },
      farmerSteps: ['Plant resistant corn varieties', 'Apply fungicide spray starting at first sign', 'Remove infected plant debris', 'Improve air circulation', 'Monitor for disease spread']
    },
    'corn gray leaf spot': {
      scientific: { medicine: 'Azoxystrobin fungicide', dosage: '1 ml per liter of water', frequency: 'Every 7-10 days' },
      farmerSteps: ['Plant resistant corn hybrid', 'Avoid working with wet plants', 'Remove and destroy infected leaves', 'Rotate crops annually', 'Apply fungicide at early infection stage']
    },
    'corn healthy': {
      scientific: { medicine: 'No treatment needed - Plant is healthy!', dosage: 'N/A', frequency: 'N/A' },
      farmerSteps: ['Excellent! Your corn plant shows no signs of disease', 'Continue regular monitoring for early detection', 'Maintain proper spacing (30-45 cm) for air flow', 'Water at soil level to keep leaves dry', 'Apply balanced NPK fertilizer as needed']
    },
    // ... (add all 17 from backend.py - truncated for brevity, full port below)
    'corn northern leaf blight': {
      scientific: { medicine: 'Mancozeb or Chlorothalonil fungicide', dosage: '2-3 grams per liter of water', frequency: 'Every 7-10 days' },
      farmerSteps: ['Plant resistant corn varieties', 'Apply fungicide at boot stage', 'Remove infected leaves', 'Ensure good air circulation', 'Properly dispose infected residue']
    },
    'potato early blight': {
      scientific: { medicine: 'Copper-based fungicide', dosage: '2-3 grams per liter of water', frequency: 'Every 7-10 days for 3 weeks' },
      farmerSteps: ['Remove and destroy infected leaves', 'Apply copper fungicide spray', 'Ensure proper plant spacing', 'Avoid overhead watering', 'Apply mulch around plants']
    },
    'potato healthy': {
      scientific: { medicine: 'No treatment needed - Plant is healthy!', dosage: 'N/A', frequency: 'N/A' },
      farmerSteps: ['Excellent! Your potato plant shows no signs of disease', 'Continue regular monitoring for early detection', 'Maintain consistent soil moisture', 'Apply balanced fertilizer with emphasis on potassium']
    },
    'potato late blight': {
      scientific: { medicine: 'Metalaxyl fungicide', dosage: '2 ml per liter of water', frequency: 'Every 7-10 days' },
      farmerSteps: ['Plant resistant potato varieties', 'Apply fungicide preventively', 'Ensure proper drainage', 'Remove infected plants immediately', 'Destroy all infected plant parts']
    },
    'rice brown spot': {
      scientific: { medicine: 'Tricyclazole fungicide', dosage: '1-1.5 ml per liter of water', frequency: 'Every 7-10 days' },
      farmerSteps: ['Apply fungicide at seedling stage', 'Use disease-free seeds', 'Proper nutrient management', 'Remove infected plant parts', 'Ensure proper water management']
    },
    'rice healthy': {
      scientific: { medicine: 'No treatment needed - Plant is healthy!', dosage: 'N/A', frequency: 'N/A' },
      farmerSteps: ['Excellent! Your rice plant shows no signs of disease', 'Continue regular monitoring for early detection', 'Maintain 5-10 cm water level during vegetative stage']
    },
    'rice leaf blast': {
      scientific: { medicine: 'Tricyclazole and Propiconazole mix', dosage: '1 ml per liter of water', frequency: 'Every 7-10 days' },
      farmerSteps: ['Plant resistant rice varieties', 'Apply fungicide at tiller stage', 'Reduce nitrogen fertilizer', 'Improve drainage', 'Remove grass weeds']
    },
    'rice neck blast': {
      scientific: { medicine: 'Tricyclazole fungicide', dosage: '1-1.5 ml per liter of water', frequency: 'Weekly spray at flowering' },
      farmerSteps: ['Apply fungicide at boot and heading stages', 'Plant resistant varieties', 'Avoid excessive nitrogen']
    },
    'sugarcane bacterial blight': {
      scientific: { medicine: 'Copper hydroxide or Streptomycin', dosage: '2 grams per liter of water', frequency: 'Multiple sprays during season' },
      farmerSteps: ['Use disease-free seed cane', 'Disinfect tools between plants', 'Remove and destroy infected plants']
    },
    'sugarcane healthy': {
      scientific: { medicine: 'No treatment needed - Plant is healthy!', dosage: 'N/A', frequency: 'N/A' },
      farmerSteps: ['Excellent! Your sugarcane plant shows no signs of disease', 'Continue regular monitoring for early detection']
    },
    'sugarcane red rot': {
      scientific: { medicine: 'Tridemorph fungicide', dosage: '2-3 ml per liter', frequency: 'Every 2-3 weeks' },
      farmerSteps: ['Use certified healthy seed cane', 'Remove infected cane from field', 'Improve drainage']
    },
    'wheat brown rust': {
      scientific: { medicine: 'Propiconazole or Azoxystrobin', dosage: '1-2 ml per liter of water', frequency: 'Every 10-14 days' },
      farmerSteps: ['Plant resistant wheat varieties', 'Apply fungicide at flag leaf stage', 'Remove infected plant debris']
    },
    'wheat healthy': {
      scientific: { medicine: 'No treatment needed - Plant is healthy!', dosage: 'N/A', frequency: 'N/A' },
      farmerSteps: ['Excellent! Your wheat plant shows no signs of disease', 'Continue regular monitoring for early detection']
    },
    'wheat yellow rust': {
      scientific: { medicine: 'Tebuconazole fungicide', dosage: '1-1.5 ml per liter', frequency: 'Every 10-14 days' },
      farmerSteps: ['Plant susceptible-free wheat variety', 'Apply fungicide early in season']
    }
  };
  return treatments[diseaseKey] || {
    scientific: { medicine: 'General purpose fungicide', dosage: 'As per product instructions', frequency: 'Every 7-10 days' },
    farmerSteps: ['Consult local agricultural extension', 'Remove infected plant parts', 'Apply appropriate fungicide', 'Improve plant care practices']
  };
}

export function getOfflineDiagnosis(imageBase64) {
  // Mock ML prediction - random from real classes (replace with TF.js later)
  const disease = DISEASE_CLASSES[Math.floor(Math.random() * DISEASE_CLASSES.length)];
  const confidence = 0.6 + Math.random() * 0.35; // 0.6-0.95
  const canonical = canonicalizeDiseaseName(disease);
  const treatment = getTreatmentRecommendations(canonical);
  const displayDisease = toDisplayDisease(canonical);
  const severity = isHealthyClassification(canonical) ? 'healthy' : assessSeverity(confidence);

  return {
    disease: displayDisease,
    diseaseCode: canonical,
    severity,
    scientific: treatment.scientific,
    farmerSteps: treatment.farmerSteps,
    confidence: Math.round(confidence * 100) / 100,
    isHealthy: isHealthyClassification(canonical),
    image: imageBase64,
    date: new Date().toISOString()
  };
}

