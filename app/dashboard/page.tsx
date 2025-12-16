'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const [bugs, setBugs] = useState<any[]>([])

  useEffect(() => {
    const fetchBugs = async () => {
      const { data, error } = await supabase.from('bugs').select('*')
      if (error) console.error(error)
      else setBugs(data)
    }
    fetchBugs()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mes bugs</h1>
      <Link href="/bugs/create" className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Ajouter un bug
      </Link>
      <ul>
        {bugs.map((bug) => (
          <li key={bug.id} className="border p-2 mb-2 rounded hover:bg-gray-100">
            <Link href={`/bugs/${bug.id}`}>
              <strong>{bug.title}</strong>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
