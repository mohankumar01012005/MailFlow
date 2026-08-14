# 🚀 MailFlow — Distributed Email Campaign Orchestrator

MailFlow is an enterprise-grade, full-stack distributed email scheduling and dispatching platform. Built with **React 19**, **Node.js**, **Express**, **TypeScript**, **PostgreSQL (Prisma ORM)**, **Redis**, and **BullMQ**, MailFlow provides asynchronous queue processing, atomic rate limiting, multi-sender identity rotation, dynamic job postponement, and multi-tenant data isolation.

---

## 🌐 Live Production Links

* **Live Web Application (Vercel)**: [https://client-neon-eight.vercel.app](https://client-neon-eight.vercel.app)
* **Backend API & Health Endpoint (Render)**: [https://mailflow-jj2j.onrender.com/health](https://mailflow-jj2j.onrender.com/health)

---

## ✨ Key Architectural Highlights

* ⚡ **Asynchronous BullMQ Queue & Worker**: Long-running background worker decoupled from the HTTP server to process delayed email dispatch jobs reliably.
* 🛡️ **Multi-Tenant Data Isolation**: Complete database and query-level isolation binding campaigns, recipients, and activity stats strictly to the authenticated `userId`.
* 🔑 **Dual Authentication System**: Secure Email/Password registration with salted password hashing + Google OAuth 2.0 single sign-on with token-based JWT sessions.
* ⏱️ **Redis-Backed Distributed Rate Limiting**: Multi-worker safe hourly rate controls using Redis `INCR` + `EXPIRE` keys (`rate_limit:{campaignId}:{YYYY-MM-DD-HH}`).
* 🔄 **Dynamic Rate-Limit Job Rescheduling**: Jobs exceeding hourly limits are automatically postponed to the next hour window rather than marked as failed.
* 📬 **Multi-Sender Identity Rotation**: Dispatches messages via Ethereal Email across a pool of 5 distinct sender identities (`Campaigns`, `Growth Team`, `Outreach`, `Dispatcher`, `Support`).
* 🔒 **Idempotency & Zero Duplicate Guarantee**: Redis distributed locks (`SET email_lock:{scheduledEmailId} "LOCKED" NX EX 60`) prevent concurrent worker execution and duplicate email dispatches.
* 🔔 **Real-Time Toast & UX System**: Modern stacked notifications (`success`, `error`, `warning`, `info`) with auto-dismissal and postponement alert banners.

---

## 🛠️ Technology Stack

### **Frontend**
* **Framework**: React 19 + Vite
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4 (Vanilla CSS variables)
* **State Management & Data Fetching**: TanStack React Query (v5)
* **Routing**: React Router v7 (SPA routing)
* **Icons**: Lucide React

### **Backend**
* **Runtime**: Node.js + Express.js
* **Language**: TypeScript (`tsx` dev watcher & `tsc` compiler)
* **Database**: PostgreSQL
* **ORM**: Prisma ORM (Migration engine & query client)
* **Caching & Distributed Store**: Redis (`ioredis`)
* **Queue Engine**: BullMQ (Distributed job queue & delayed jobs)
* **Email Transport**: Nodemailer + Ethereal Email Fake SMTP
* **Security & Auth**: JWT (`jsonwebtoken`), Google OAuth 2.0 API, CORS control, security headers

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Vercel)"]
        UI["React 19 + Vite SPA"]
        Toast["Toast & Alert System"]
        AuthContext["Auth Context (JWT / OAuth)"]
    end

    subgraph Backend ["Backend API Layer (Render Process)"]
        Express["Express HTTP Server"]
        AuthMiddleware["Multi-Tenant Auth Middleware"]
        CampaignService["Campaign & CSV Service"]
    end

    subgraph Storage ["Persistence Layer"]
        PG[("PostgreSQL DB")]
        RedisDB[("Redis Store")]
    end

    subgraph QueueWorker ["Worker Pipeline (Render Continuous Worker)"]
        BullQueue["BullMQ Email Queue"]
        Worker["Long-Running Queue Worker"]
        LockEngine["Redis Lock Engine (Idempotency)"]
        RateLimiter["Redis Hourly Counter"]
    end

    subgraph Transport ["Email Infrastructure"]
        SenderPool["Ethereal Sender Identity Pool (5 Identities)"]
        Ethereal["Ethereal SMTP / Test Message Web View"]
    end

    UI -->|HTTP / REST API| Express
    Express --> AuthMiddleware
    AuthMiddleware --> PG
    Express -->|Queue Jobs| BullQueue
    BullQueue <--> RedisDB
    Worker -->|Fetch Job| BullQueue
    Worker -->|Acquire Lock| LockEngine
    Worker -->|Check Quota| RateLimiter
    Worker -->|Update Status| PG
    Worker -->|Send Email| SenderPool
    SenderPool --> Ethereal
```

---

## 📦 System Capabilities & Features

| Category | Capability | Description |
| :--- | :--- | :--- |
| **Authentication** | Multi-Auth & Isolation | Email/Password JWT auth + Google OAuth 2.0 with per-user data scoping. |
| **Campaigns** | Campaign Management | Create draft, schedule, pause, resume, and cancel email campaigns. |
| **Recipients** | CSV & Manual Import | Batch upload recipient lists with automated email validation and duplicate removal. |
| **Scheduling** | Delayed Job Queue | BullMQ staggered job dispatching using configurable delay intervals. |
| **Rate Controls** | Hourly Quota Enforcement | Redis-backed distributed hourly limit preventing domain throttling. |
| **Rescheduling** | Graceful Postponement | Re-queues delayed jobs to the next hour window when quota is reached. |
| **Multi-Sender** | Identity Rotation | Rotates sender profiles (`Campaigns`, `Growth`, `Outreach`, `Dispatcher`, `Support`). |
| **Idempotency** | Duplicate Prevention | Distributed Redis lock preventing race conditions across multi-worker clusters. |
| **Reliability** | Error Handling & Retry | Automatic retry with simulated failure testing (`fail-once`, `fail`). |
| **Analytics** | Live Performance Dashboard | Real-time campaign stats (Sent, Processing, Scheduled, Failed). |

---

## ⚙️ Environment Variables

### **Backend (`server/.env`)**

```env
# Server Port & Mode
PORT=5000
NODE_ENV=production

# Database Connection
DATABASE_URL="postgresql://user:password@host:5432/mailflow?sslmode=require"

# Redis Connection
REDIS_URL="rediss://default:password@host:6379"

# Auth & Secrets
JWT_SECRET="production-jwt-secret-key-change-this"

# Ethereal Email Credentials
SMTP_HOST="smtp.ethereal.email"
SMTP_PORT=587
SMTP_USER="marcellus.lang@ethereal.email"
SMTP_PASS="uhYcw8emGm4Ruf7fRt"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="787050108865-vllv0to5rkjnet4qvh17g725v2ghj48m.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="https://mailflow-jj2j.onrender.com/api/auth/google/callback"

# Frontend Origin for CORS
CLIENT_URL="https://client-neon-eight.vercel.app"

# Worker Concurrency
WORKER_CONCURRENCY=5
```

### **Frontend (`client/.env`)**

```env
VITE_API_BASE_URL="https://mailflow-jj2j.onrender.com"
```

---

## 💻 Local Development Setup Guide

### **Prerequisites**
* Node.js v18+ or v20+
* Docker & Docker Compose (for PostgreSQL & Redis)

### **Step 1: Clone Repository**
```bash
git clone https://github.com/mohankumar01012005/MailFlow.git
cd MailFlow
```

### **Step 2: Start PostgreSQL & Redis Services**
```bash
docker-compose up -d
```

### **Step 3: Backend Setup**
```bash
cd server
npm install
npx prisma db push
npm run dev
```
*Backend server will start running on `http://localhost:5000` with connected Database, Redis, and BullMQ worker.*

### **Step 4: Frontend Setup**
```bash
cd ../client
npm install
npm run dev
```
*Frontend application will start running on `http://localhost:5173`.*

---

## 🛰️ Production Deployment Architecture

* **Frontend Deployment (Vercel)**:
  * Deployed as a Vite Single-Page Application (SPA) using `client/vercel.json` for client-side routing rewrites.
  * Environment variable `VITE_API_BASE_URL` points to Render backend.
* **Backend Deployment (Render)**:
  * Persistent Web Service process running both Express HTTP server and BullMQ Queue Worker.
  * Connected to Managed PostgreSQL and Managed Redis instances.

---

## 📄 License

Distributed under the **ISC License**. Created with ❤️ by Mohan Kumar.