

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

MODEL_PATH = "pill_model.pkl"
model_data = joblib.load(MODEL_PATH)

required_keys = ["model", "scaler", "label_encoder", "pill_data"]
missing_keys = [key for key in required_keys if key not in model_data]

if missing_keys:
    raise KeyError(f"Missing {missing_keys} in pill_model.pkl. Retrain and save correctly.")

model = model_data["model"]
scaler = model_data["scaler"]
label_encoder = model_data["label_encoder"]  
pill_data = model_data["pill_data"] 


updated_pill_data = {
    "Cetirizine Hydrochloride": {
        "Imprint": "4H2",
        "Strength": "10 mg",
        "Color": "White",
        "Shape": "Oval",
        "Image": "/mnt/data/assets/New folder/cetirizine.jpeg",
        "Availability": "Over the Counter",
        "Drug Class": "Antihistamine",
        "Uses": "Allergies, Hay Fever",
        "Labeler": "Various"
    },
    "Panadol": {
        "Imprint": "P",
        "Strength": "500 mg",
        "Color": "White",
        "Shape": "Oval",
        "Image": "/mnt/data/assets/New folder/panadol.jpg",
        "Availability": "Over the Counter",
        "Drug Class": "Analgesic",
        "Uses": "Pain Relief, Fever",
        "Labeler": "GlaxoSmithKline"
    },
    "Clonazepam": {
        "Imprint": "1 2",
        "Strength": "0.5 mg",
        "Color": "Orange",
        "Shape": "Round",
        "Image": "/mnt/data/assets/New folder/clonazepam.jpeg",
        "Availability": "Prescription Only",
        "Drug Class": "Benzodiazepine",
        "Uses": "Seizures, Anxiety Disorders",
        "Labeler": "Teva Pharmaceuticals"
    },
    "Loratadine": {
        "Imprint": "L612",
        "Strength": "10 mg",
        "Color": "White",
        "Shape": "Oval",
        "Image": "/mnt/data/assets/New folder/loratadine.jpg",
        "Availability": "Over the Counter",
        "Drug Class": "Antihistamine",
        "Uses": "Allergies, Hives",
        "Labeler": "Various"
    },
    "Flurazepam Hydrochloride": {
        "Imprint": "West-ward Flurazepam 15",
        "Strength": "15 mg",
        "Color": "Blue/White",
        "Shape": "Capsule",
        "Image": "/mnt/data/assets/New folder/flurazepam.jpg",
        "Availability": "Prescription Only",
        "Drug Class": "Benzodiazepine",
        "Uses": "Insomnia",
        "Labeler": "West-Ward Pharmaceuticals"
    }
}

pill_data.update(updated_pill_data)

print("✅ Model, Scaler, and Label Encoder loaded successfully.")
print(pill_data)  


def extract_features(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return None
    img = cv2.resize(img, (100, 100))
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    avg_color = np.mean(img, axis=(0, 1)) 

    _, thresh = cv2.threshold(img_gray, 120, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    largest_contour = max(contours, key=cv2.contourArea, default=None)

    if largest_contour is not None:
        x, y, w, h = cv2.boundingRect(largest_contour)
        aspect_ratio = w / float(h)
        area = cv2.contourArea(largest_contour)
        perimeter = cv2.arcLength(largest_contour, True)

        circularity = 4 * np.pi * (area / (perimeter ** 2)) if perimeter != 0 else 0
        bounding_box_area = w * h
        solidity = area / bounding_box_area if bounding_box_area != 0 else 0
    else:
        aspect_ratio, area, perimeter, circularity, solidity = 0, 0, 0, 0, 0

    return [avg_color[0], avg_color[1], avg_color[2], aspect_ratio, area, perimeter, circularity, solidity, bounding_box_area]  # ✅ 9 features


@app.route('/identify_pill', methods=['POST'])
def identify_pill():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    file_path = os.path.join("uploads", file.filename)
    os.makedirs("uploads", exist_ok=True)
    file.save(file_path)

    features = extract_features(file_path)
    if features is None:
        return jsonify({"error": "Invalid image"}), 400
    
    features_scaled = scaler.transform([features])
    
    prediction = model.predict(features_scaled)[0]  
    prediction_label = label_encoder.inverse_transform([prediction])[0] 
    prediction_label = prediction_label.strip().lower()

    normalized_pill_data = {name.lower(): details for name, details in pill_data.items()}

    if prediction_label in normalized_pill_data:
        result = {prediction_label: normalized_pill_data[prediction_label]}
        return jsonify({"success": True, "data": result})

    return jsonify({"error": f"Pill '{prediction_label}' not found in database"}), 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
