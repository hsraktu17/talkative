'use server'

import { login as apiLogin } from '@/utils/api/auth'
import { redirect } from 'next/navigation'

export async function login(_: unknown, formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = (formData.get('password') as string)?.trim()
  if (!email || !password) {
    return { message: 'Email and password are required.' }
  }
  try {
    await apiLogin(email, password)
  } catch (e: unknown) {
    return { message: e instanceof Error ? e.message : 'Login failed' }
  }
  redirect('/chats')
}
