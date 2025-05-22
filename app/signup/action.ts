'use server'

import { supabaseServer } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'


export async function signup(prevState: unknown, formData: FormData) {
  const supabase = await supabaseServer()

  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = (formData.get('password') as string)?.trim()

  if (!name || !email || !password) {
    return { message: 'All fields are required.' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      }
    }
  })

  if (error) {
    return { message: error.message }
  }

  redirect('/chats')
}
