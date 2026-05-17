export default function QRPage() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        QR de prueba
      </h1>

      <img
        src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://qr-system-two.vercel.app/redeem/ABC123"
        alt="QR"
      />

      <p className="mt-4">
        QR funcionando
      </p>
    </main>
  )
}