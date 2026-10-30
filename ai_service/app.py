import os
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import keras
import tensorflow as tf

load_dotenv()

# Bo qua tham so quantization_config khi phuc hoi mo hinh de tuong thich cac phien ban Keras
_original_layer_init = keras.layers.Layer.__init__
def _patched_layer_init(self, *args, **kwargs):
    kwargs.pop('quantization_config', None)
    return _original_layer_init(self, *args, **kwargs)
keras.layers.Layer.__init__ = _patched_layer_init

app = Flask(__name__)
CORS(app)

PORT = int(os.environ.get('PORT', 5001))
MODEL_PATH = os.environ.get('MODEL_PATH', r'D:\MoHinh\TongHop\resnet50_final_best_model.keras')

LOCATIONS = [
    {"index": 0, "ma_dia_diem": "DD0001", "location_name": "Cần Thơ"},
    {"index": 1, "ma_dia_diem": "DD0002", "location_name": "Đà Lạt"},
    {"index": 2, "ma_dia_diem": "DD0003", "location_name": "Đà Nẵng"},
    {"index": 3, "ma_dia_diem": "DD0004", "location_name": "Hà Nội"},
    {"index": 4, "ma_dia_diem": "DD0005", "location_name": "Hội An"},
    {"index": 5, "ma_dia_diem": "DD0006", "location_name": "Ninh Bình"},
    {"index": 6, "ma_dia_diem": "DD0007", "location_name": "Phan Thiết"},
    {"index": 7, "ma_dia_diem": "DD0008", "location_name": "Phú Quốc"},
    {"index": 8, "ma_dia_diem": "DD0009", "location_name": "Sapa"},
    {"index": 9, "ma_dia_diem": "DD0010", "location_name": "Vịnh Hạ Long"},
]

model = None

def load_ai_model():
    global model
    try:
        if os.path.exists(MODEL_PATH):
            model = keras.models.load_model(MODEL_PATH)
            print(f"Model da duoc nap thanh cong tu: {MODEL_PATH}")
        else:
            print(f"Khong tim thay file model tai: {MODEL_PATH}")
    except Exception as err:
        print(f"Loi khi nap model: {err}")

load_ai_model()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'AI Service (ResNet50)',
        'model_loaded': model is not None
    }), 200

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model chua duoc nap tren he thong'}), 503

    if 'image' not in request.files:
        return jsonify({'error': 'Vui long tai len file anh voi key la image'}), 400

    file = request.files['image']
    if not file or file.filename == '':
        return jsonify({'error': 'Tep anh khong hop le hoac bi rong'}), 400

    try:
        # Chuyen doi anh sang RGB va kich thuoc 224x224
        image = Image.open(file.stream).convert('RGB')
        image = image.resize((224, 224))

        # Chuyen anh sang mang float32, giu nguyen mien gia tri 0-255 vi model da tich hop san preprocess ben trong
        img_array = np.array(image, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)

        predictions = model.predict(img_array, verbose=0)[0]
        top_indices = np.argsort(predictions)[::-1][:3]

        best_index = int(top_indices[0])
        best_confidence = round(float(predictions[best_index]) * 100, 2)

        top_k = []
        for idx in top_indices:
            idx_int = int(idx)
            top_k.append({
                'index': idx_int,
                'ma_dia_diem': LOCATIONS[idx_int]['ma_dia_diem'],
                'location_name': LOCATIONS[idx_int]['location_name'],
                'confidence': round(float(predictions[idx_int]) * 100, 2)
            })

        return jsonify({
            'predicted_index': best_index,
            'ma_dia_diem': LOCATIONS[best_index]['ma_dia_diem'],
            'location_name': LOCATIONS[best_index]['location_name'],
            'confidence': best_confidence,
            'top_k': top_k
        }), 200

    except Exception as err:
        return jsonify({'error': f'Loi trong qua trinh xu ly anh: {str(err)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=False)
