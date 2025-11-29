Employee Attendance System

A MERN Stack Web Application

A role-based employee attendance tracking system built using the MERN stack (MongoDB, Express, React, Node.js) with authentication, attendance check-in/out, dashboards, CSV export, and responsive UI built with Vite + React + TailwindCSS.

This project includes both Manager and Employee views, with seeded sample data for immediate testing.

🚀 Features
👨‍💼 Manager

View all employee attendance

Dashboard metrics (present, absent, late, total employees)

Team attendance overview

Export attendance report as CSV

Calendar-based attendance overview

👷 Employee

Login / Register

Dashboard (hours today, this week, daily progress)

Check-in / Check-out

View complete attendance history

🛠 Core System

JWT authentication

Role-based authorization (manager / employee)

MongoDB models (Users, Attendance)

Seed data (manager + employees + attendance)

Responsive UI using TailwindCSS

Clean folder architecture

📂 Project Structure
root/
├─ backend/
│  ├─ server.js
│  ├─ package.json
│  ├─ config/
│  ├─ controllers/
│  ├─ routes/
│  ├─ models/
│  ├─ middleware/
│  └─ seed/
├─ frontend/
│  ├─ vite.config.js
│  ├─ tailwind.config.js
│  ├─ package.json
│  └─ src/
│     ├─ App.jsx
│     ├─ main.jsx
│     ├─ api/
│     ├─ store/
│     ├─ components/
│     └─ pages/
├─ .env.example
└─ README.md


🧪 Tech Stack
Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

bcrypt.js

CSV export (csv-writer)

Frontend

React (Vite)

Redux Toolkit

React Router

Tailwind CSS (new Vite plugin integration)

Axios

⚙️ Installation & Setup

Clone the repository:

git clone <your-repo-url>
cd <repo-folder>

🛠 Backend Setup (/backend)
1. Install dependencies
cd backend
npm install

2. Create .env

Copy the example file:

cp .env.example .env


Fill in:

PORT=5000
MONGO_URI=mongodb://localhost:27017/attendance_db
JWT_SECRET=replace_with_strong_secret
TOKEN_EXPIRES_IN=7d
LATE_THRESHOLD_HOUR=9

3. Seed the database

This inserts:

1 manager

5 employees

7 days attendance

npm run seed

4. Start the backend
npm run dev


Backend runs at:

http://localhost:5000

💻 Frontend Setup (/frontend)
1. Install dependencies
cd frontend
npm install

2. Tailwind Vite Integration (already included)

Required dev deps:

npm install -D tailwindcss @tailwindcss/vite @vitejs/plugin-react postcss autoprefixer

3. Optional .env file
VITE_API_URL=http://localhost:5000/api

4. Run frontend
npm run dev


App opens at:

http://localhost:5173
or http://localhost:3000

🔑 Seeded Accounts
Manager
Email: manager@example.com
Password: password123

Employees
emp1@example.com / password123
emp2@example.com / password123
emp3@example.com / password123
emp4@example.com / password123
emp5@example.com / password123

📡 API Endpoints Overview
Auth
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

Attendance
POST /api/attendance/checkin
POST /api/attendance/checkout
GET  /api/attendance/my-history
GET  /api/attendance/all        (manager-only)
GET  /api/attendance/export     (CSV, manager-only)

Dashboards
GET /api/dashboard/employee
GET /api/dashboard/manager

🗄 Database Models
User

name

email

password

role (manager / employee)

employeeId

createdAt

Attendance

userId

date

checkInTime

checkOutTime

status (Present, Absent, Late)

totalHours

📤 CSV Export

Managers can export attendance using:

GET /api/attendance/export?start=YYYY-MM-DD&end=YYYY-MM-DD&employeeId=EMP001


Returns:

Content-Type: text/csv

List of attendance rows

🖼 Screenshots

Add screenshots inside:

/docs/screenshots/


Then reference here, example:

![Manager Dashboard](docs/screenshots/manager-dashboard.png)

📦 Dependencies List
Backend
express
mongoose
cors
dotenv
bcryptjs
jsonwebtoken
csv-writer
nodemon (dev)

Frontend
react
react-dom
react-router-dom
@reduxjs/toolkit
react-redux
axios
tailwindcss
@tailwindcss/vite
@vitejs/plugin-react
@fontsource/inter

🛡 Security Notes

Never commit .env

Use strong JWT_SECRET

If using MongoDB Atlas, whitelist IP + URL-encode password

🚀 Running Full System

Backend:

cd backend
npm run dev


Frontend:

cd frontend
npm run dev


Login using seeded accounts and test attendance flows.
