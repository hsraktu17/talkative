'use server'

import { supabaseServer } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

type State = { message?: string }

export async function signup(prevState: State | undefined, formData: FormData): Promise<State | undefined> {
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

  const supabase = await supabaseServer()
  const user = await supabase.auth.getUser()
  console.log("user", user)

  const { data, error } = await supabase.auth.signUp({
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

// Insert into 'profiles' table if user is returned immediately
if (data.user) {
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.user.id,
      display_name: name,
    })
  if (profileError) {
    return { message: 'Signup succeeded, but failed to create user profile.' }
  }
}

  redirect('/chats')
}
