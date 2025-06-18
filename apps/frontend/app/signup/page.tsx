'use client'

import { useActionState } from 'react'
import { signup } from './action'
import Link from 'next/link'

type State = { message?: string }
const initialState: State = {}

export default function SignupPage() {
  const signupHandler = async (_: State, formData: FormData): Promise<State> => {
    return (await signup(undefined, formData)) ?? {}
  }

  const [state, formAction, pending] = useActionState<State, FormData>(signupHandler, initialState)

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa] dark:bg-[#111b21]">
      {/* Navbar */}
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
          <h1 className="text-2xl font-bold mb-2 text-center text-[#111b21] dark:text-white">Sign up for Periskope</h1>
          <p className="text-gray-400 text-sm text-center mb-2">Create your account to join the chat.</p>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full rounded-lg px-4 py-2 bg-[#f7f8fa] dark:bg-[#2a3942] text-[#111b21] dark:text-white placeholder-gray-400 focus:outline-none"
              required
              autoComplete="name"
            />
          </div>
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
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="••••••••"
              className="w-full rounded-lg px-4 py-2 bg-[#f7f8fa] dark:bg-[#2a3942] text-[#111b21] dark:text-white placeholder-gray-400 focus:outline-none"
              required
              minLength={6}
              autoComplete="new-password"
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
            {pending ? 'Signing up...' : 'Sign up'}
          </button>
          <div className="mt-5 text-gray-400 text-xs text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-green-400 underline hover:text-green-500">Login</Link>
          </div>
        </form>
      </main>

      <footer className="py-4 text-center text-xs text-gray-400 dark:text-gray-500">
        &copy; {new Date().getFullYear()} Periskope. Made for the SDE1 assignment.
      </footer>
    </div>
  )
}
