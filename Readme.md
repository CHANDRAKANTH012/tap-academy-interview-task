# Employee Attendance System

A MERN stack Employee Attendance System with role-based auth (manager / employee), attendance check-in/out, history, manager dashboards, and CSV export. Frontend built with Vite + React + Redux Toolkit + Tailwind (Vite plugin). Backend built with Node.js + Express + MongoDB (Mongoose).

---

## Contents

* Project overview
* Quick start (one-shot)
* Backend: install, env, seed, run
* Frontend: install, env, run
* Seeded accounts
* API endpoints (summary)
* Models (summary)
* CSV export
* Dependencies
* Project structure
* Screenshots (placeholders)
* Troubleshooting
* Deliverables checklist

---

## Quick start (one-shot)

```bash
# clone repo
git clone <your-repo-url>
cd <repo-folder>

# backend
cd backend
npm install
cp .env.example .env     # edit .env (MONGO_URI, JWT_SECRET)
npm run seed
npm run dev

# frontend (new terminal)
cd ../frontend
npm install
# ensure Tailwind + plugin installed (see README for exact dev deps)
npm run dev
```

Open frontend at the Vite URL shown (usually `http://localhost:5173`).

---

## Backend — setup & run

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and edit:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/attendance_db
JWT_SECRET=replace_with_strong_secret
TOKEN_EXPIRES_IN=7d
LATE_THRESHOLD_HOUR=9
```

> For Atlas: `MONGO_URI="mongodb+srv://USERNAME:PASSWORD@cluster0.../attendance_db?retryWrites=true&w=majority&appName=Cluster0"` — URL-encode password and whitelist IP (or 0.0.0.0/0 for dev).

4. Seed DB:

```bash
npm run seed
```

Seed creates:

* `manager@example.com` / `password123` (manager)
* `emp1@example.com` ... `emp5@example.com` / `password123` (employees)
* 7 days of attendance data

5. Start server:

```bash
npm run dev
```

Server default: `http://localhost:5000`

---

## Frontend — setup & run

1. `cd frontend`
2. `npm install`
3. (Optional) create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

4. Tailwind + Vite plugin: ensure dev deps installed:

```bash
npm install -D tailwindcss @tailwindcss/vite @vitejs/plugin-react postcss autoprefixer
```

5. Start dev server:

```bash
npm run dev
```

Open the URL printed by Vite (commonly `http://localhost:5173`).

---

## Seeded accounts (for testing)

**Manager**

* Email: `manager@example.com`
* Password: `password123`

**Employees**

* `emp1@example.com` ... `emp5@example.com`
* Password: `password123`

---

## API endpoints (summary)

**Auth**

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET  /api/auth/me` (auth)

**Attendance**

* `POST /api/attendance/checkin` (auth)
* `POST /api/attendance/checkout` (auth)
* `GET  /api/attendance/my-history` (auth)
* `GET  /api/attendance/all` (manager)
* `GET  /api/attendance/export?start=YYYY-MM-DD&end=YYYY-MM-DD&employeeId=EMP001` (manager)

**Dashboards**

* `GET /api/dashboard/employee` (auth)
* `GET /api/dashboard/manager` (manager)

---

## Data models (brief)

**User**

* `name`, `email`, `password`, `role` (`employee`|`manager`), `employeeId`, `department`, `createdAt`

**Attendance**

* `userId`, `date` (YYYY-MM-DD), `checkInTime`, `checkOutTime`, `status` (`present`|`late`|`absent`|`half-day`), `totalHours`, timestamps

---

## CSV export

Manager endpoint:

```
GET /api/attendance/export?start=YYYY-MM-DD&end=YYYY-MM-DD&employeeId=EMP001
```

Returns `Content-Disposition: attachment; filename=attendance_export.csv` and CSV content.

---

## Dependencies (top-level)

**Backend**

* `express`, `mongoose`, `cors`, `dotenv`, `bcryptjs`, `jsonwebtoken`, `csv-writer`
* dev: `nodemon`

**Frontend**

* `react`, `react-dom`, `react-router-dom`, `@reduxjs/toolkit`, `react-redux`, `axios`
* `tailwindcss`, `@tailwindcss/vite`, `@vitejs/plugin-react`
* `@fontsource/inter` (optional)

Install lists are included in each `package.json`.

---

## Project structure (reference)

```
root/
├─ backend/
│  ├─ package.json
│  ├─ server.js
│  ├─ config/db.js
│  ├─ models/{User.js,Attendance.js}
│  ├─ controllers/
│  ├─ routes/
│  ├─ middleware/
│  └─ seed/seed.js
├─ frontend/
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ tailwind.config.js
│  └─ src/
│     ├─ main.jsx
│     ├─ App.jsx
│     ├─ api/api.js
│     ├─ store/
│     ├─ components/
│     └─ pages/
├─ .env.example
└─ README.md
```

---

## Screenshots

Place screenshots under `/docs/screenshots/` and reference them in README. Example filenames:

* `manager-dashboard.png`
* `employee-dashboard.png`
* `attendance-mark.png`
* `attendance-history.png`

Markdown example to embed:

```md
![Manager Dashboard](docs/screenshots/manager-dashboard.png)
```

---

## Troubleshooting (common issues)

* **ERR_CONNECTION_REFUSED**: backend not running or `VITE_API_URL` mismatched.
* **bad auth** (Atlas): check username/password, URL-encode special chars, whitelist IP.
* **Mongoose errors** about `useNewUrlParser`: ensure `config/db.js` uses `mongoose.connect(mongoUri)` (no legacy options).
* **Invalid JSON parse** in frontend localStorage: delete `localStorage.user` or use safe parsing in `userSlice`.

If an error appears, paste the terminal output here and I’ll diagnose the exact one-line fix.

