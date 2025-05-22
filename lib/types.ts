// lib/types.ts

export type UserProfile = {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

export type Chat = {
  participants: unknown
  id: string
  name: string
  last_message: string
  updated_at: string
}

export type Message = {
  id: string
  chat_id: string
  sender_id: string
  sender_name: string
  msg: string
  created_at: string
}


