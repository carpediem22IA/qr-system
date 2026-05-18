export default function LoginPage() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        Login Administrador
      </h1>

      <form className="flex flex-col gap-4 max-w-md">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="border p-3 rounded"
        />

        <button
          className="bg-black text-white p-3 rounded"
        >
          Iniciar sesión
        </button>
      </form>
    </main>
  )
}