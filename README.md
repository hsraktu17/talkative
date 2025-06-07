# Periskope

## Overview

**Periskope** is a real-time web-based chat application built with Next.js (React), Tailwind CSS, and Supabase. It features user authentication, instant messaging, online status, and an intuitive modern UI. The project demonstrates full-stack chat functionality suitable for learning, prototyping, or building your own scalable messenger.

## Features

* Real-time one-on-one messaging (using Supabase Realtime)
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
* Supabase account ([https://supabase.com/](https://supabase.com/))

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

3. **Configure Supabase:**

   * Create a new project in Supabase.
   * Enable Email/Password Auth.
   * Create these tables in your Supabase SQL editor:

     ```sql
     create table profiles (
       id uuid primary key references auth.users(id),
       display_name text,
       email text,
       avatar_url text,
       last_seen timestamp
     );

     create table chats (
       id uuid primary key default gen_random_uuid(),
       user1_id uuid references profiles(id),
       user2_id uuid references profiles(id),
       updated_at timestamp default now()
     );

     create table messages (
       id uuid primary key default gen_random_uuid(),
       chat_id uuid references chats(id),
       sender_id uuid references profiles(id),
       content text,
       created_at timestamp default now(),
       read boolean default false
     );
     ```
   * Disable Row Level Security (RLS) for quick testing, or add appropriate RLS policies for production use.

4. **Set up environment variables:**

   * Create a `.env.local` file in the root:

     ```bash
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```
   * Get these values from your Supabase project dashboard.

5. **Run the app:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   * Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

* **Signup/Login**: Register with your email and password. Log in to access the chat UI.
* **Chat**: Start a chat with another registered user. Messages sync in real time between browsers.
* **Typing & Presence**: See when a user is online and typing. Unread counts show new messages.
* **Responsive**: Works well on desktop and mobile. Supports dark and light themes.

## Planned Todos

- [x]   Real-time one-on-one messaging (using Supabase Realtime)
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

