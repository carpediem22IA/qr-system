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

  const [page, setPage] =
  useState(1)

  const ITEMS_PER_PAGE = 20

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

  const startIndex =
  (page - 1) * ITEMS_PER_PAGE

  const endIndex =
  startIndex + ITEMS_PER_PAGE

  const paginatedCodes =
  codes.slice(
    startIndex,
    endIndex
  )

  const totalPages =

  Math.max(
    1,

    Math.ceil(
      codes.length /
      ITEMS_PER_PAGE
    )
  )

  return (

    <main className="
     min-h-screen
     bg-gray-100
     text-black
     p-10
    ">

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

           {paginatedCodes.map((qr, index) => (

              <tr
 		 key={qr.id}

  		className={`
 		   text-center

  		  ${
  		    qr.used && qr.printed

   	          ? 'bg-green-100 font-bold'

     		   : qr.id % 2 === 0

       	   ? 'bg-gray-100'

       	   : 'bg-white'
  	  }
 	 `}
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

  <div
    className="
      flex
      gap-2
      justify-center
    "
  >

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

    {
      qr.used && (

        <button

          onClick={async () => {

            const confirmed =

              confirm(

                `¿Resetear uso del QR #${qr.id}?`
              )

            if (!confirmed) {

              return
            }

            await supabase
              .from('codes')
              .update({

                used: false,

                redeemed_at: null
              })
              .eq('id', qr.id)

            loadCodes()
          }}

          className="
            bg-red-600
            text-white
            px-4
            py-2
            rounded-lg
          "
        >

          Reset

        </button>
      )
    }

  </div>

</td>
</tr>
            ))}

          </tbody>

        </table>

        <div className="
  flex
  justify-center
  items-center
  gap-4
  mt-8
">

  <button
    onClick={() =>
      setPage(page - 1)
    }

    disabled={
  codes.length === 0 ||
  page === 1
}

    className="
      bg-black
      text-white
      px-4
      py-2
      rounded
      disabled:opacity-30
    "
  >
    Anterior
  </button>

  <p className="font-bold">

    Página {page} de {totalPages}

  </p>

  <button
    onClick={() =>
      setPage(page + 1)
    }

   disabled={
  codes.length === 0 ||
  page === totalPages
}

    className="
      bg-black
      text-white
      px-4
      py-2
      rounded
      disabled:opacity-30
    "
  >
    Siguiente
  </button>

</div>

      </div>

    </main>
  )
}