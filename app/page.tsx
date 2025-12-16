'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center gap-12 p-8 bg-white dark:bg-black rounded-xl shadow-md">
        <h1 className="text-4xl font-bold text-black dark:text-white text-center">
          Bienvenue sur BugMemo
        </h1>
        <p className="text-lg text-zinc-700 dark:text-zinc-300 text-center">
          Mémorisez facilement vos bugs, logs et solutions pour ne jamais oublier comment les résoudre.
        </p>
        <div className="flex gap-6">
          <Link
            href="/login"
            className="rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-blue-600 px-6 py-3 text-blue-600 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900 transition"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  )
}
