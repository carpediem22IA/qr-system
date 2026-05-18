import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      code: string
    }>
  }
) {

  const { code } = await context.params

  const { data } = await supabase
    .from('codes')
    .select('*')
    .eq('code', code)
    .single()

  if (!data) {

    return new Response(
      'Código no válido',
      {
        status: 404
      }
    )
  }

  const fileResponse = await fetch(
    data.download_url
  )

  if (!fileResponse.ok) {

    return new Response(
      'Error descargando archivo',
      {
        status: 500
      }
    )
  }

  const fileBlob =
    await fileResponse.blob()

  return new Response(fileBlob, {

    headers: {

      'Content-Type':
        fileResponse.headers.get(
          'Content-Type'
        ) || 'application/octet-stream',

      'Content-Disposition':
        'attachment; filename="regalo"'
    }
  })
}