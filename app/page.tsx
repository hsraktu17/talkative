'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa] dark:bg-[#111b21]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#222e35] border-b border-gray-200 dark:border-[#2a3942]">
        <div className="flex items-center space-x-2">
          {/* Replace with your logo if you have one */}
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">P</div>
          <span className="font-semibold text-xl text-[#111b21] dark:text-white">Periskope</span>
        </div>
        <div>
          <Link
            href="/login"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-[#111b21] dark:text-white mb-4 text-center">
          Welcome to <span className="text-green-600">Periskope</span> Chat!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl text-center mb-8">
          Experience modern, lightning-fast messaging with a pixel-perfect, real-time chat app built on Next.js, Tailwind CSS, and Supabase.
        </p>
        <Link
          href="/login"
          className="inline-block bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-8 py-3 rounded-full transition"
        >
          Get Started
        </Link>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-400 dark:text-gray-500">
        &copy; {new Date().getFullYear()} Periskope. Made for the SDE1 assignment.
      </footer>
    </div>
  );
}
