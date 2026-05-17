import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data, error } = await supabase
    .from('codes')
    .select('*')

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Códigos QR
      </h1>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>

      {error && (
        <p>Error: {error.message}</p>
      )}
    </main>
  )
}