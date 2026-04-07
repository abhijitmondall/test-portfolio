# Abhijit Mondal — Personal Brand Website

A full-stack personal brand website with an admin control panel.

**Tech Stack:**

- **Frontend:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Shadcn UI · Motion (Framer) · TanStack Query v5 · Zustand v5 · React Hook Form + Zod
- **Backend:** Node.js · Express 4 · PostgreSQL · Prisma 6 · TypeScript · JWT Auth · Multer

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- PostgreSQL 16+
- npm or pnpm

---

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 2. Set Up Environment

**Backend** — copy and edit:

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/personal_brand_db"
JWT_SECRET="your-random-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

**Frontend** — create `.env.local`:

```
NEXT_PUBLIC_API_URL=https://test-portfolio-dusky.vercel.app/api
```

---

### 3. Set Up Database

```bash
cd backend

# Create DB and run migrations
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed with Abhijit's data
npm run db:seed
```

---

### 4. Run the Project

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
# ✅ Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
# ✅ App running on http://localhost:3000
```

---

## 🔐 Admin Panel

Access: **http://localhost:3000/admin**

Default admin (local development only):

- Email: `abhijeetmondal5@gmail.com`
- Password: configured via `ADMIN_PASSWORD` in `backend/.env` (do not commit real passwords)

Set `ADMIN_PASSWORD` in `backend/.env` before running the seed, and change the password immediately after first login in production.

---

## 📋 Admin Panel Features

| Section       | Features                                             |
| ------------- | ---------------------------------------------------- |
| **Dashboard** | Stats overview, recent messages, quick actions       |
| **Projects**  | Create/Edit/Delete, toggle featured & published      |
| **Skills**    | Manage categories and skills with proficiency levels |
| **Blog**      | Write posts in Markdown, publish/draft toggle        |
| **Messages**  | View contact form submissions, mark status, reply    |
| **Settings**  | Update profile, social links, change password        |

---

## 🌐 Public Pages

| Page     | Route       |
| -------- | ----------- |
| Home     | `/`         |
| About    | `/about`    |
| Projects | `/projects` |
| Blog     | `/blog`     |
| Contact  | `/contact`  |

---

## 🗂️ Project Structure

```
personal-brand/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express app entry
│   │   ├── routes/           # All API routes
│   │   ├── middleware/        # Auth + error handlers
│   │   └── seed.ts           # DB seed with your data
│   └── prisma/
│       └── schema.prisma     # Full data model
│
└── frontend/
    ├── app/
    │   ├── (public)/         # Public pages (home, about, projects, blog, contact)
    │   ├── admin/            # Admin panel (dashboard, projects, skills, blog, messages, settings)
    │   └── globals.css       # Design system + utilities
    ├── components/
    │   ├── layout/           # Navbar, Footer
    │   └── sections/         # Hero, About, Projects, Skills, Experience, CTA
    └── lib/
        ├── api.ts            # All API functions
        ├── store.ts          # Zustand auth store
        └── utils.ts          # Utility functions
```

---

## 🎨 Design System

- **Primary color:** `#E8FF00` (brand yellow)
- **Accent:** `#00D4FF` (cyan)
- **Background:** `#08080F` (near black)
- **Fonts:** Syne (display/headings) + Instrument Sans (body)

---

## 📦 Deployment

**Backend:** Deploy to Railway, Render, or any VPS

```bash
npm run build
npm start
```

**Frontend:** Deploy to Vercel

```bash
npm run build
```

Update `NEXT_PUBLIC_API_URL` in Vercel environment variables to your backend URL.

---

## 🔧 API Endpoints

```
POST   /api/auth/login          Public - Login
GET    /api/auth/me             Auth   - Get current user
GET    /api/profile             Public - Get profile
PUT    /api/profile             Auth   - Update profile
GET    /api/projects            Public - List projects
POST   /api/projects            Auth   - Create project
PUT    /api/projects/:id        Auth   - Update project
DELETE /api/projects/:id        Auth   - Delete project
GET    /api/experiences         Public - List experiences
GET    /api/skills              Public - List skills + categories
GET    /api/blog                Public - List published posts
GET    /api/blog/admin/all      Auth   - List all posts
POST   /api/messages            Public - Send contact message
GET    /api/messages            Auth   - List messages
PATCH  /api/messages/:id/status Auth   - Update message status
POST   /api/upload/image        Auth   - Upload image
```

---

Built with ❤️ for Abhijit Mondal | developer-avi.com
