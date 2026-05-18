'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

function generateCode(length = 6) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(
      Math.floor(Math.random() * chars.length)
    )
  }

  return result
}

export default function GeneratePage() {
  const [amount, setAmount] = useState(20)
  const [loading, setLoading] =
  useState(false)

  const [qrList, setQrList] = useState<
    {
      code: string
      qrUrl: string
      redeemUrl: string
    }[]
  >([])

  async function generateQRs() {
    if (
  !confirm(
    `¿Generar ${amount} códigos QR?`
     )
   ) {
     return
   }

   setLoading(true)

    const newList = []

    for (let i = 0; i < amount; i++) {
      const code = generateCode()

      const redeemUrl =
        `https://qr-system-two.vercel.app/redeem/${code}`

      await supabase.from('codes').insert([
        {
          code,
          used: false,
          download_url:
            'https://wpgovdftvvakscbuaedh.supabase.co/storage/v1/object/public/Downloads/4f8e6cdc-e138-42e9-bb9e-71c9c7eb2ee5.png'
        }
      ])

      const qrUrl =
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(redeemUrl)}`

      newList.push({
        code,
        redeemUrl,
        qrUrl
      })
    }

    setQrList(newList)

    setLoading(false)
  }

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        Generador Profesional QR
      </h1>

      <div className="flex gap-4 mb-8">
        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(Number(e.target.value))
          }
          className="border p-3 rounded w-32"
        />

        <button
          onClick={generateQRs}
	  disabled={loading}
          className="bg-black text-white px-6 py-3 rounded"
        >
          Generar QR
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {qrList.map((qr) => (
          <div
            key={qr.code}
            className="border p-4 rounded-lg text-center"
          >
            <img
              src={qr.qrUrl}
              alt={qr.code}
              className="mx-auto mb-4"
            />

            <p className="font-bold text-lg">
              {qr.code}
            </p>

            <p className="text-xs break-all mt-2">
              {qr.redeemUrl}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}