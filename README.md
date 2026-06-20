# com.TechStore

A full-stack e-commerce platform for computer hardware built with Next.js, TypeScript, SQLite, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** SQLite via `better-sqlite3`
- **Auth:** JWT (`jsonwebtoken`) + bcrypt
- **State:** Zustand (cart) + React Context (auth)
- **i18n:** next-intl — `en-US` and `pt-BR`
- **Forms:** React Hook Form + Zod
- **Testing:** Vitest + React Testing Library

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Seed the database

Populates the admin user, 8 categories, and 6 sample products:

```bash
npm run seed
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Accounts

### Admin

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@techstore.com`  |
| Password | `admin1234`            |
| Login    | `/admin-login`         |

The admin panel is accessible at `/admin` after logging in.

### Customer

Register a new account at `/signup`.

## Scripts

| Command         | Description                        |
|-----------------|------------------------------------|
| `npm run dev`   | Start development server           |
| `npm run build` | Production build                   |
| `npm run seed`  | Seed database with initial data    |
| `npm test`      | Run Vitest test suite              |

## Project Structure

```
src/
  app/
    [locale]/       # All pages (en-US, pt-BR)
      admin/        # Admin panel (protected)
    api/            # API routes
  components/       # Shared UI components
  context/          # Auth context + cart store
  db/               # SQLite client, migrations, seed
  hooks/            # Data-fetching hooks
  i18n/             # Routing, navigation, request config
  lib/              # JWT, auth utilities
messages/           # Translation files (en-US, pt-BR)
```
