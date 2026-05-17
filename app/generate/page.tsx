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

export default async function GeneratePage() {
  const code = generateCode()

  const redeemUrl =
    `http://127.0.0.1:3000/redeem/${code}`

  await supabase.from('codes').insert([
    {
      code,
      used: false,
      download_url:
        'https://example.com/regalo.zip'
    }
  ])

  const qrUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(redeemUrl)}`

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        QR generado
      </h1>

      <p className="mb-4">
        Código:
        <strong className="ml-2">
          {code}
        </strong>
      </p>

      <img
        src={qrUrl}
        alt="QR"
        className="mb-6"
      />

      <p className="text-sm text-gray-600">
        {redeemUrl}
      </p>
    </main>
  )
}