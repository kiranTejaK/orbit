# DEPLOYMENT.md — Step-by-Step Deployment & Operations Manual

## Project: Personal Productivity Hub (`resource-hub`)
**DevOps Lead**: Senior Principal Software Architect & DevOps Lead  
**Deployment Targets**: Vercel (Production Hosting) + AlwaysData (Managed PostgreSQL 16)

---

## 1. Prerequisites

### 1.1 System & CLI Tool Dependencies
Ensure the following CLI tools are installed on your local machine before initiating deployment:
- **Node.js**: `v20.19.0` or higher (`node -v`)
- **npm**: `v10.0.0` or higher (`npm -v`)
- **Vercel CLI**: `npm install -g vercel` (`vercel --version`)
- **Git**: `v2.40.0` or higher (`git --version`)

### 1.2 Access Permissions & Provisioning
- **Vercel Account**: Access to Vercel Dashboard with project creation permissions.
- **AlwaysData Account**: Active PostgreSQL database provisioned on AlwaysData (e.g., `postgresql-yourname.alwaysdata.net`).

---

## 2. Configuration & Environment Variables

### 2.1 Complete `.env.example`
Create a `.env` file based on the template below:

```env
# ─────────────────────────────────────────────────────────────────────────────
# DATABASE CONFIGURATION (AlwaysData PostgreSQL)
# CRITICAL: Special characters in password (e.g., '#', '@', ':') MUST be URL-encoded!
# Example: Password 'K8#monsoon' -> 'K8%23monsoon' (# = %23)
# ─────────────────────────────────────────────────────────────────────────────
DATABASE_URL="postgresql://illusiontech_hub:K8%23monsoon@postgresql-illusiontech.alwaysdata.net:5432/illusiontech_hub"

# ─────────────────────────────────────────────────────────────────────────────
# AUTHENTICATION CONFIGURATION (NextAuth v5)
# Default login credentials for the application
# ─────────────────────────────────────────────────────────────────────────────
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin"

# Secret used to sign JWT tokens. Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="dev-secret-replace-in-production-32chars"

# Application URL
NEXTAUTH_URL="http://localhost:3000"
```

### 2.2 Critical URL-Encoding Rules for Database Passwords
Standard PostgreSQL connection strings use URL parsing rules. If your database password contains special characters, they **must** be hex-encoded:

| Special Character | Encoded Replacement |
| :---: | :---: |
| `#` | `%23` |
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `%` | `%25` |

---

## 3. Local vs. Staging vs. Production Setup

### 3.1 Local Environment
1. Clone repository and install dependencies:
   ```bash
   git clone https://github.com/your-username/resource-hub.git
   cd resource-hub
   npm install
   ```
2. Set up local `.env`:
   ```bash
   cp .env.example .env
   ```
3. Generate Prisma client & push schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

### 3.2 Production Environment (Vercel + AlwaysData)
- Database schema is managed via `npx prisma db push`.
- Environment variables are injected into Vercel via Vercel Web Dashboard or Vercel CLI.

---

## 4. Deployment Instructions

### 4.1 Deployment to Vercel (Recommended)

#### Option A: Vercel Web Dashboard
1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [Vercel Dashboard](https://vercel.com/new) and import `resource-hub`.
3. In **Environment Variables**, add:
   - `DATABASE_URL` = `postgresql://illusiontech_hub:K8%23monsoon@postgresql-illusiontech.alwaysdata.net:5432/illusiontech_hub`
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD` = `<your-secure-password>`
   - `NEXTAUTH_SECRET` = `<32-char-random-string>`
   - `NEXTAUTH_URL` = `https://your-app.vercel.app`
4. Click **Deploy**.

#### Option B: Vercel CLI
```bash
# Login to Vercel
vercel login

# Link and deploy to preview environment
vercel

# Add environment variables
vercel env add DATABASE_URL production
vercel env add ADMIN_USERNAME production
vercel env add ADMIN_PASSWORD production
vercel env add NEXTAUTH_SECRET production

# Deploy to production
vercel --prod
```

### 4.2 Self-Hosted Docker Deployment (Alternative)

For containerized deployment on bare-metal VPS or Docker host, use the following production multi-stage `Dockerfile` and `docker-compose.yml`:

#### `Dockerfile`
```dockerfile
# Step 1: Base image
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-libc-dev openssl

# Step 2: Dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Step 3: Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run build

# Step 4: Runner
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/app/generated ./app/generated

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
```

#### `docker-compose.yml`
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://illusiontech_hub:K8%23monsoon@postgresql-illusiontech.alwaysdata.net:5432/illusiontech_hub
      - ADMIN_USERNAME=admin
      - ADMIN_PASSWORD=admin
      - NEXTAUTH_SECRET=dev-secret-replace-in-production-32chars
      - NEXTAUTH_URL=http://localhost:3000
    restart: always
```

### 4.3 GitHub Actions CI/CD Pipeline (`.github/workflows/deploy.yml`)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  verify:
    name: Verify & Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Check TypeScript & Build
        run: npm run build
        env:
          DATABASE_URL: "postgresql://illusiontech_hub:K8%23monsoon@postgresql-illusiontech.alwaysdata.net:5432/illusiontech_hub"
          ADMIN_USERNAME: "admin"
          ADMIN_PASSWORD: "admin"
          NEXTAUTH_SECRET: "test-secret-string-32-chars-long"
          NEXTAUTH_URL: "http://localhost:3000"

  deploy:
    name: Deploy to Vercel
    needs: verify
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Deploy to Vercel Action
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 5. Post-Deployment Verification & Smoke Tests

After deploying, run the following automated smoke tests to confirm application health:

### 5.1 Database Health Verification Script
Execute the custom database diagnostic script:
```bash
npm run db:test
```

Expected Output:
```text
🔍 Testing Database Connection…
📡 Connecting to: postgresql://***:***@postgresql-illusiontech.alwaysdata.net:5432/illusiontech_hub
✅ DATABASE CONNECTION SUCCESSFUL!
   Database: illusiontech_hub
   User:     illusiontech_hub
   Version:  PostgreSQL 16.14
🎉 Your PostgreSQL database is ready to use!
```

### 5.2 HTTP Smoke Tests (`curl`)
Run these smoke tests against your deployed domain:

```bash
# 1. Verify HTTP status of login page
curl -I https://your-app.vercel.app/login

# Expected output: HTTP/2 200 OK

# 2. Verify redirect for unauthorized access to dashboard
curl -I https://your-app.vercel.app/

# Expected output: HTTP/2 307 Temporary Redirect (Location: /login)

# 3. Verify public API endpoints
curl -I https://your-app.vercel.app/api/auth/providers

# Expected output: HTTP/2 200 OK
```

---

## 6. Monitoring, Logging & Observability

- **Database Pool Health**: Instantiated via `pg.Pool` inside `lib/prisma.ts` to manage reusable TCP connections across serverless invocations.
- **Application Logs**: Monitored via Vercel Logs (`vercel logs --prod`) or Vercel Web Dashboard.
- **Health Diagnostics**: Use the `/api/stats` endpoint for automated health checks.

---

## 7. Disaster Recovery & Rollback Plan

### 7.1 Emergency Application Rollback (Vercel)
If a deployment exhibits unexpected runtime errors:
```bash
# List recent deployments
vercel list

# Rollback immediately to previous deployment alias
vercel rollback <previous-deployment-id-or-url>
```

### 7.2 Database Restoration
AlwaysData performs automated database backups. To manually restore or export database state:

```bash
# Backup current PostgreSQL database to local dump file
pg_dump -h postgresql-illusiontech.alwaysdata.net -U illusiontech_hub -d illusiontech_hub -F c -b -v -f backup.dump

# Restore from local dump file
pg_restore -h postgresql-illusiontech.alwaysdata.net -U illusiontech_hub -d illusiontech_hub -v backup.dump
```
