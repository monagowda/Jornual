# Rollercoster — Simple Personal Daily Diary 🎢📖

**Rollercoster** is a simple, beautiful, minimal, and responsive personal digital diary web application designed for a single user.

It runs entirely client-side in the browser using **IndexedDB** for persistent local data storage. No login, server, REST API, or external database is required.

---

## ✨ Features

- **No Authentication & Zero Backend**: Open the application and start writing immediately.
- **Local Browser Persistence (IndexedDB)**: All diary entries survive page refreshes, browser restarts, and offline usage.
- **One Entry Per Date**: Strict 1-entry-per-day architecture. Opening or saving an entry for a date automatically edits that day's entry.
- **Unlimited Writing Canvas**: No artificial word count limits or character counters.
- **Home Page Grid**: Displays time-aware greetings (*"Good morning! 🌻"*), quick "+ New Entry" button, live search, and a responsive card grid (Desktop 3-cols, Tablet 2-cols, Mobile 1-col).
- **Separate Calendar View**: Browse past entries by date with month navigation and visual entry indicators.
- **Appearance & Color Customization**:
  - Light / Dark / System modes.
  - Default calm pastel purple theme.
  - Interactive **Custom Color Palette** pickers (Primary, Accent, Background, Cards, Text, Highlight).
  - Typography options (Sans, Serif, Mono, Handwriting) and font sizes.
- **JSON Backup Export & Import**: Download `rollercoster-diary-backup-[DATE].json` or restore previously exported diary backups.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18, Tailwind CSS, Lucide React Icons
- **Storage**: Browser IndexedDB (`RollercosterDB`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your system.

### Installation & Local Run

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/rollercoster-diary.git
   cd rollercoster-diary
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Static Build & Deployment

Build for production deployment (Vercel, Netlify, Cloudflare Pages, GitHub Pages):

```bash
npm run build
```

---

## 🔒 Privacy & Storage Notice

> **"Your diary is stored locally in this browser. Export your diary regularly to keep a backup."**
