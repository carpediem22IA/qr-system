'use client'

import {
  useEffect,
  useState
} from 'react'

import { useParams }
  from 'next/navigation'

import { supabase }
  from '@/lib/supabase'

type QRData = {

  id: number

  code: string

  batch: number

  used: boolean

  printed: boolean

  created_at: string

  printed_at: string | null

  redeemed_at: string | null
}

export default function QRPage() {

  const params =
    useParams()

  const [qr, setQr] =
    useState<QRData | null>(null)

  useEffect(() => {

    loadQR()

  }, [])

  async function loadQR() {

    const { data } =
      await supabase
        .from('codes')
        .select('*')
        .eq(
        'id',
        params.id
       )
        .single()

    if (data) {

      setQr(data)
    }
  }

  if (!qr) {

    return (

      <main className="
       min-h-screen
       bg-gray-100
       text-black
       p-10
      ">

        Cargando QR...

      </main>
    )
  }

  return (

    <main className="
     min-h-screen
     bg-gray-100
     text-black
     p-10
     max-w-2xl
     mx-auto
    ">

      <h1 className="text-4xl font-bold mb-8">

        QR #{qr.id}

      </h1>

      <div className="
        border
        rounded-xl
        p-8
        text-center
	bg-white
      ">

        <p className="mb-2">

          Lote {qr.batch}

        </p>

        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://qr-system-two.vercel.app/redeem/${qr.code}`}
          alt={qr.code}
          className="
            mx-auto
            w-72
            mb-6
          "
        />

        <p className="font-bold text-2xl mb-6">

          {qr.code}

        </p>

        <div className="
          text-left
          space-y-3
        ">

          <p>

            <strong>
              Usado:
            </strong>

            {
              qr.used
                ? ' Sí'
                : ' No'
            }

          </p>

          <p>

            <strong>
              Impreso:
            </strong>

            {
              qr.printed
                ? ' Sí'
                : ' No'
            }

          </p>

          <p>

            <strong>
              Fecha creación:
            </strong>

            {' '}

            {
              new Date(
                qr.created_at
              ).toLocaleString()
            }

          </p>

          <p>

            <strong>
              Fecha impresión:
            </strong>

            {' '}

            {
              qr.printed_at

                ? new Date(
                    qr.printed_at
                  ).toLocaleString()

                : '-'
            }

          </p>

          <p>

            <strong>
              Fecha uso:
            </strong>

            {' '}

            {
              qr.redeemed_at

                ? new Date(
                    qr.redeemed_at
                  ).toLocaleString()

                : '-'
            }

          </p>

        </div>

      </div>

    </main>
  )
}