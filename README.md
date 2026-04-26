# Car Dealership Management System (AutoPulse)

Monorepo containing:
- **BACKEND**: Node.js + Express + MongoDB API
- **frontend**: React (Create React App)
- **ai-microservice**: FastAPI microservice for vehicle price prediction

## Repository Structure

- `BACKEND/` — REST API, auth, appointments, uploads, reminders
- `frontend/` — React web app
- `ai-microservice/` — ML training pipeline + prediction API
- `docs/` — feature/setup documentation

## Prerequisites

- **Node.js** (recommended: current LTS)
- **npm** (bundled with Node)
- **Python** 3.10+ (for `ai-microservice`)
- **MongoDB** (local or hosted)

Default local ports:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8070`
- AI microservice: `http://localhost:8000`

## Quick Start (Development)

### 1) Backend API

```bash
cd BACKEND
npm install
```

Create `BACKEND/.env`:

```env
# Server
PORT=8070

# Database (use either)
MONGODB_URI=mongodb://127.0.0.1:27017/car_dealership
# MONGO_URI=mongodb://127.0.0.1:27017/car_dealership

# Auth
JWT_SECRET=replace-with-a-long-random-secret

# Email (required for password reset + appointment reminders)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000

# Optional: force absolute URLs for vehicle images
# IMAGE_BASE_URL=http://localhost:8070
```

Run the API:

```bash
npm run dev
```

Optional seed scripts:

```bash
# Creates admin user: admin@autopulse.com / admin123
npm run seed:admin

# Seeds holidays (Poya days) used by appointment validation
npm run seed:holidays

# Optional migration helper
npm run migrate:manager-to-staff
```

Notes:
- Uploads are served from `BACKEND/uploads` at `/uploads/*`.
- The appointment reminder scheduler starts automatically when the server starts.

### 2) Frontend (React)

```bash
cd frontend
npm install
npm start
```

The UI will be available at `http://localhost:3000`.

### 3) AI Microservice (FastAPI)

Install dependencies:

```bash
cd ai-microservice
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Train the model (creates `ai-microservice/model/autopulse_pipeline.pkl`):

```bash
python train_pipeline.py
```

Start the API:

```bash
python main.py
```

Test the prediction endpoint:

```bash
python test.py
```

Endpoint:
- `POST http://localhost:8000/predict`

## Key Docs

- Appointment system rules and setup: [docs/APPOINTMENT_SYSTEM_SETUP.md](docs/APPOINTMENT_SYSTEM_SETUP.md)
- Email reminders + Gmail app password setup: [docs/EMAIL_SETUP_GUIDE.md](docs/EMAIL_SETUP_GUIDE.md)
- Implementation summary: [docs/IMPLEMENTATION_COMPLETE.md](docs/IMPLEMENTATION_COMPLETE.md)

## Common Commands

Backend:
- `npm run dev` — start API with nodemon
- `npm run seed:admin` — create default admin user
- `npm run seed:holidays` — seed holidays

Frontend:
- `npm start` — start dev server
- `npm test` — run tests
- `npm run build` — build production bundle

AI microservice:
- `python train_pipeline.py` — train + save model
- `python main.py` — start FastAPI server

## Project Standards (House Rules)

- **Environment variables**: never commit real secrets; keep secrets in `BACKEND/.env` (already gitignored).
- **API conventions**: add new routes under `BACKEND/routes`, models under `BACKEND/models`, and shared logic under `BACKEND/utils`.
- **Error handling**: backend errors should flow through `BACKEND/middleware/errorHandler.js`.
- **Auth**: protected routes should use `BACKEND/middleware/auth.middleware.js` and role checks via `BACKEND/middleware/authorize.js`.
- **Uploads**: store vehicle images under `BACKEND/uploads/vehicles` and return URLs that work behind proxies (see `IMAGE_BASE_URL`).
- **Data & models**: AI training data (`ai-microservice/data/*.csv`) and trained model artifacts (`ai-microservice/model/*.pkl`) are intentionally not tracked in git.

## Troubleshooting

- **Backend won’t start (MongoDB)**: ensure `MONGODB_URI`/`MONGO_URI` is set in `BACKEND/.env`.
- **JWT errors**: set `JWT_SECRET` in `BACKEND/.env`.
- **Emails not sending**: follow [docs/EMAIL_SETUP_GUIDE.md](docs/EMAIL_SETUP_GUIDE.md) and verify `EMAIL_USER`/`EMAIL_PASS`.
- **AI `/predict` returns 503**: train the model first (the service loads `model/autopulse_pipeline.pkl` on startup).
