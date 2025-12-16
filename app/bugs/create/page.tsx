'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function CreateBugPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [errorLog, setErrorLog] = useState('')
  const [solution, setSolution] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.from('bugs').insert([{ title, error_log: errorLog, solution }])
    setLoading(false)
    if (error) console.error(error)
    else router.push('/dashboard')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Créer un bug</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Titre du bug"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <textarea
          placeholder="Logs du bug"
          value={errorLog}
          onChange={(e) => setErrorLog(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <textarea
          placeholder="Solution"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Chargement...' : 'Créer le bug'}
        </button>
      </form>
    </div>
  )
}
