from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

# Load models once and store them in a dictionary
models = {
    "profit": joblib.load("profit_m1.pkl"),
    "cost": joblib.load("cost_m1.pkl"),
    "circularity": joblib.load("circularity_m1.pkl")
}

app = Flask(__name__)
CORS(
    app,
    resources={r"/predict/*": {"origins": "http://localhost:3000"}},
)

def predict(model_name, features):
    """Helper function to make predictions using the selected model."""
    try:
        if model_name not in models:
            return jsonify({"error": "Invalid model name"}), 400

        if not isinstance(features, list):
            return jsonify({"error": "Features should be a list"}), 400

        prediction = models[model_name].predict([features])
        return jsonify({"prediction": prediction.tolist()})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict/<model_name>', methods=['POST'])
def predict_route(model_name):
    """Unified route to handle predictions for all models."""
    data = request.get_json()
    if "features" not in data:
        return jsonify({"error": "Missing 'features' in request"}), 400

    return predict(model_name, data["features"])

if __name__ == '__main__':
    app.run(debug=True, threaded=True)  # Multi-threaded for better performance
