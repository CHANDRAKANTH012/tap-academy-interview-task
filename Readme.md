# Employee Attendance System — README

## Deliverables (included)
1. GitHub repository with clean code  
2. README (this file) — setup, run, env, screenshots placeholders  
3. `.env.example` (see below)  
4. Working application (backend + frontend) — run instructions below  
5. Seed data (sample users + attendance) — seed command below

---

## Quick setup (one-shot)

```bash
# clone repo
git clone <your-repo-url>
cd <repo-folder>

# backend
cd backend
npm install
cp .env.example .env        # edit .env values (see "Environment variables" below)
npm run seed                # creates manager + employees + sample attendance
npm run dev                 # starts backend on http://localhost:5000

# open a new terminal for frontend
cd ../frontend
npm install
# ensure Tailwind Vite plugin is installed (project package.json includes it)
npm run dev                 # starts frontend (Vite) — terminal shows URL, e.g. http://localhost:5173

```
How to run (details)

Backend

cd backend

npm install

Copy env and edit: cp .env.example .env → set MONGO_URI and JWT_SECRET

Seed database: npm run seed

Start dev server: npm run dev

Default: http://localhost:5000

Frontend

cd frontend

npm install

(Optional) create frontend/.env:

VITE_API_URL=http://localhost:5000/api


Start Vite dev server: npm run dev

Vite prints the URL (commonly http://localhost:5173)

Environment variables
backend/.env.example
PORT=5000
# Local Mongo:
MONGO_URI=mongodb://localhost:27017/attendance_db
# Or MongoDB Atlas (example):
# MONGO_URI="mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.example.mongodb.net/attendance_db?retryWrites=true&w=majority&appName=Cluster0"

JWT_SECRET=replace_with_a_strong_secret
TOKEN_EXPIRES_IN=7d
LATE_THRESHOLD_HOUR=9

frontend/.env (optional)
VITE_API_URL=http://localhost:5000/api


Notes

Replace <USERNAME> and <PASSWORD> when using Atlas; URL-encode special characters in the password.

Do not commit .env to Git. Commit only .env.example.

Seed data (what the seed script creates)

Run in backend/:

npm run seed


Seed creates:

Manager

Email: manager@example.com

Password: password123

Employees

emp1@example.com … emp5@example.com (password: password123)

7 days of sample attendance entries (randomized check-in/out times) for each employee


<img width="1917" height="867" alt="image" src="https://github.com/user-attachments/assets/4383c81c-d85b-4b98-81eb-3c47d73a1df2" />
<img width="1902" height="869" alt="image" src="https://github.com/user-attachments/assets/c78ac98f-a74c-4d40-9f7e-b9ea7e808481" />
<img width="1899" height="869" alt="image" src="https://github.com/user-attachments/assets/bc2599a0-c9c9-45da-9a1e-f1b369860fd5" />
<img width="1898" height="859" alt="image" src="https://github.com/user-attachments/assets/606379d0-3807-4a9b-968d-fff34d459280" />
<img width="1898" height="867" alt="image" src="https://github.com/user-attachments/assets/cd67d411-f403-4a45-aa4b-e0b5a018c0f2" />
<img width="1900" height="863" alt="image" src="https://github.com/user-attachments/assets/37ddea95-06b2-430c-b2f8-7e4f544ff321" />

<img width="1919" height="861" alt="image" src="https://github.com/user-attachments/assets/08aa9e1b-1cc9-4642-9d50-ffdc4c2c3519" />

