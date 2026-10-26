import os
from flask import Flask, request, jsonify
from flask_cors import CORS
# import tensorflow as tf
# from PIL import Image
# import numpy as np

app = Flask(__name__)
CORS(app)

# TODO: Load ResNet50 model here
# model = tf.keras.models.load_model('path/to/your/model.h5')

# Example locations mapping (from base project)
LOCATIONS = [
    "Location 1", "Location 2", "Location 3", "Location 4", "Location 5",
    "Location 6", "Location 7", "Location 8", "Location 9", "Location 10"
]

@app.route('/api/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    
    try:
        # 1. Read image
        # img = Image.open(file.stream)
        
        # 2. Preprocess to 224x224
        # img = img.resize((224, 224))
        # img_array = np.array(img) / 255.0
        # img_array = np.expand_dims(img_array, axis=0)
        
        # 3. Predict (Mocked for now)
        # predictions = model.predict(img_array)
        # predicted_class_idx = np.argmax(predictions[0])
        # confidence = float(predictions[0][predicted_class_idx])
        
        # Mock Response
        predicted_class_idx = 0
        confidence = 0.95
        
        return jsonify({
            'location_id': predicted_class_idx,
            'location_name': LOCATIONS[predicted_class_idx],
            'confidence': confidence
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'AI Service (ResNet50)'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
