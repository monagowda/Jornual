# Rollercoster ✎ — Personal Daily Diary Web Application

Rollercoster is a simple, elegant, minimal, responsive, and private personal daily diary web application built as a digital notebook for recording everyday life.

---

## Key Features

- **Digital Notebook Aesthetic**: Calm, personal, minimal interface featuring soft purple accents, warm pastels, clean typography, and a lined paper writing surface.
- **Unlimited Content**: Write freely with **no character limits**, **no word limits**, and **no counters**.
- **One Entry Per Day**: Database-enforced `UNIQUE(userId, date)` constraint guarantees one consolidated entry per date without unnecessary page pagination.
- **Home Dashboard Grid**: Displays previous entries as a clean, responsive grid of cards (3 columns on Desktop, 2 on Tablet, 1 on Mobile).
- **Dedicated Calendar Page**: Separate `/calendar` route allowing users to browse diary entries by month and inspect or write entries for any date.
- **Settings & Theme Engine**: Customize themes (Light / Dark / System), default Rollercoster soft purple palette, custom color pickers (Primary, Accent, Background, Text), fonts (Inter, Serif/Georgia, Lora, Playfair Display, Caveat Handwriting, Outfit, Monospace), and text sizes.
- **Focused Navigation**: Clean desktop sidebar and mobile hamburger navigation featuring ONLY Home, Calendar, New Entry, and Settings.
- **Data Privacy & Security**: User authentication powered by bcrypt password hashing, signed JWT cookies, and strict database query scoping.

---

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Next.js Node.js API Routes (REST API architecture)
- **Database & ORM**: PostgreSQL / SQLite with Prisma ORM
- **Authentication**: JWT tokens stored in HttpOnly cookies, bcryptjs password hashing

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### Installation

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-2026"
NODE_ENV="development"
PORT=3000
```

### Database Setup & Migration

Generate the Prisma client and push the schema to SQLite / PostgreSQL:
```bash
npx prisma db push
npx prisma generate
```

### Running the Application

Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running Automated Tests

Run the Rollercoster test suite covering authentication, entry creation, single-entry-per-day constraints, user data isolation, calendar queries, and preference updates:
```bash
npx tsx tests/test-runner.ts
```

---

## REST API Overview

- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Sign in user
- `POST /api/auth/logout` - Sign out user
- `GET  /api/auth/me` - Get current session
- `GET  /api/entries` - List/search entries
- `GET  /api/entries/recent` - Get cards preview for Home grid
- `POST /api/entries` - Create or upsert entry for date
- `GET  /api/entries/date/:date` - Get entry by date (YYYY-MM-DD)
- `GET  /api/entries/:id` - Get entry by ID
- `PUT  /api/entries/:id` - Update entry title/content/date
- `DELETE /api/entries/:id` - Delete entry
- `GET  /api/calendar/:year/:month` - Get dates with entries for calendar
- `GET  /api/preferences` - Get user appearance preferences
- `PUT  /api/preferences` - Update user theme & custom colors

For full API specifications, see [API_DOCUMENTATION.md](file:///c:/Users/kumar/OneDrive/Desktop/projects/Memory%20Bank/API_DOCUMENTATION.md).
