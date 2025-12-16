'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function BugPage() {
  const { id } = useParams() // récupère l'id de la route
  const [bug, setBug] = useState<any>(null)

  useEffect(() => {
    const fetchBug = async () => {
      const { data, error } = await supabase
        .from('bugs')
        .select('*')
        .eq('id', id)
        .single()

      if (error) console.error(error)
      else setBug(data)
    }

    fetchBug()
  }, [id])

  if (!bug) return <p>Chargement...</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{bug.title}</h1>
      <p><strong>Logs :</strong> {bug.error_log}</p>
      <p><strong>Solution :</strong> {bug.solution}</p>
    </div>
  )
}
