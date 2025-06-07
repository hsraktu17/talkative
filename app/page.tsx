'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">

      <nav className="flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Image src="/globe.svg" width={32} height={32} alt="logo" className="invert" />
          <span className="font-bold text-2xl bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">talkative</span>
        </div>
        <div>
          <Link
            href="/login"
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-black px-5 py-2 rounded-full font-semibold transition"
          >
            Login
          </Link>
        </div>
      </nav>


      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent animate-fadeIn">
          The Future of Chat
        </h1>
        <p className="text-gray-300 max-w-2xl md:text-lg">
          Connect instantly with cutting-edge real-time messaging built on Next.js, Tailwind CSS and Supabase.
        </p>
        <Link
          href="/login"
          className="mt-2 inline-block bg-gradient-to-r from-purple-500 to-green-500 hover:to-purple-600 hover:from-green-600 text-black text-lg font-semibold px-8 py-3 rounded-full transition"
        >
          Get Started
        </Link>
      </main>


      <footer className="py-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} talkative. Made for the SDE1 assignment.
      </footer>
    </div>
  );
}
