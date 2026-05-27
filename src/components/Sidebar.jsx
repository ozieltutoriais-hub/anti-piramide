import { Link, useNavigate } from 'react-router-dom'

import {
  Home,
  Users,
  DollarSign,
  FileText,
  LogOut,
  ShieldCheck,
  User
} from 'lucide-react'

export default function Sidebar() {

  const navigate = useNavigate()

  const usuario = JSON.parse(
    localStorage.getItem('usuarioLogado')
  )

  function sair() {

    localStorage.removeItem(
      'usuarioLogado'
    )

    navigate('/login')
  }

  return (

    <aside className="w-72 bg-white border-r border-zinc-200 p-6 min-h-screen flex flex-col justify-between shadow-xl">

      <div>

        <div className="mb-10">

          <h1 className="text-4xl font-black text-green-600">
            e-condutor
          </h1>

          <p className="text-zinc-500 mt-2">
            Sistema Administrativo
          </p>

        </div>

        <div className="bg-zinc-100 rounded-3xl p-5 border border-zinc-200 mb-8">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">

              {
                usuario?.tipo === 'admin'
                  ? <ShieldCheck className="text-white" size={28} />
                  : <User className="text-white" size={28} />
              }

            </div>

            <div>

              <h2 className="font-black text-lg text-zinc-700">
                {usuario?.nome}
              </h2>

              <p className="text-zinc-500 text-sm capitalize">
                {usuario?.tipo}
              </p>

            </div>

          </div>

        </div>

        <div className="space-y-4">

          <Link
            to="/"
            className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white transition p-4 rounded-2xl font-bold shadow"
          >
            <Home size={20} />
            Dashboard
          </Link>

          {
            usuario?.tipo === 'admin' && (
              <>

                <Link
                  to="/cadastro-profissional"
                  className="flex items-center gap-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition p-4 rounded-2xl font-semibold"
                >
                  <Users size={20} />
                  Cadastro
                </Link>

                <Link
                  to="/relatorios"
                  className="flex items-center gap-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition p-4 rounded-2xl font-semibold"
                >
                  <FileText size={20} />
                  Relatórios
                </Link>

              </>
            )
          }

          <Link
            to="/investimentos"
            className="flex items-center gap-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition p-4 rounded-2xl font-semibold"
          >
            <DollarSign size={20} />
            Financeiro
          </Link>

        </div>

      </div>

      <button
        onClick={sair}
        className="flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white transition p-4 rounded-2xl font-bold mt-10"
      >

        <LogOut size={20} />

        Sair do Sistema

      </button>

    </aside>

  )
}