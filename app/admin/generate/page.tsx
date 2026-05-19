'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import QRCode from 'qrcode'

function generateCode(length = 6) {

  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  let result = ''

  for (let i = 0; i < length; i++) {

    result += chars.charAt(
      Math.floor(
        Math.random() * chars.length
      )
    )
  }

  return result
}

export default function GeneratePage() {

  const [amount, setAmount] =
    useState(20)

  const [loading, setLoading] =
    useState(false)

  const [qrList, setQrList] = useState<
  {
    id: number
    code: string
    qrUrl: string
    redeemUrl: string
  }[]
>([])

  const [generatedBatch, setGeneratedBatch] =
  useState<number | null>(null)

  async function generateQRs() {

  if (
    !confirm(
      `¿Generar ${amount} códigos QR?`
    )
  ) {
    return
  }

  setLoading(true)
  const { data: lastBatchData } =
  await supabase
    .from('codes')
    .select('batch')
    .order('batch', {
      ascending: false
    })
    .limit(1)

const newBatch =

  lastBatchData &&
  lastBatchData.length > 0

    ? lastBatchData[0].batch + 1

    : 1
    setGeneratedBatch(newBatch)

  const newList = []

  for (let i = 0; i < amount; i++) {

    const code =
      generateCode()

    const redeemUrl =
      `https://qr-system-two.vercel.app/redeem/${code}`

 const { data } =
  await supabase
    .from('codes')
    .insert([
      {
        code,
        used: false,
        batch: newBatch,
        printed: false,
        download_url:
  'https://wpgovdftvvakscbuaedh.supabase.co/storage/v1/object/public/Downloads/4f8e6cdc-e138-42e9-bb9e-71c9c7eb2ee5.png'
      }
    ])
    .select()
    .single()

    const qrUrl =
      await QRCode.toDataURL(
        redeemUrl,
        {
          width: 300,
          margin: 1
        }
      )

   newList.push({
     id: inserted.id,
     code,
     redeemUrl,
     qrUrl
   })
  }

  setQrList(newList)

  localStorage.setItem(
    'qr-batch',
    JSON.stringify(newList)
  )

  setLoading(false)
}

  return (

    <main className="p-10">

      <h1 className="text-4xl font-bold mb-8">
        Generador Profesional QR
      </h1>

      <div className="flex gap-4 mb-8">

 <select
  value={amount}
  onChange={(e) =>
    setAmount(
      Number(e.target.value)
    )
  }
  className="border p-3 rounded"
>

  <option value={20}>
    20 QR
  </option>

  <option value={40}>
    40 QR
  </option>

  <option value={60}>
    60 QR
  </option>

  <option value={80}>
    80 QR
  </option>

  <option value={100}>
    100 QR
  </option>

</select>

        <button
          onClick={generateQRs}
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded"
        >
          {
            loading
              ? 'Generando...'
              : 'Generar QR'
          }
        </button>
	<a
         href="/admin/print"
         className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
         Vista impresión
        </a>

      </div>
      {
  generatedBatch && (

    <div className="mb-8 p-4 border rounded-lg">

      <p className="font-bold text-lg">
        Lote {generatedBatch} generado
      </p>

      <p>
        QR del {
          qrList[0]?.id
        } al {
          qrList[
            qrList.length - 1
          ]?.id
        }
      </p>

    </div>

  )
}

      <div
        id="qr-grid"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"
      >

        {qrList.map((qr) => (

          <div
            key={qr.code}
            className="border p-4 rounded-lg text-center"
          >

            <img
              src={qr.qrUrl}
              alt={qr.code}
              className="mx-auto mb-2 w-24"
            />

	    <p className="text-sm">
             Lote {generatedBatch}
            </p>

	    <p className="font-bold">
             QR #{qr.id}
	    </p>

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