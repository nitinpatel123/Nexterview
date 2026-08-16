# Nexterview

🚀 **Live Demo:** https://nexterview-1.onrender.com

# Nexterview AI — Smart Placement & Career Portal
A full-stack, AI-powered placement platform built for students and colleges — combining resume building, ATS analysis, AI mock interviews, aptitude/coding tests, and placement analytics in one product.

## 🚀 Features

### 👨‍🎓 Student
- Signup/Login (JWT auth) + Forgot/Reset Password (email-based, with local dev fallback)
- Profile (view/edit + certificate upload)
- Resume Builder + PDF Download
- AI Resume Analysis (ATS Score)
- AI Skill Gap Analysis
- AI Career Roadmap Generator
- AI Mock Interview — Text **and Voice** (Web Speech API)
- Aptitude & Coding Tests (timed, auto-scored, real code execution via Judge0)
- ATS Resume Checker — upload any PDF directly for instant AI ATS scoring
- Job Recommendations — ranked by skill match against your profile
- Resume vs Job Description Match — see your match % against a specific job
- AI Career Chatbot — 24×7 conversational career guidance
- AI Cover Letter Generator
- AI LinkedIn Profile Suggestions
- Progress Dashboard — ATS Score, Placement Readiness Score, Skill Graph (radar chart), Weekly Progress (line chart)

### 🏢 Admin
- Student Management (view/remove)
- Company Management (add/edit/remove companies)
- Job Posting & Management
- Test Creation (dynamic MCQ/coding builder)
- Result Analysis (per-test stats, top performers)
- Placement Analytics Dashboard

### 🤖 AI-Powered (via Groq API)
- Resume ATS Review
- Interview Question Generation + Answer Evaluation (Technical/HR/Behavioral)
- Career Roadmap Generation
- Skill Gap Analysis
- Cover Letter Generator
- LinkedIn Profile Suggestions

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT |
| AI | Groq API (Llama 3.3 70B) |
| File Storage | Cloudinary |
| PDF Generation | PDFKit |
| Deployment | Vercel (frontend) + Render (backend) |

## 📁 Project Structure

```
nexterview/
├── client/        # React frontend
├── server/        # Node/Express backend
└── docs/
    └── API-documentation.md   # Full endpoint reference
```

## 🛠️ Setup Instructions

### 1. Clone & Install

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Environment Variables

**server/.env** (copy from `.env.example`):
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

**client/.env** (copy from `.env.example`):
```
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ Never commit `.env` files or share API keys/tokens publicly. Rotate any keys immediately if accidentally exposed.

### 3. Run Locally

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

### 4. Create Your First Admin Account

Public signup always creates **student** accounts (for security). To create your first admin:

```bash
cd server
npm run seed:admin
```

It'll ask for name, email, and password interactively, then create (or upgrade an existing user to) an admin account. Login with those credentials to access `/admin/dashboard`.

### 5. Get API Keys
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Groq API Key**: https://console.groq.com/keys (free tier available)
- **Cloudinary**: https://cloudinary.com

## 📦 Deployment

- **Frontend (Vercel)**: Import `client/` folder as a project, set `VITE_API_URL` to your deployed backend URL.
- **Backend (Render)**: Import `server/` folder as a Web Service, add all `.env` variables in Render's Environment settings, set start command to `npm start`.

## 🗺️ Roadmap / Next Steps (optional future upgrades)

- [ ] Coding test with live code execution/auto-judging (Judge0 API) — currently coding answers are text-compared, not executed
- [ ] Email notifications (test reminders, application status)
- [ ] LinkedIn OAuth integration (currently AI just gives text suggestions)
- [ ] Company-side dashboard for shortlisting candidates directly
- [ ] Voice mock interview works via browser Web Speech API — only supported in Chrome/Edge, not Firefox/Safari

## ⚠️ Known Limitations

- Weekly Progress chart needs at least one test attempt to show data.
- Placement Readiness Score is a custom weighted formula (40% ATS + 35% test avg + 15% certificates + 10% resume completeness) — tune the weights in `server/controllers/student.controller.js` as needed.
- Coding questions run through **Judge0** (real code execution). By default this app expects a **self-hosted Judge0 instance** (free, via Docker) at `http://localhost:2358` — see setup steps below. You can optionally switch to RapidAPI's hosted Judge0 CE (paid, per-use) by setting `JUDGE0_API_KEY`.

### Setting up self-hosted Judge0 (free, via Docker)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and make sure it's running.
2. Download the Judge0 release zip: [github.com/judge0/judge0/releases](https://github.com/judge0/judge0/releases) — grab `judge0-vX.X.X.zip` from the latest release and extract it.
3. Open a terminal in that extracted folder and run:
   ```bash
   docker-compose up -d db redis
   ```
   Wait about 10 seconds for the database to initialize, then:
   ```bash
   docker-compose up -d
   ```
4. Verify it's running by visiting `http://localhost:2358/about` in your browser — you should see a JSON response with version info.
5. Leave `JUDGE0_API_KEY` blank in `server/.env` (it defaults to using this self-hosted instance).
6. Make sure Docker Desktop is running whenever you use the coding test feature — if it's not, you'll see a "Could not reach Judge0" error.

## 📄 License

This project is for educational/portfolio purposes.
