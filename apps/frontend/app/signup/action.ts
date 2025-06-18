'use server'

import { signup as apiSignup } from '@/utils/api/auth'
import { redirect } from 'next/navigation'

type State = { message?: string }

export async function signup(prev: State | undefined, formData: FormData): Promise<State | undefined> {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = (formData.get('password') as string)?.trim()
  const confirmPassword = (formData.get('confirm_password') as string)?.trim()
  if (!name || !email || !password || !confirmPassword) {
    return { message: 'All fields are required.' }
  }
  if (password !== confirmPassword) {
    return { message: "Passwords don't match." }
  }
  try {
    await apiSignup(name, email, password)
  } catch (e: unknown) {
    return { message: e instanceof Error ? e.message : 'Signup failed' }
  }
  redirect('/chats')
}
