import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-screen w-full justify-center items-center">
      <div className="flex flex-col gap-4 items-start border rounded-lg p-8 w-full max-w-xl shadow-md">

        <h1 className="text-3xl ">Bem vindo!!!</h1>
        <div className="flex flex-col gap-4">
          <Link
            to="/signup"
            className="rounded-md bg-green-500 py-2 px-4 text-white hover:bg-green-700"
          >
            Criar uma conta
          </Link>

          <Link
            to="/signin"
            className="rounded-md border text-gray-700 py-2 px-4  hover:bg-gray-100"
          >
            Entrar
          </Link>

          <Link
            to="/search"
            className="rounded-md bg-blue-500 py-2 px-4 text-white"
          >
            Buscar por profissionais
          </Link>
        </div>
      </div>
    </div>
  )
}
