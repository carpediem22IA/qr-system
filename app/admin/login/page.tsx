'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault()

    setError('')

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    if (error) {
      setError(error.message)
      return
    }

    router.push('/admin/dashboard')
  }

  return (
    <main className="
     min-h-screen
     bg-gray-100
     text-black
     p-10
   ">
      <h1 className="text-4xl font-bold mb-6">
        Login Administrador
      </h1>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 max-w-md"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="border p-3 rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="border p-3 rounded"
        />

        <button
          type="submit"
          className="bg-black text-white p-3 rounded"
        >
          Iniciar sesión
        </button>

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}
      </form>
    </main>
  )
}