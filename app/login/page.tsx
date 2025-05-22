'use client'

import { useActionState, useEffect } from 'react'

import Link from 'next/link'
import { login } from './action'
import { supabaseBrowser } from '@/utils/supabase/client'

type State = { message?: string }
const initialState: State = {}

export default function LoginPage() {
  const loginHandler = async (_: State, formData: FormData): Promise<State> => {
    return await login(undefined, formData)
  }

  const supabase =  supabaseBrowser()
  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      const user = await supabase.auth.getUser()
      console.log(user)
    }
    fetchUser()
  }, [supabase])

  const [state, formAction, pending] = useActionState<State, FormData>(loginHandler, initialState)

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa] dark:bg-[#111b21]">
      {/* Nav (optional, or use layout) */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#222e35] border-b border-gray-200 dark:border-[#2a3942]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">P</div>
          <span className="font-semibold text-xl text-[#111b21] dark:text-white">Periskope</span>
        </div>
        <div>
          <Link
            href="/"
            className="bg-gray-100 dark:bg-gray-700 text-[#222e35] dark:text-white px-4 py-2 rounded-lg hover:bg-gray-200 hover:dark:bg-gray-600 font-medium transition"
          >
            Home
          </Link>
        </div>
      </nav>

      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <form
          className="bg-white dark:bg-[#222e35] rounded-xl shadow-xl p-8 w-full max-w-md space-y-6"
          action={formAction}
          autoComplete="off"
        >
          <h1 className="text-2xl font-bold mb-2 text-center text-[#111b21] dark:text-white">Login to Periskope</h1>
          <p className="text-gray-400 text-sm text-center mb-2">Enter your credentials to access chats.</p>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              className="w-full rounded-lg px-4 py-2 bg-[#f7f8fa] dark:bg-[#2a3942] text-[#111b21] dark:text-white placeholder-gray-400 focus:outline-none"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full rounded-lg px-4 py-2 bg-[#f7f8fa] dark:bg-[#2a3942] text-[#111b21] dark:text-white placeholder-gray-400 focus:outline-none"
              required
              autoComplete="current-password"
            />
          </div>
          {state?.message && (
            <div className="text-red-500 text-sm text-center">{state.message}</div>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full mt-3 py-2 bg-green-600 rounded-lg text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {pending ? 'Logging in...' : 'Login'}
          </button>
          <div className="mt-5 text-gray-400 text-xs text-center">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-green-400 underline hover:text-green-500">Sign up</Link>
          </div>
        </form>
      </main>

      <footer className="py-4 text-center text-xs text-gray-400 dark:text-gray-500">
        &copy; {new Date().getFullYear()} Periskope. Made for the SDE1 assignment.
      </footer>
    </div>
  )
}
