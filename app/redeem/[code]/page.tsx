import { supabase } from '@/lib/supabase'

type Props = {
  params: Promise<{
    code: string
  }>
}

export default async function RedeemPage({ params }: Props) {
  const { code } = await params

  const { data, error } = await supabase
    .from('codes')
    .select('*')
    .eq('code', code)
    .single()

  if (error || !data) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold text-red-600">
          Código no válido
        </h1>
      </main>
    )
  }

  if (data.used) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold text-orange-600">
          Código ya utilizado
        </h1>
      </main>
    )
  }

  await supabase
    .from('codes')
    .update({
      used: true,
      used_at: new Date().toISOString()
    })
    .eq('code', code)

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-green-600 mb-6">
        Código válido
      </h1>

      <p className="mb-4">
        Descarga tu regalo digital:
      </p>

      <a
        href={data.download_url}
        className="text-blue-600 underline"
      >
        Descargar regalo
      </a>
    </main>
  )
}