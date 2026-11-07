import os
from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


def load_model(env_name):
    """Load a model from a path relative to the backend directory."""
    configured_path = os.getenv(env_name)
    if not configured_path:
        raise RuntimeError(f"Missing required environment variable: {env_name}")

    # Both "pkl/model.pkl" and "/pkl/model.pkl" are backend-relative.
    relative_path = configured_path.lstrip("/\\")
    model_path = BASE_DIR / relative_path

    if not model_path.is_file():
        raise FileNotFoundError(f"Model file not found: {model_path}")

    return joblib.load(model_path)

# Load models once and store them in a dictionary
models = {
    "profit": load_model("PROFIT_MODEL_PATH"),
    "cost": load_model("COST_MODEL_PATH"),
    "circularity": load_model("CIRCULARITY_MODEL_PATH")
}

MODEL_FEATURE_COUNTS = {
    model_name: model.n_features_in_ for model_name, model in models.items()
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

        expected_count = MODEL_FEATURE_COUNTS[model_name]
        if len(features) != expected_count:
            return jsonify({
                "error": (
                    f"{model_name} expects {expected_count} features, "
                    f"but received {len(features)}"
                )
            }), 400

        if not all(isinstance(value, (int, float)) for value in features):
            return jsonify({"error": "Every feature must be numeric"}), 400

        prediction = models[model_name].predict([features])
        return jsonify({"prediction": prediction.tolist()})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict/<model_name>', methods=['POST'])
def predict_route(model_name):
    """Unified route to handle predictions for all models."""
    data = request.get_json(silent=True)
    if not data or "features" not in data:
        return jsonify({"error": "Missing 'features' in request"}), 400

    return predict(model_name, data["features"])

if __name__ == '__main__':
    app.run(debug=True, threaded=True)  # Multi-threaded for better performance
