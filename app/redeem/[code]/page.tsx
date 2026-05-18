import { supabase } from '@/lib/supabase'

export default async function RedeemPage({
  params
}: {
  params: Promise<{
    code: string
  }>
}) {

  const { code } = await params

  const { data } = await supabase
    .from('codes')
    .select('*')
    .eq('code', code)
    .single()

  if (!data) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold">
          Código no válido
        </h1>
      </main>
    )
  }

  if (data.used) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold">
          Código ya utilizado
        </h1>
      </main>
    )
  }

  await supabase
    .from('codes')
    .update({
      used: true
    })
    .eq('id', data.id)

  return (
    <main className="p-10 text-center">

      <h1 className="text-4xl font-bold mb-6">
        Tu regalo está listo 🎁
      </h1>

      <p className="mb-8">
        Pulsa el botón para descargar.
      </p>

      <a
        href={`/api/download/${code}`}
        className="bg-black text-white px-6 py-4 rounded text-xl"
      >
       Descargar regalo
      </a>

    </main>
  )
}