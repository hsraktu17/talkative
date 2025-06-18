# Periskope

## Overview

**Periskope** is a real-time web-based chat application built with Next.js (React) and a Go backend. It features user authentication, instant messaging, online status, and an intuitive modern UI. The project demonstrates full-stack chat functionality suitable for learning, prototyping, or building your own scalable messenger.

## Features

* Real-time one-on-one messaging (WebSocket based)
* User authentication (signup/login/logout with email and password)
* User profiles (display name, avatar, online/offline status)
* Typing indicator and online presence
* Chat sidebar with unread message counts
* Responsive design with light/dark mode
* Modern, minimal UI (Tailwind CSS, Radix UI, React Icons)

## Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn
* Go toolchain (1.21 or newer)

### Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/hsraktu17/talkative.git
   cd talkative
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

   This will also set up Husky git hooks for running lint checks on commits.

3. **Set up environment variables:**

   * Create a `.env` file in the project root and define:

     ```bash
     JWT_SECRET=devsecret
     ADDR=:8080
     ```

4. **Run the apps:**

   In separate terminals run:

   ```bash
   npm run backend
   npm run frontend
   ```

  * Frontend will be on [http://localhost:3000](http://localhost:3000).

### Backend

The Go server lives in `apps/backend`. You can build it with:

```bash
go build ./apps/backend/cmd/server
```

Or run directly using the workspace script `npm run backend`.

## Usage

* **Signup/Login**: Register with your email and password. Log in to access the chat UI.
* **Chat**: Start a chat with another registered user. Messages sync in real time between browsers.
* **Typing & Presence**: See when a user is online and typing. Unread counts show new messages.
* **Responsive**: Works well on desktop and mobile. Supports dark and light themes.

## Planned Todos

- [x]   Real-time one-on-one messaging (WebSocket backend)
- [x]   User authentication (signup/login/logout with email and password)
- [x]   User profiles (display name, avatar, online/offline status)
- [x]   Typing indicator and online presence
- [x]   Chat sidebar with unread message counts
- [x]   Modern, minimal UI (Tailwind CSS, Radix UI, React Icons)
- [ ]   Group Chat (multi-user, group avatar, member management)
- [ ]   Theme Toggle (switch between dark/light modes, save preference)
- [ ]   Chat Wallpaper (select/upload wallpapers, apply per chat)
- [ ]   Media Upload (image/file/video upload, encryption, previews)
- [ ]   Broadcasting Messages (send to multiple users at once)
- [ ]   End-to-End Encryption (client-side encryption of all messages/media)

## License

This project is licensed under the [MIT License](LICENSE).

