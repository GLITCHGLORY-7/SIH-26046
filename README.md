# All India Institute of Ayurveda (AIIA) — Clinical Trials Management System (CTMS)

**Ministry of Ayush • Government of India**  
*National Center of Excellence in Clinical Ayurveda Research*  
**Problem Statement Reference:** PS SIH26046

[![Compliance - 21 CFR Part 11](https://img.shields.io/badge/Compliance-US_FDA_21_CFR_Part_11-042f2e.svg)](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfcfr/CFRSearch.cfm?CFRPart=11)
[![Regulatory - CDSCO NDCTR 2019](https://img.shields.io/badge/Regulatory-CDSCO_NDCTR_2019_Rule_42-0f766e.svg)](https://cdsco.gov.in)
[![Standards - ICH GCP E6(R2)](https://img.shields.io/badge/Standards-ICH--GCP_E6(R2)-059669.svg)](https://www.ich.org)
[![Interoperability - HL7 FHIR R4](https://img.shields.io/badge/Interoperability-HL7_FHIR_Release_4-1d4ed8.svg)](https://hl7.org/fhir/R4/)
[![Data Standards - CDISC SDTM](https://img.shields.io/badge/Data_Standards-CDISC_SDTM_v1.7-6366f1.svg)](https://www.cdisc.org/standards/foundational/sdtm)
[![Frontend - React 19 & Vite](https://img.shields.io/badge/Frontend-React_19_|_TypeScript_|_Vite-334155.svg)](https://vitejs.dev)
[![Backend - FastAPI & Python](https://img.shields.io/badge/Backend-FastAPI_|_Python_3.12-334155.svg)](https://fastapi.tiangolo.com)

---

## Executive Summary

The **AIIA Clinical Trials Management System (CTMS)** is a standardized, regulatory-compliant digital platform developed for the **All India Institute of Ayurveda (AIIA)** under the **Ministry of Ayush**. 

Traditional Ayurvedic clinical research requires the systematic harmonization of classical holistic principles (*Tridosha*, *Prakriti*, *Agni*, polyherbal formulations) with contemporary Western Good Clinical Practice (GCP) rigor. This system bridges that divide by coupling dual-coded classical terminologies with cryptographic electronic signatures, 24-hour statutory adverse event dispatch workflows, and international healthcare interoperability standards.

---

## Architectural Differentiators

### 1. NAMASTE & WHO ICD-11 Dual-Coding Standard
* **Standardized Morbidities**: Automated registry cross-walking classical Ayurvedic diagnoses (*Amavata*, *Sandhigata Vata*, *Madhumeha*) to **National Ayush Morbidity & Standardized Terminology Electronic (NAMASTE)** portals and **WHO ICD-11 Traditional Medicine Module 2 (TM2)**.
* **Classical Polyherbal Registries**: Pre-configured formulation schemas linking botanical interventions (Shallaki, Dashamoola, Ashwagandha) with dosage schedules and batch accountability.

### 2. 21 CFR Part 11 Cryptographic Electronic Signatures
* **Non-Repudiation Signing Ceremony**: Formal dual-credential re-authentication requiring user password entry and explicit legal declaration (e.g., *Approval and Regulatory Clearance*, *Causality Review Verification*).
* **SHA-256 Digital Fingerprint**: Generates tamper-evident certificate digests (`SIG-SHA256-...`) embedded into protocol versions, ethics submissions, and safety notifications.
* **Append-Only Audit Ledger**: Immutable system audit trail tracking every clinical change, review milestone, and signature event with zero modification or deletion endpoints.

### 3. Statutory 24-Hour Expedited SAE Notice (CDSCO NDCTR 2019 Rule 42)
* **Automated Clocks**: Active countdown timers initiated upon Serious Adverse Event (SAE) intake.
* **Expedited Dispatch**: One-click electronic submission generating official statutory notices to the Drugs Controller General of India (DCGI) and Institutional Ethics Committee within the mandatory 24-hour window.
* **WHO-UMC Causality Scale**: Integrated Ayurvedic polyherbal pharmacovigilance causality assessment (*Certain*, *Probable*, *Possible*, *Unlikely*, *Unclassified*).

### 4. Healthcare Data Interoperability (HL7 FHIR R4 & CDISC SDTM)
* **HL7 FHIR Release 4**: Native REST resources for `Patient`, `Encounter`, `Condition`, `Medication`, `Observation`, and `Consent`.
* **CDISC SDTM v1.7**: Export engines generating standard regulatory tabulation domains:
  * `DM` — Core Subject Demographics
  * `SV` — Scheduled and Actual Protocol Visits
  * `AE` — Adverse Events Surveillance
  * `TS` — Trial Summary & Governance Metadata
  * `TV` — Trial Visits Schedule

### 5. Multi-Format HTML-to-Canvas PDF & JSON Export Engine
* **High-Definition Vector PDF**: Client-side document rasterization via HTML-to-Canvas and jsPDF, outputting print-ready multi-page A4 dossiers with official institutional letterheads, visit schedules, and certificate stamps.
* **RFC 8259 Compliant JSON**: Instant structured data exports for research study bundles, FHIR resource graphs, and trial protocols.

---

## System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│              Client Layer (React 19, TypeScript, TailwindCSS)           │
│  ┌───────────────────────┐  ┌─────────────────────┐  ┌────────────────┐ │
│  │ 1-Click Role Launcher │  │ Persona Switcher    │  │ HTML2Canvas    │ │
│  │ & Branded Login Portal│  │ (7 RBAC Workstations│  │ PDF/JSON Engine│ │
│  └───────────────────────┘  └─────────────────────┘  └────────────────┘ │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTPS / REST (JWT Bearer)
┌────────────────────────────────────▼────────────────────────────────────┐
│                    API Gateway & Application Layer                      │
│                           (FastAPI, Python 3.12)                        │
│  ┌─────────────────────────┐  ┌───────────────────┐  ┌────────────────┐ │
│  │ 21 CFR Part 11 Engine   │  │ CDSCO NDCTR 2019  │  │ Interop Engine │ │
│  │ Dual-Credential Verify  │  │ 24h SAE Dispatch  │  │ FHIR R4 / CDISC│ │
│  └─────────────────────────┘  └───────────────────┘  └────────────────┘ │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ SQLAlchemy ORM
┌────────────────────────────────────▼────────────────────────────────────┐
│                 Persistence & Compliance Ledger Layer                   │
│  ┌─────────────────────────┐  ┌───────────────────┐  ┌────────────────┐ │
│  │ Clinical Trials & Sites │  │ Participants & ICF│  │ Immutable Audit│ │
│  │ (PostgreSQL / SQLite)   │  │ Screening Register│  │ Log Ledger     │ │
│  └─────────────────────────┘  └───────────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Stakeholder Workstations & Jurisdictions

The platform enforces strict regulatory segregation of duties to prevent commercial recruitment bias and safeguard subject privacy:

| Role Name | Username | Operational Scope & Jurisdictional Responsibility |
| :--- | :--- | :--- |
| **Principal Investigator** | `investigator` | Multi-center trial protocols, site allocations, NAMASTE auto-coding, and clinical visit oversight. |
| **Ethics Committee Chair** | `ethics` | Independent review of protocol amendments, bilingual ICF assessments, and 21 CFR Part 11 approval signatures. |
| **Pharmacovigilance Officer** | `pharmacovigilance` | Adverse reaction surveillance, 24-hour statutory DCGI dispatch clocks, and WHO-UMC causality evaluation. |
| **Study Coordinator** | `coordinator` | Prospective subject screening, eligibility scorecards, informed consent verification, and clinical visit scheduling. |
| **Clinical Trial Monitor** | `monitor` | Multi-center recruitment quota tracking, Source Data Verification (SDV), and Good Clinical Practice (GCP) audits. |
| **Regulatory Inspector** | `regulator` | CDSCO statutory event inspection, CTRI registry verification, and immutable SHA-256 audit ledger audits. |
| **System Administrator** | `admin` | System-wide RBAC governance, user directory provisioning, and operational telemetry. |

---

## Deployment Guide

### Hosting on Vercel

The repository includes root and frontend configurations ([`vercel.json`](./vercel.json)) supporting automated SPA rewrites and Vite builds.

#### Option 1: Monorepo Root Deployment
1. Import the repository into **[Vercel](https://vercel.com)**.
2. Maintain default settings (`Framework: Vite`, `Root Directory: ./`).
3. The root `vercel.json` will execute:
   ```bash
   cd frontend && npm install && npm run build
   ```
4. Configure optional environment variables:
   * `VITE_API_BASE_URL`: URL of the deployed FastAPI backend (e.g., `https://api.yourdomain.gov.in/api/v1`).
5. Click **Deploy**.

#### Option 2: Subfolder Deployment
1. When importing into Vercel, specify the **Root Directory** as `frontend`.
2. Vercel will automatically compile the frontend using `frontend/package.json` and `frontend/vercel.json`.
3. Click **Deploy**.

---

## Local Development Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **Python**: v3.11 or higher
* **Package Managers**: npm, pip

### 1. Backend Service

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1       # Windows PowerShell
# source venv/bin/activate        # Linux / macOS

# Install dependencies
pip install -r requirements.txt

# Seed database with roles, permissions, and initial trial data
python -m app.database.init_db

# Launch FastAPI development server
uvicorn app.main:app --reload --port 8000
```
* **API Documentation (Swagger UI)**: `http://127.0.0.1:8000/docs`
* **Alternative Documentation (ReDoc)**: `http://127.0.0.1:8000/redoc`

### 2. Frontend Application

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
* **Web Portal**: `http://127.0.0.1:5173`

---

## Evaluation Credentials

All seeded prototype accounts share the standardized evaluation password:

```text
Password@AIIA2026!
```

> **Evaluation Shortcut**: The landing page at `http://127.0.0.1:5173/login` features a **1-Click Role Showcase** allowing instant authentication as any of the 7 personas. Additionally, the global header contains a **`⚡ Switch Persona`** modal to switch stakeholder perspectives dynamically without re-authenticating.

---

## Automated Verification Suite

The repository contains an automated verification suite validating all 12 API modules across all 7 platform roles:

```bash
cd backend
.\venv\Scripts\python scratch/e2e_verification_suite.py
```

```text
================================================================================
AIIA CLINICAL TRIALS MANAGEMENT SYSTEM — FULL E2E SUITE
Tested across: ADMIN, PI, COORDINATOR, MONITOR, ETHICS, PV, REGULATOR
================================================================================
[PASS] Authentication & User Profile Resolution           (7/7 Roles Verified)
[PASS] 21 CFR Part 11 Cryptographic E-Signature Ceremony   (SHA-256 Hash Valid)
[PASS] Role-Specific Dashboard Metrics & Alert Isolation   (No Data Leakage)
[PASS] Clinical Trial Protocols, Sites & Version History   (Complete Lifecycle)
[PASS] Prospective Screening Register & Visit Protocols   (GCP Verified)
[PASS] Ethics Committee Clearances & Amendments           (IEC Formal Approval)
[PASS] National CTRI Registry Synchronization             (Registry Linked)
[PASS] Statutory Regulatory Deadlines & Milestones        (Statutory Tracked)
[PASS] Pharmacovigilance & 24h Expedited DCGI Notices     (Rule 42 Dispatched)
[PASS] HL7 FHIR Release 4 Resource Bundle Serializers     (FHIR R4 Valid)
[PASS] CDISC SDTM Regulatory Domain Tabulation Exports    (DM & AE Valid)
[PASS] Immutable 21 CFR Part 11 Audit Trail Verification  (Non-Repudiation)
--------------------------------------------------------------------------------
TOTAL CHECKS: 47 / 47 PASSED (100% SUCCESS RATE)
================================================================================
```

---

## Regulatory Compliance & Statutory Standards

* **CDSCO New Drugs and Clinical Trials Rules (NDCTR) 2019**: Rule 42 statutory 24h reporting clocks, Institutional Ethics Committee registration criteria.
* **US FDA 21 CFR Part 11**: Electronic records, non-repudiation electronic signatures, password dual-authentication, and immutable chronological audit trails.
* **ICH-GCP E6(R2)**: Standardized protocol versioning, investigator brochures, participant screening logs, and Source Data Verification (SDV).
* **Ministry of Ayush Good Clinical Practice Guidelines**: Classical nomenclature harmonization (*Prakriti*, *Agni*, *Dosha*), safety evaluations of polyherbal formulations.

---

## License & Institutional Notice

Developed for the **Ministry of Ayush** and the **All India Institute of Ayurveda (AIIA)** for the Smart India Hackathon (Problem Statement SIH26046).  
Copyright © 2026 All India Institute of Ayurveda. All rights reserved.
