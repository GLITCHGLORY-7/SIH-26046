# PS SIH26046 — AIIA Clinical Trials Management System (CTMS)

**Organization:** Ministry of Ayush, Government of India  
**Lead Institution:** All India Institute of Ayurveda (AIIA), New Delhi  
**Problem Statement:** PS SIH26046 — Real-time, cloud-based, GCP-compliant Clinical Trial Management System (CTMS) for Ayurveda research with role-based access control, 21 CFR Part 11 cryptographic digital signatures, and immutable audit logging.

---

## 🌟 Core System Differentiators

1. **🌿 NAMASTE & WHO ICD-11 Dual-Coding Standard**:
   - Standardized Ayurvedic morbidities (*Amavata*, *Madhumeha*, *Sandhigata Vata*) cross-walked to WHO ICD-11 Traditional Medicine Chapter 2 (TM2) with classical formulation registries (Shallaki, Dashamoola, Ashwagandha).

2. **🔏 21 CFR Part 11 Cryptographic E-Signatures**:
   - Dual-credential signing ceremonies generating verifiable SHA-256 digital certificates (`SIG-SHA256-...`) for ethics clearances, protocol versions, and regulatory sign-offs.

3. **⚡ 24-Hour Expedited SAE Notice (CDSCO NDCTR 2019 Rule 42)**:
   - Automated statutory countdown clocks and 1-click electronic dispatch of Serious Adverse Event dossiers to the Drugs Controller General of India (DCGI) and Institutional Ethics Committee.

4. **🌐 HL7 FHIR R4 & CDISC SDTM Interoperability**:
   - One-click research exports in HL7 FHIR R4 (`Patient`, `Encounter`, `Condition`, `Medication`, `Observation`, `Consent`) and CDISC SDTM (`DM`, `SV`, `AE`, `TS`, `TV`).

5. **📄 HTML-to-Canvas PDF & JSON Export Engine**:
   - Client-side multi-page A4 PDF generation via `html2canvas` and `jsPDF`, with instant JSON downloads across clinical trial dossiers, CDISC datasets, and FHIR resources.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, React Router v7, Axios, Lucide Icons, html2canvas, jsPDF |
| **Backend** | Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2.0, ReportLab, Alembic |
| **Database** | SQLite (Zero-config local fallback) / PostgreSQL (Production) |
| **Standards** | US FDA 21 CFR Part 11, CDSCO NDCTR 2019, ICH-GCP E6(R2), HL7 FHIR R4, CDISC SDTM |

---

## 🚀 Pushing to GitHub

Follow these steps to push the project to your GitHub account:

```bash
# 1. Initialize git (already initialized in this repository)
git init -b main

# 2. Stage all clean source files
git add .

# 3. Create the initial commit
git commit -m "feat: AIIA CTMS production-ready prototype with 21 CFR Part 11 and Vercel support"

# 4. Link your remote GitHub repository (replace with your repo URL):
# Create a new repository on https://github.com/new (do NOT check 'Initialize with README')
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 5. Push to GitHub
git push -u origin main
```

---

## ☁️ Hosting on Vercel

This repository includes pre-configured `vercel.json` files for zero-config deployment on Vercel.

### Option A: 1-Click Monorepo Deployment (Recommended)

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** ➔ **"Project"** and import your GitHub repository.
3. In the project configuration screen:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `./` (leave as default)
   * The root `vercel.json` automatically sets:
     * Build Command: `cd frontend && npm install && npm run build`
     * Output Directory: `frontend/dist`
     * Rewrites: `[ { "source": "/(.*)", "destination": "/index.html" } ]` (enables React Router SPA navigation)
4. (Optional) In **Environment Variables**, add:
   * `VITE_API_BASE_URL`: `https://your-deployed-backend-url/api/v1` (if your backend is hosted separately on Render, Railway, Fly.io, etc.)
5. Click **Deploy**. Your dashboard will be live on `https://<your-project>.vercel.app`.

### Option B: Frontend Root Directory Deployment

1. On Vercel, when importing the repository, set **Root Directory** to `frontend`.
2. Vercel will automatically detect `frontend/vercel.json`, `package.json`, and Vite settings.
3. Click **Deploy**.

---

## 💻 Local Development Setup

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1    # On Windows PowerShell
# source venv/bin/activate     # On macOS / Linux

# Install dependencies (FastAPI, SQLAlchemy, ReportLab, etc.)
pip install -r requirements.txt

# Run initial database setup & demo accounts
python -m app.database.init_db

# Start backend server (runs at http://127.0.0.1:8000)
uvicorn app.main:app --reload --port 8000
```
Backend Swagger API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite development server (runs at http://127.0.0.1:5173)
npm run dev
```
Frontend Web Application: [http://127.0.0.1:5173](http://127.0.0.1:5173)

---

## 🔑 Demo Accounts & Evaluation Credentials

Every account has the default evaluation password: **`Password@AIIA2026!`**

| Role Name | Username | Direct Evaluation Scope |
| :--- | :--- | :--- |
| **Principal Investigator** | `investigator` | Multi-center trials, participant recruitment, NAMASTE auto-fill wizard |
| **Ethics Committee Chair** | `ethics` | Protocol reviews, 21 CFR Part 11 digital approval ceremony |
| **Pharmacovigilance Officer** | `pharmacovigilance` | 24-hour statutory SAE countdown clocks, expedited DCGI notice dispatch |
| **Study Coordinator** | `coordinator` | Participant screening, ICF verification, visit tracking |
| **Clinical Trial Monitor** | `monitor` | Multi-centric site enrollment targets, GCP source data verification |
| **Regulatory Inspector** | `regulator` | CDSCO regulatory events, tamper-evident audit logs, expedited notices |
| **System Administrator** | `admin` | Complete system RBAC, user directory provisioning, audit telemetry |

> **Evaluator Tip**: The landing page includes **1-Click Role Launcher** buttons for all 7 stakeholders, and the top navigation bar includes an instant **`⚡ Switch Persona`** modal to evaluate different permissions without logging out.

---

## 📜 Regulatory Compliance Summary

- **CDSCO NDCTR 2019**: Rule 42 24h SAE notice dispatch, Ethics Committee approval certification.
- **US FDA 21 CFR Part 11**: Non-repudiation digital signatures, tamper-evident audit trail, password-authenticated re-signing ceremony.
- **ICH-GCP E6(R2)**: Standardized clinical protocol versioning, adverse event classification, source data verification (SDV).
- **Ministry of Ayush GCP Guidelines**: Classical terminology alignment with *Prakriti*, *Agni*, and *Dosha* evaluation matrices.
