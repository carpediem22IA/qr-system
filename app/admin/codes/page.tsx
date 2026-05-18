'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CodesPage() {

  const [codes, setCodes] = useState<any[]>([])

  async function loadCodes() {

    const { data } =
      await supabase
        .from('codes')
        .select('*')
        .order('id', {
          ascending: true
        })

    setCodes(data || [])
  }

  async function resetCode(id: number) {

    await supabase
      .from('codes')
      .update({
        used: false
      })
      .eq('id', id)

    loadCodes()
  }

  useEffect(() => {
    loadCodes()
  }, [])

  return (
    <main className="p-10">

      <h1 className="text-4xl font-bold mb-8">
        Gestión de Códigos QR
      </h1>

      <div className="overflow-x-auto">

        <table className="w-full border-collapse border">

          <thead>

            <tr className="bg-gray-200">

              <th className="border p-3">
                ID
              </th>

              <th className="border p-3">
                Código
              </th>

              <th className="border p-3">
                Estado
              </th>

              <th className="border p-3">
                Acción
              </th>

            </tr>

          </thead>

          <tbody>

            {codes.map((code) => (

              <tr key={code.id}>

                <td className="border p-3">
                  {code.id}
                </td>

                <td className="border p-3 font-bold">
                  {code.code}
                </td>

                <td className="border p-3">

                  {code.used
                    ? 'Usado'
                    : 'Libre'}

                </td>

                <td className="border p-3">

                  <button
                    onClick={() =>
                      resetCode(code.id)
                    }
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    Resetear
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>
  )
}