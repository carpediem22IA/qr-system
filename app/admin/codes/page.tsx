'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { supabase } from '@/lib/supabase'

type CodeItem = {

  id: number

  code: string

  batch: number

  used: boolean

  printed: boolean

  created_at: string

  printed_at: string | null

  redeemed_at: string | null
}

export default function CodesPage() {

  const [codes, setCodes] =
    useState<CodeItem[]>([])

  useEffect(() => {

    loadCodes()

  }, [])

  async function loadCodes() {

    const { data } =
      await supabase
        .from('codes')
        .select('*')
        .order('id', {
          ascending: true
        })

    if (data) {

      setCodes(data)
    }
  }

  return (

    <main className="p-10">

      <h1 className="text-4xl font-bold mb-8">

        Administración QR

      </h1>

      <div className="overflow-auto">

        <table className="w-full border">

          <thead>

            <tr className="bg-gray-200 text-black">

              <th className="border p-3">
                QR
              </th>

              <th className="border p-3">
                Lote
              </th>

              <th className="border p-3">
                Usado
              </th>

              <th className="border p-3">
                Impreso
              </th>

              <th className="border p-3">
                Fecha uso
              </th>

              <th className="border p-3">
                Acción
              </th>

            </tr>

          </thead>

          <tbody>

            {codes.map((qr) => (

              <tr
                key={qr.id}
                className="text-center"
              >

                <td className="border p-3">

                  QR #{qr.id}

                </td>

                <td className="border p-3">

                  {qr.batch}

                </td>

                <td className="border p-3">

                  {
                    qr.used
                      ? 'Sí'
                      : 'No'
                  }

                </td>

                <td className="border p-3">

                  {
                    qr.printed
                      ? 'Sí'
                      : 'No'
                  }

                </td>

                <td className="border p-3 text-sm">

                  {
                    qr.redeemed_at

                      ? new Date(
                          qr.redeemed_at
                        ).toLocaleString()

                      : '-'
                  }

                </td>

                <td className="border p-3">

                  <Link
                    href={`/admin/qr/${qr.id}`}
                    className="
                      bg-black
                      text-white
                      px-4
                      py-2
                      rounded-lg
                    "
                  >
                    Ver QR
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>
  )
}