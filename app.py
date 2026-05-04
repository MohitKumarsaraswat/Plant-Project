"""
Flask Backend for Crop Disease Prediction
Serves the PyTorch model via REST API
"""

import os
import json
import torch
import pickle
import base64
import numpy as np
from io import BytesIO
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
import timm
from torchvision import transforms as T

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configuration
MODEL_DIR = "saved_models"
MODEL_PATH = os.path.join(MODEL_DIR, "crop_cnn_best_model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "cnn_scaler.pkl")
CLASS_MAPPING_PATH = os.path.join(MODEL_DIR, "class_mapping.json")

# Model settings
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
IMAGE_SIZE = 224
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]

# Global model and class mapping
model = None
class_mapping = None
transforms = None


def load_model():
    """Load the trained model and class mapping"""
    global model, class_mapping, transforms
    
    try:
        # Load class mapping
        with open(CLASS_MAPPING_PATH, 'r') as f:
            class_mapping = json.load(f)
        
        # Load the model
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, 'rb') as f:
                model = pickle.load(f)
            model = model.to(DEVICE)
            model.eval()
            print(f"✓ Model loaded successfully on {DEVICE}")
        else:
            print(f"✗ Model file not found at {MODEL_PATH}")
            print("  The model will need to be trained first.")
            
        # Setup transforms
        transforms = T.Compose([
            T.Resize((IMAGE_SIZE, IMAGE_SIZE)),
            T.ToTensor(),
            T.Normalize(mean=MEAN, std=STD)
        ])
        
        print("✓ Transforms initialized")
        return True
        
    except Exception as e:
        print(f"✗ Error loading model: {str(e)}")
        return False


def preprocess_image(image_data):
    """Convert base64 image to tensor"""
    try:
        # Decode base64
        if isinstance(image_data, str):
            if image_data.startswith('data:image'):
                # Handle data URL format
                image_data = image_data.split(',')[1]
            image_bytes = base64.b64decode(image_data)
        else:
            image_bytes = image_data.read()
        
        # Open image
        image = Image.open(BytesIO(image_bytes)).convert('RGB')
        
        # Transform
        tensor = transforms(image).unsqueeze(0).to(DEVICE)
        return tensor
        
    except Exception as e:
        print(f"Error preprocessing image: {str(e)}")
        return None


def predict(image_tensor):
    """Get prediction from model"""
    try:
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            confidence, predicted_idx = torch.max(probabilities, 1)
            
        predicted_class = class_mapping['idx_to_class'][str(predicted_idx.item())]
        confidence_value = confidence.item()
        
        # Get all class probabilities
        all_probs = probabilities.cpu().numpy()[0]
        class_scores = {
            class_mapping['idx_to_class'][str(i)]: float(prob)
            for i, prob in enumerate(all_probs)
        }
        
        return {
            'predicted_class': predicted_class,
            'confidence': confidence_value,
            'all_predictions': class_scores
        }
        
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return None


def assess_severity(confidence):
    """Assess severity based on confidence"""
    if confidence > 0.8:
        return 'severe'
    elif confidence > 0.6:
        return 'moderate'
    else:
        return 'mild'


def is_healthy(disease_class):
    """Check if disease classification is healthy"""
    return 'Healthy' in disease_class


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'device': DEVICE
    })


@app.route('/api/predict', methods=['POST'])
def predict_disease():
    """
    Main prediction endpoint
    Expects: JSON with 'image' field containing base64 encoded image
    Returns: Disease prediction with confidence and treatment info
    """
    try:
        if not model:
            return jsonify({
                'error': 'Model not loaded. Please train the model first.'
            }), 503
        
        # Get image from request
        if 'image' not in request.json:
            return jsonify({'error': 'Missing image field'}), 400
        
        image_data = request.json['image']
        
        # Preprocess
        image_tensor = preprocess_image(image_data)
        if image_tensor is None:
            return jsonify({'error': 'Failed to process image'}), 400
        
        # Predict
        result = predict(image_tensor)
        if result is None:
            return jsonify({'error': 'Prediction failed'}), 500
        
        # Enhance result with severity and treatment info
        disease_class = result['predicted_class']
        confidence = result['confidence']
        
        return jsonify({
            'disease': disease_class,
            'confidence': confidence,
            'severity': assess_severity(confidence),
            'is_healthy': is_healthy(disease_class),
            'all_predictions': result['all_predictions'],
            'timestamp': None  # Can be added if needed
        })
        
    except Exception as e:
        print(f"Prediction endpoint error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/classes', methods=['GET'])
def get_classes():
    """Get list of all disease classes"""
    if not class_mapping:
        return jsonify({'error': 'Class mapping not loaded'}), 503
    
    return jsonify({
        'classes': list(class_mapping['class_to_idx'].keys()),
        'total': len(class_mapping['class_to_idx'])
    })


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    # Load model on startup
    print("Starting Crop Disease Prediction API...")
    load_model()
    
    # Run Flask app
    # Use debug=False in production
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=False  # Prevent double loading of model
    )
