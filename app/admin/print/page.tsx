'use client'

import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'

type QRItem = {
  id: number
  code: string
  batch: number
}

export default function PrintPage() {

  const [batches, setBatches] =
    useState<number[]>([])

  const [selectedBatch, setSelectedBatch] =
    useState<number | null>(null)

  const [qrList, setQrList] =
    useState<QRItem[]>([])

  const [showConfirm, setShowConfirm] =
  useState(false)

  useEffect(() => {

    loadBatches()

  }, [])

 async function loadBatches() {

  const { data } =
    await supabase
      .from('codes')
      .select('*')

  if (!data) return

  const uniqueBatches =

    [...new Set(
      data.map(item => item.batch)
    )]

    .sort((a, b) => a - b)

  setBatches(uniqueBatches)

  // buscar lotes NO impresos

  const unprinted = data.filter(
    item => !item.printed
  )

  if (unprinted.length > 0) {

    // obtener último lote no impreso

    const firstUnprintedBatch =

  Math.min(
    ...unprinted.map(
      item => item.batch
    )
  )

loadBatch(
  firstUnprintedBatch
)

  } else if (
    uniqueBatches.length > 0
  ) {

    // si todos impresos,
    // cargar último lote

    loadBatch(
      uniqueBatches[
        uniqueBatches.length - 1
      ]
    )
  }
}

  async function loadBatch(
    batch: number
  ) {

    setSelectedBatch(batch)

    const { data } =
      await supabase
        .from('codes')
        .select('*')
        .eq('batch', batch)
        .order('id', {
        ascending: true
        })

    if (data) {

      setQrList(data)
    }
  }

  async function confirmPrint() {

  if (!selectedBatch) return

  const { error } =
    await supabase
      .from('codes')
      .update({
        printed: true,
        printed_at:
          new Date()
      })
      .match({
      batch: selectedBatch
     })

  if (error) {

    alert('Error actualizando lote')

    return
  }

  alert(
    `Lote ${selectedBatch} marcado como impreso`
  )

  setShowConfirm(false)
}

  return (

    <main className="
     min-h-screen
     bg-gray-100
     text-black
     p-10
    ">

      <div className="flex gap-4 mb-8 print:hidden">

        <select
          value={selectedBatch || ''}
          onChange={(e) =>
            loadBatch(
              Number(e.target.value)
            )
          }
          className="border p-3 rounded"
        >

          {batches.map((batch) => (

            <option
              key={batch}
              value={batch}
            >
              Lote {batch}
            </option>

          ))}

        </select>

        <button
          onClick={() => {

 	  window.print()

	  setShowConfirm(true)

	}}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Imprimir lote
        </button>
	{
	  showConfirm && (

  	  <button

           onClick={confirmPrint}

  	    className="
 	     bg-green-600
   	     text-white
  	     px-6
 	     py-3
	     rounded-lg
	   "
         >
          Confirmar impresión
         </button>

 	 )
	}

      </div>

      <div className="grid grid-cols-2 gap-8">

        {qrList.map((qr) => (

          <div
            key={qr.id}
            className="border p-6 rounded-xl text-center break-inside-avoid"
          >

            <div className="mb-3">

              <p className="text-sm">
                Lote {qr.batch}
              </p>

              <p className="font-bold">
                QR #{qr.id}
              </p>

            </div>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://qr-system-two.vercel.app/redeem/${qr.code}`}
              alt={qr.code}
              className="mx-auto w-40 mb-4"
            />

            <p className="font-bold text-lg">
              {qr.code}
            </p>

          </div>

        ))}

      </div>

    </main>
  )
}