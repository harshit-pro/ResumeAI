
<h1 align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/9421/9421360.png" width="80" alt="ResumeIQ Icon"/><br/>
  ✨ ResumeX — AI Resume Builder & Analyzer (Frontend)
</h1>

<p align="center">
  <b>🚀 AI-powered Resume Builder with ATS Analyzer, Live Preview, and PDF Export</b><br/>
  <i>Built using React + Vite + Tailwind CSS + DaisyUI + Framer Motion + @react-pdf/renderer</i>
</p>
<img width="9895" height="6137" alt="Resume Platform Full-Stack-2025-12-21-042927" src="https://github.com/user-attachments/assets/024fc475-ccc3-4b4f-a1e6-e73125670dbf" />

<p align="center">
  <a href="https://resumex1.netlify.app/" target="_blank">
    <img src="https://img.shields.io/badge/🔗 Visit_Project-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-Build-FB9E00?logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind-3.0-06B6D4?logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/DaisyUI-Components-EC4899?logo=daisyui&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-green"/>
</p>
---

## 🧠 Overview

**ResumeIQ** is an AI-powered resume builder that helps users generate professional resumes, analyze them against job descriptions, and export ATS-friendly PDFs — all inside a sleek glassmorphism UI.

✨ **Core Highlights:**
- 🧩 Guided form-based or AI-driven resume creation  
- 🪞 Live real-time preview  
- 🧠 ATS analyzer (JD match + missing keywords)  
- 📂 Manage all resumes in a modern dashboard  

<p align="center">
  <img src="https://github.com/midudev/coding-airbnb/blob/main/public/preview.gif" width="720" alt="App Preview" style="border-radius: 12px;"/>
</p>

---

## ✨ Features

✅ Modern **Glassmorphism UI** and responsive layout  
✅ Resume form with sections (Skills, Experience, Education, Projects)  
✅ 🆕 Add-new items appear on top for faster editing  
✅ 📄 PDF export using `@react-pdf/renderer`  
✅ 🤖 Resume Analyzer — upload PDF + paste JD → get ATS match score  
✅ 🔐 Auth-ready (Clerk-compatible) routes  
✅ 🧱 Centralized API clients, lazy routes, and global error boundary  

---

## 🛠️ Tech Stack

| Category | Technologies |
|:--|:--|
| ⚛️ Frontend | React 18, Vite |
| 🎨 Styling | Tailwind CSS, DaisyUI |
| 🌀 Animation | Framer Motion |
| 🧾 Forms | React Hook Form |
| 📤 PDF Generator | @react-pdf/renderer |
| 🌐 API | Axios, React Router |

---

## 🧭 Monorepo Context

📁 **Location:**
```

SpringAndSpringBoot/ResumeMaker/ResumeMaker/resume_frontend

````

⚙️ Backend: Spring Boot API + Analyzer Service (set via `.env`).

---

## 🔧 Environment Setup

Create a `.env` file at the root:

```bash
VITE_BACKEND_URL=http://localhost:8081        # Analyzer service
VITE_BACKEND_URL2=http://localhost:8080       # Main API
# Optional (if using Clerk):
# VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
````

💡 Tip: Also include a `.env.example` (no secrets) for contributors.

---

## ⚙️ Getting Started

### 🧩 Prerequisites

* macOS/Linux/Windows
* Node LTS (v18+)
* npm or yarn

### 🏃‍♂️ Run Locally

```bash
# 1️⃣ Install dependencies
npm install

# 2️⃣ Run dev server
npm run dev
```

🌐 Then open → [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Project Structure

```
src/
 ├── api/
 │   ├── analyzerClient.js        # Axios client (Analyzer API)
 │   └── httpClient.js            # Axios client (Main API)
 ├── components/
 │   ├── NavBar.jsx
 │   ├── Footer.jsx
 │   └── Resume.jsx               # HTML preview layout
 ├── pages/
 │   ├── LandingPage.jsx
 │   ├── GenerateResume.jsx       # Form UI + AI generator
 │   ├── ResumeAnalyzer.jsx       # PDF upload + JD analysis
 │   ├── Dashboards.jsx           # Manage resumes
 │   └── ResumeViewer.jsx         # PDF-like preview
 ├── context/
 │   └── AuthContext.jsx          # Auth or credits context
 ├── main.jsx                     # Router + ErrorBoundary
 └── index.css                    # Tailwind + custom glass classes
```

---

## 🧭 Routing Map

| Path               | Page                              |
| :----------------- | :-------------------------------- |
| `/`                | Landing Page                      |
| `/generate-resume` | Resume Builder (Form + AI Prompt) |
| `/resume-analyzer` | Analyzer Page                     |
| `/dashboard`       | Saved Resumes Dashboard           |
| `/resume/:id`      | Resume Viewer                     |

🔒 *Protected routes require auth (Clerk). Public routes can be configured as needed.*

---

## 🤖 Analyzer API Contract

**Endpoint**

```
POST {VITE_BACKEND_URL}/analyze
```

**Request**

* multipart/form-data
* Fields:

  * `jobDescription`: string
  * `resume`: PDF file

**Success Response**

```json
{
  "matchScore": 82,
  "missingKeywords": ["React", "Docker"],
  "profileSummary": "markdown text..."
}
```

**Error Response**

```json
{
  "error": "Value error",
  "details": "Gemini API error: 504 The request timed out. Please try again."
}
```

---

## 📄 Resume API Contract

Typical endpoints (adjust for your backend):

```
GET {VITE_BACKEND_URL2}/api/v1/resume/:id
GET {VITE_BACKEND_URL2}/api/v1/resume
POST / PUT / DELETE ...
```

**Sample Resume Object:**

```json
{
  "id": "abc123",
  "title": "SDE Resume",
  "personalInformation": {
    "fullName": "Jane Doe",
    "email": "jane@doe.dev",
    "phoneNumber": "+1 555-1234",
    "location": "Remote",
    "linkedin": "https://linkedin.com/in/janedoe",
    "gitHub": "https://github.com/janedoe",
    "portfolio": "https://janedoe.dev"
  },
  "summary": "Short professional summary...",
  "skills": [{ "title": "React", "level": "Advanced" }],
  "experience": [
    {
      "jobTitle": "Frontend Engineer",
      "company": "Acme",
      "location": "Remote",
      "duration": "2022–Present",
      "description": "Built scalable UIs with React..."
    }
  ],
  "education": [
    { "degree": "B.Tech", "university": "XYZ", "Marks": "8.5 CGPA", "graduationYear": "2024" }
  ],
  "projects": [
    {
      "title": "ResumeIQ",
      "description": "Resume builder with AI analyzer",
      "technologiesUsed": "React, Tailwind, Spring Boot",
      "githubLink": "https://github.com/...",
      "LiveLink": "https://..."
    }
  ]
}
```

---

## 💎 UX Highlights

* 🪞 **Glassmorphism styling** via Tailwind utilities (`.glass`, `.glass-card`)
* 📍 **Sticky action bar** for long forms
* 🧩 **Collapsible sections** to reduce clutter
* ⚡ Add-new items appear at the top
* 🌈 Clean empty states and contextual hints
* 🦾 Accessible footer and smooth navigation

---

## 🧱 Production Hardening

* ⚡ Centralized Axios clients with timeouts + error normalization
* 🧩 Lazy-loaded routes + global `ErrorBoundary`
* 🧹 Tailwind CSS + DaisyUI properly purged
* 🔒 Optional: disable sourcemaps in production
* 🧰 Brotli compression (via `vite-plugin-compression`)

---

## 🧩 Common Issues & Fixes

| Problem                  | Cause                      | Solution                                               |
| :----------------------- | :------------------------- | :----------------------------------------------------- |
| ❌ Analyzer Timeout (504) | Long API call              | Retry, extend backend timeout, ensure CORS             |
| 🔐 Routes not loading    | Missing Clerk key          | Add `VITE_CLERK_PUBLISHABLE_KEY` or disable protection |
| 📄 PDF Mismatch          | Unsupported React elements | Use primitives from `@react-pdf/renderer` only         |

---

## 🧰 Scripts

| Command           | Description              |
| :---------------- | :----------------------- |
| `npm run dev`     | Start development server |
| `npm run build`   | Create production build  |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint checks        |

---

## 🚀 Deployment

| Platform                 | Instructions                                                                     |
| :----------------------- | :------------------------------------------------------------------------------- |
| 🌩️ **Netlify / Vercel** | Add env vars (`VITE_BACKEND_URL`, etc.) → build `npm run build` → deploy `/dist` |
| 🧭 **Nginx / Apache**    | Serve static `dist/` → enable gzip or Brotli → proxy API routes                  |

---

## 🤝 Contributing

1. 🍴 Fork this repository
2. 🌿 Create a feature branch (`git checkout -b feature/your-feature`)
3. 🧹 Run `npm run lint` and `npm run build` before commit
4. 📬 Submit a PR

❌ Don’t commit `.env` files or real secrets.

---

## 📜 License

🪪 Licensed under the **MIT License**

---

<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/9421/9421302.png" width="80" alt="Footer Icon"/><br/>
  <i>Built with ❤️ using React + Spring Boot</i><br/>
  <a href="#">🔗 Back to Top</a>
</p>
