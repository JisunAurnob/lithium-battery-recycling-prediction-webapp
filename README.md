# Lithium-Ion Battery Recycling Prediction

A web application for estimating lithium-ion battery recycling outcomes. It combines a Next.js dashboard with a Flask API backed by trained machine-learning models.

The application currently provides predictions for:

- Recycling cost
- Material circularity
- Recycling profitability

## Technology stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, Axios, and Lucide React
- **Backend:** Python, Flask, Joblib, and scikit-learn-compatible models
- **Models:** Serialized Joblib models stored in `backend/`

## Project structure

```text
.
├── backend/
│   ├── app.py                 # Flask prediction API
│   ├── cost_m1.pkl            # Cost model
│   ├── circularity_m1.pkl     # Circularity model
│   └── profit_m1.pkl          # Profitability model
└── frontend/
    ├── public/                # Static assets
    ├── src/app/               # Next.js pages and styles
    ├── src/lib/               # Shared API client
    └── src/services/          # Prediction API functions
```

## Prerequisites

- Node.js 18.18 or later
- npm
- Python 3.9 or later
- pip

## Local setup

### 1. Start the backend

Create a Python virtual environment and install the runtime dependencies:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install flask flask-cors joblib scikit-learn
python app.py
```

Run the command from the `backend` directory so the API can locate the model files. The Flask server starts at `http://127.0.0.1:5000` by default.

### 2. Configure and start the frontend

In a second terminal:

```bash
cd frontend
printf 'NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5000\n' > .env.local
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

## API usage

The backend exposes one prediction route for each model:

```http
POST /predict/{model_name}
Content-Type: application/json
```

Supported model names are `cost`, `circularity`, and `profit`.

Example request:

```bash
curl -X POST http://127.0.0.1:5000/predict/profit \
  -H 'Content-Type: application/json' \
  -d '{"features":[2024,100,50,1,0,0,1,0,1,0,0,1,0]}'
```

Successful responses use this shape:

```json
{
  "prediction": [123.45]
}
```

The feature count and order must match the model selected. The frontend forms arrange the values in the order expected by their corresponding models.

## Available frontend commands

Run these commands from `frontend/`:

```bash
npm run dev    # Start the development server
npm run build  # Create a production build
npm run start  # Run the production build
npm run lint   # Run lint checks
```

## Notes

- Do not commit `.env` files or virtual environments.
- The `.pkl` model files are required at runtime but are excluded from Git. Obtain or generate them locally and place them in `backend/`.
- Only load model files from trusted sources; serialized Python models can execute code while loading.
