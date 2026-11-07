# Lithium-Ion Battery Recycling Prediction

A web application for estimating lithium-ion battery recycling outcomes. It combines a Next.js dashboard with a Flask API backed by trained machine-learning models.

The application currently provides predictions for:

- Recycling cost
- Material circularity
- Recycling profitability

## Technology stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, Axios, and Lucide React
- **Backend:** Python, Flask, Joblib, and scikit-learn-compatible models
- **Models:** Serialized Joblib models stored locally in `backend/pkl/`

## Project structure

```text
.
├── backend/
│   ├── app.py                 # Flask prediction API
│   ├── .env.example           # Backend model-path template
│   └── pkl/                   # Local model files (ignored by Git)
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
pip install flask flask-cors joblib python-dotenv scikit-learn
cp .env.example .env
python app.py
```

Place `Cost_web_latest.pkl`, `Circularity_web_latest.pkl`, and `Profit_latest.pkl` in `backend/pkl/`. Set each filename in `backend/.env`. Paths beginning with `/pkl/` are resolved relative to the `backend` directory, so `/pkl/Cost_web_latest.pkl` refers to `backend/pkl/Cost_web_latest.pkl`. The Flask server starts at `http://127.0.0.1:5000` by default.

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
  -d '{"features":[2024,1,0,1,0,1,0,0,0,0,0,0]}'
```

Successful responses use this shape:

```json
{
  "prediction": [123.45]
}
```

The feature count and order must match the selected model: cost expects 13 values, circularity expects 14, and profit expects 12. The frontend presents readable choices and arranges their encoded values in the exact order expected by each model.

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
- The `backend/pkl/` directory and all `.pkl` model files are excluded from Git.
- Only load model files from trusted sources; serialized Python models can execute code while loading.
