# 🎧 Datastraw Support CRM

### E-commerce Operations Control Panel

A premium, dark-themed Support Ticketing CRM for managing customer requests, order issues, and support metrics — built for D2C / e-commerce brands.

---

### Tech Stack

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_Icons-1.17-F56040?style=for-the-badge&logo=lucide&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI-2C2F33?style=for-the-badge&logo=gunicorn&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-2-E92063?style=for-the-badge&logo=pydantic&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-Markup-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| **Operations Control Center** | Real-time dashboard with ticket volume, resolved statuses, and priority distribution |
| **E-commerce Category Distribution** | Visual progress gauges for incoming ticket categorizations |
| **Live AI Triage & Sentiment** | Analyzes subject/description in real-time to categorize issues (Refund, Shipping, etc.) and flag sentiment (😡 Negative, 😊 Positive) |
| **Supabase Realtime Sync** | Instant cross-tab database syncing without page refresh |
| **Internal Notes & Thread** | Slide-out ticket drawer to update status tags and add agent notes history |
| **REST API Backend** | 4 FastAPI endpoints for CRUD ticket operations, proxied through Vite |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Browser (React SPA)                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐ │
│  │  Sidebar    │  │  Dashboard │  │  Ticket Workspace  │ │
│  │  (NavLinks) │  │  (KPIs)    │  │  (List + Detail)   │ │
│  └────────────┘  └────────────┘  └────────────────────┘ │
└───────────────────────┬──────────────────────────────────┘
                        │  HTTP /api/*  (Vite proxy)
                        ▼
┌──────────────────────────────────────────────────────────┐
│                  FastAPI + Uvicorn                        │
│   POST /api/tickets       GET /api/tickets               │
│   GET  /api/tickets/{id}  PUT /api/tickets/{id}          │
└───────────────────────┬──────────────────────────────────┘
                        │  supabase-py SDK
                        ▼
┌──────────────────────────────────────────────────────────┐
│                 Supabase (PostgreSQL)                     │
│         tickets table  ·  notes table                    │
│         Realtime publication enabled                     │
└──────────────────────────────────────────────────────────┘
```

---

## 🛠️ Database Setup (Supabase SQL)

Paste the following SQL commands in your **Supabase SQL Editor** to create the tables:

```sql
-- 1. Create Tickets Table
create table tickets (
  id bigint generated always as identity primary key,
  ticket_id text unique not null,
  customer_name text not null,
  customer_email text not null,
  subject text not null,
  description text not null,
  status text not null default 'Open',
  priority text not null default 'Medium',
  sentiment text,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Realtime for Tickets Table (Crucial for live updates!)
alter publication supabase_realtime add table tickets;

-- 2. Create Notes Table
create table notes (
  id bigint generated always as identity primary key,
  ticket_id text references tickets(ticket_id) on delete cascade not null,
  note_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

## 💻 Local Development Setup

### Prerequisites

- **Node.js** 18+ — [nodejs.org](https://nodejs.org)
- **Python** 3.10+ — [python.org](https://www.python.org/)
- **npm** 9+ — Bundled with Node.js

### 1. Clone & Install Frontend

```bash
git clone https://github.com/Sahildk/datastraw-support-crm.git
cd datastraw-support-crm
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root **and** in the `backend/` directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```env
# backend/.env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 3. Set Up Python Backend

```bash
python -m venv venv
```

**Windows (PowerShell):**
```powershell
.\venv\Scripts\pip install -r backend\requirements.txt
```

**macOS / Linux:**
```bash
source venv/bin/activate
pip install -r backend/requirements.txt
```

---

## ▶️ Running the Application

You need **two terminals** running simultaneously:

### Terminal 1 — API Backend (FastAPI + Uvicorn)

```bash
npm run api
```

> FastAPI runs at `http://127.0.0.1:8000` serving the 4 `/api/tickets` REST endpoints.

### Terminal 2 — React Frontend (Vite Dev Server)

```bash
npm run dev
```

> Vite runs at `http://localhost:5173` and automatically proxies all `/api` calls to Uvicorn.

Open your browser to **http://localhost:5173** to access the CRM.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/tickets` | Create a new ticket (`customer_name`, `customer_email`, `subject`, `description`) |
| `GET` | `/api/tickets` | List tickets (optional: `?status=Open&search=name`) |
| `GET` | `/api/tickets/{ticket_id}` | Get full ticket details with notes |
| `PUT` | `/api/tickets/{ticket_id}` | Update ticket status and/or add notes |

---

## 📁 Project Structure

```
datastraw-support-crm/
├── backend/
│   ├── __init__.py
│   ├── main.py              # FastAPI app with static mount & endpoints
│   ├── requirements.txt     # Backend Python dependencies
│   └── .env                 # Backend Supabase credentials
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx       # Left navigation sidebar
│   │   │   ├── Dashboard.jsx     # KPI cards, charts, sentiment
│   │   │   ├── TicketList.jsx    # Searchable ticket list
│   │   │   ├── TicketDetail.jsx  # Ticket detail + notes panel
│   │   │   ├── TicketForm.jsx    # Slide-out ticket creation drawer
│   │   │   └── SearchFilter.jsx  # Search & status filter bar
│   │   ├── App.jsx               # Main app shell & routing
│   │   ├── main.jsx              # React entry point
│   │   ├── supabaseClient.js     # Supabase SDK initialisation
│   │   └── index.css             # Global styles & design tokens
│   ├── public/                   # Static assets
│   ├── index.html                # HTML shell
│   ├── vite.config.js            # Vite config with API proxy
│   ├── tailwind.config.js        # Tailwind theme customisation
│   ├── eslint.config.js          # ESLint rules
│   ├── postcss.config.js         # PostCSS config
│   ├── package.json              # Frontend npm dependencies & scripts
│   └── .env                      # Frontend Supabase credentials
├── package.json                  # Root npm scripts (dev/api/build proxies)
├── Procfile                      # Railway start process configuration
├── nixpacks.toml                 # Nixpacks multi-runtime specification
├── railway.json                  # Railway custom build phases
└── requirements.txt              # Root Python dependencies for Nixpacks

```

---

## ⚡ Deploying on Railway.app

This project has been set up with a single-process deployment configuration that compiles the Vite React frontend and serves it via the FastAPI backend automatically.

### Steps to Deploy:

1. **Push the repository** to GitHub.
2. Log in to [Railway.app](https://railway.app) and create a **New Project** → **Deploy from GitHub repo**.
3. Select your repository.
4. Go to the **Variables** tab of the service and add your Supabase credentials:
   - `SUPABASE_URL` = `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY` = `your-anon-key`
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
5. Railway will read the `railway.json` and `nixpacks.toml` configuration, install Node/Python dependencies, build the React frontend, and deploy the FastAPI container.
6. Once deployed, Railway will generate a public URL. Open it to test your CRM!

---

Built with ❤️ for **Datastraw AI**

![Supabase](https://img.shields.io/badge/Powered_by-Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/Bundled_with-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/Served_by-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)

