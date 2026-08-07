# Orbit — Daily Planning, Knowledge & Career Suite

Orbit is a modern, full-stack personal productivity application built with Next.js, Prisma, PostgreSQL, and Tailwind CSS. It combines daily todo planning, interactive calendar scheduling, searchable knowledge resource bookmarking, and career application tracking into a unified SaaS experience.

---

## 🌟 Key Features

### 📅 Daily Planner Module
- **Daily Todo Management**: Create, edit, schedule, drag-and-drop, and complete tasks with priorities (Low, Medium, High, Urgent), tags, start dates, due dates, and rich markdown notes.
- **Interactive Calendar**: Month view calendar highlighting today, selected dates, and task counts per date cell.
- **Smart Sections**: Today's Tasks, Upcoming, Overdue, Completed Today, and No Due Date.
- **Dashboard Widgets**: Interactive today's task checklist, completion progress ring, mini calendar, and summary metrics.

### 💼 Career Module
- Track career opportunities across stages (Applied, Shortlisted, Assessments, Technical Rounds, HR, Offers, Rejections).
- Contact management, resume versioning, salary metrics, and follow-up reminders.

### 📚 Resource Library
- Searchable bookmark library for GitHub repos, AI tools, documentation, blogs, and system design materials.
- Category filters, custom tags, and favorite toggles.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (Credentials Provider)
- **Styling**: Tailwind CSS v4 with glassmorphism design tokens & dark/light theme support
- **UI & Icons**: Radix UI, Lucide React, Sonner Toasts

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- PostgreSQL database instance

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/orbit_db"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="adminpassword"
NEXTAUTH_SECRET="your-secure-nextauth-secret-key-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Installation & Database Migration

```bash
# Install dependencies
npm install

# Generate Prisma Client & apply migrations
npm run db:generate
npm run db:migrate:dev

# Seed database with sample data
npm run db:seed
```

### 4. Running Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Support

Build and run Orbit using Docker:

```bash
# Build Docker image
docker build -t orbit-app .

# Run Docker container
docker run -p 3000:3000 --env-file .env orbit-app
```
