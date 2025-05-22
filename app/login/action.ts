'use server'

import { supabaseServer } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'


export async function login(prevState: unknown, formData: FormData) {
  const supabase = await supabaseServer()
  const user = await supabase.auth.getUser()
  console.log("user", user)

  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = (formData.get('password') as string)?.trim()

  if (!email || !password) {
    return { message: 'Email and password are required.' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { message: error.message }
  }

  redirect('/chats')
}
