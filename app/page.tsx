'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '../lib/supabase'

export default function Home() {
  const router = useRouter()
  const [checkingUser, setCheckingUser] = useState(true)

  const supabase = getSupabaseClient()!

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error(error)
          setCheckingUser(false)
          return
        }

        if (session?.user) {
          router.replace('/dashboard')
        } else {
          setCheckingUser(false)
        }
      } catch (err) {
        console.error('Erreur session:', err)
        setCheckingUser(false)
      }
    }

    checkUser()
  }, [router])

  if (checkingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    )
  }

  const features = [
    { 
      icon: '🐛', 
      title: 'Suivez vos bugs', 
      description: 'Documentez et organisez tous vos bugs avec leurs logs et erreurs',
      color: 'from-orange-500 to-red-500'
    },
    { 
      icon: '💡', 
      title: 'Solutions sauvegardées', 
      description: 'Retrouvez instantanément vos solutions et gagnez du temps',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      icon: '🔍', 
      title: 'Recherche rapide', 
      description: 'Trouvez vos bugs en quelques secondes grâce aux filtres intelligents',
      color: 'from-blue-500 to-purple-500'
    }
  ]

  const stats = [
    { value: '100%', label: 'Gratuit' },
    { value: '∞', label: 'Bugs illimités' },
    { value: '⚡', label: 'Rapide & Simple' }
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Effet de fond animé */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Logo animé */}
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl shadow-blue-500/30 animate-bounce">
            <span className="text-4xl">🐛</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold mb-10">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
              Bug Memo
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-100 max-w-2xl mx-auto px-4">
            Ne perdez plus de temps à chercher cette erreur que vous avez déjà résolue.
            Centralisez tous vos bugs et leurs solutions en un seul endroit.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            href="/auth/register"
            className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative z-10">Commencer</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
          </Link>

          <Link
            href="/auth/login"
            className="px-8 py-4 rounded-xl border-2 border-gray-600 hover:border-blue-500 text-gray-300 hover:text-white hover:bg-gray-800/50 font-semibold transition-all duration-300"
          >
            Se connecter
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-16 w-full max-w-3xl">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-4 bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all"
            >
              <div className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-3 gap-6 w-full max-w-5xl px-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm p-6 sm:p-8 rounded-2xl text-center border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl"
            >
              {/* Icon avec gradient background */}
              <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                <span className="text-3xl">{feature.icon}</span>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>

              {/* Effet de brillance au survol */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm mb-4">
            @2026 Bug Memo. Tous droits réservés.
          </p>
        </div>
      </main>

      {/* Décoration de fond */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
    </div>
  )
}