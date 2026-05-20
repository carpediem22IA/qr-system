import Link from 'next/link'

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (

    <div className="min-h-screen bg-gray-100">

      <nav className="
        bg-white
        text-black
        px-8
        py-4
        flex
        gap-6
      ">

        <Link href="/admin">
          Dashboard
        </Link>

        <Link href="/admin/generate">
          Generar QR
        </Link>

        <Link href="/admin/print">
          Imprimir
        </Link>

        <Link href="/admin/codes">
          Códigos
        </Link>

      </nav>

      <div>

        {children}

      </div>

    </div>
  )
}