# Periskope

## Overview

**Periskope** is a real-time chat application built as a monorepo. The frontend is a Next.js app while the backend is a lightweight Go service that exposes REST and WebSocket APIs. It features user authentication, instant messaging and online presence.

## Features

* Real-time one-on-one messaging
* User authentication (signup/login/logout with JWT)
* User profiles (display name, avatar, online/offline status)
* Typing indicator and online presence
* Chat sidebar with unread message counts
* Responsive design with light/dark mode
* Modern, minimal UI (Tailwind CSS, Radix UI, React Icons)

## Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* Go 1.21+

### Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/hsraktu17/talkative.git
   cd talkative
   ```

2. **Install frontend dependencies:**

   ```bash
   npm install --workspace apps/frontend
   ```

3. **Build the Go backend:**

   ```bash
   cd apps/backend
   go build ./cmd/server
   ```

   The backend uses [GORM](https://gorm.io) with a SQLite database. Models are
   defined in `internal/models` and migrated automatically at startup. Messages
   store a `status` field using an enum (`sent` or `read`).

### Environment Variables

Copy `.env.example` and adjust values:

```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

`apps/frontend/.env.example` contains:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Backend uses `JWT_SECRET` to sign tokens (default "secret" if unset).

### Running Locally

Start the Go server:

```bash
cd apps/backend
./server
```

Start the Next.js app:

```bash
npm run dev --workspace apps/frontend
```

Open <http://localhost:3000> in your browser.

## License

This project is licensed under the [MIT License](LICENSE).

