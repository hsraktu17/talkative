'use server'

import { supabaseServer } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(prevState: unknown, formData: FormData) {
  const supabase = await supabaseServer()

  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = (formData.get('password') as string)?.trim()

  if (!email || !password) {
    return { message: 'Email and password are required.' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { message: error.message }
  }

  // If login is successful, update profiles.last_seen
  const userId = data?.user?.id
  if (userId) {
    await supabase
      .from('profiles')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', userId)
  }

  redirect('/chats')
}
