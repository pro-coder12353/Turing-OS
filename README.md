# Project Turing (Turing OS)

> **B2B AI Security & Compliance Platform**  
> *Built for the GDG Hackathon by Team Turing*

Project Turing is an enterprise-grade AI compliance platform. As banks and corporations increasingly rely on AI to make critical decisions (like loan approvals), they run into a massive legal and ethical wall: **AI is a black box.** 

Turing OS solves this by wrapping existing AI models in a regulatory compliance layer. We provide contestability engines, cryptographic Sybil defenses, and immutable audit logs so humans never lose control over automated systems.

---

## 🚀 Key Features

*   **AI Contestability Engine (AI Court):** When the AI rejects an application, users don't just get a "Computer Says No" error. They can click "Contest Node", submit verifiable counter-evidence, and force the AI to re-evaluate its reasoning on the fly.
*   **Role-Based Access & Escalation (RBAC):** Tiered enterprise login via hardware 2FA. 
    *   *Compliance Officers* can argue with the AI or escalate stubborn cases.
    *   *Department Heads* have the absolute power to bypass the AI and "Force Approve".
*   **Immutable Audit Logs:** An admin dashboard that permanently logs every login, 2FA failure, manual override, and API key rotation, ensuring human accountability.
*   **Cryptographic Sybil Gateway:** A frontend Proof-of-Work (PoW) verification screen that prevents AI botnet swarms from flooding the application queue.
*   **Accessibility Audio Engine:** Fully compliant with a11y standards. A custom Web Speech API mutation observer that narratively speaks out loud whenever the AI updates its reasoning graph silently in the background.

---

## 💻 Tech Stack

*   **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide Icons, TypeScript.
*   **Backend:** Node.js, Express, TypeScript.
*   **Data:** Persistent JSON-based DB simulating a live PostgreSQL environment for stable, offline hackathon presentations. Pre-loaded with 85+ realistic UAE-based applicants (AED currency).

---

## 🛠️ How to Run Locally (For Team Members)

To run the full stack locally on your machine, you need to start both the Frontend and the Backend servers in two separate terminal windows.

### 1. Start the Backend (API & Database)
Open a terminal and run:
```bash
cd backend
npm install
npm run dev
```
*The backend will now be running on `http://localhost:5000`.*

### 2. Start the Frontend (UI)
Open a **second** terminal and run:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will now be running on `http://localhost:3000`.*

### 3. Using the App
Open your browser and navigate to `http://localhost:3000`. 
*   **To demo the Admin Logs:** Select "System Administrator" from the dropdown and hit Verify.
*   **To demo standard Contestability:** Select "Compliance Officer" from the dropdown.
*   **To demo Manual Overrides:** Select "Department Head" from the dropdown.

---

## 👥 The Team

*   **Paluc** - Web Development (UI/UX Architecture, Next.js)
*   **Nadeem** - Cybersecurity (Sybil-Resistance Gateway)
*   **Shritan** - Cloud & Infrastructure (Backend Contestability Engine)
*   **Khizr** - Business Strategy (GTM, Pitching)
