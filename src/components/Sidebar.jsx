import { Link, useNavigate, useLocation } from 'react-router-dom'

import {
  Home,
  Users,
  GraduationCap,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  ShieldCheck,
  User,
  BarChart3,
  Wallet,
  CreditCard,
  ClipboardList
} from 'lucide-react'

export default function Sidebar() {

  const navigate = useNavigate()
  const location = useLocation()

  const usuario = JSON.parse(
    localStorage.getItem('usuarioLogado')
  )

  function sair() {

    localStorage.removeItem(
      'usuarioLogado'
    )

    navigate('/login')

  }

  function ativo(path) {

    return location.pathname === path

  }

  return (

    <aside className="w-80 bg-gradient-to-b from-[#020817] via-[#081120] to-[#020817] text-white min-h-screen border-r border-green-500/20 shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden">

      {/* TOPO */}
      <div>

        {/* LOGO */}
        <div className="relative overflow-hidden border-b border-green-500/20">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.25),transparent_60%)]" />

          <div className="p-8 relative z-10">

            <h1 className="text-5xl font-black tracking-tight leading-none">

              <span className="text-white">
                AUTOESCOLA
              </span>

            </h1>

            <h2 className="text-4xl font-black text-green-400 leading-none mt-1">
              ONLINE
            </h2>

            <p className="text-zinc-400 mt-4 text-sm">
              Sistema Administrativo
            </p>

          </div>

        </div>

        {/* PERFIL */}
        <div className="p-6">

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl">

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">

                {
                  usuario?.tipo === 'admin'
                    ? <ShieldCheck className="text-white" size={30} />
                    : <User className="text-white" size={30} />
                }

              </div>

              <div>

                <h2 className="font-black text-xl text-white">
                  {usuario?.nome}
                </h2>

                <p className="text-zinc-400 capitalize">
                  {usuario?.tipo}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* MENUS */}
        <div className="px-6 pb-6 overflow-auto">

          {/* PRINCIPAL */}
          <div className="mb-8">

            <h3 className="text-green-400 font-black text-sm tracking-widest mb-4 uppercase">
              Principal
            </h3>

            <div className="space-y-3">

              <Link
                to="/"
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold group ${
                  ativo('/')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.5)]'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                }`}
              >

                <Home size={22} />

                Dashboard

              </Link>

              <Link
                to="/cadastro-profissional"
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold ${
                  ativo('/cadastro-profissional')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.5)]'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                }`}
              >

                <Users size={22} />

                Condutores

              </Link>

              <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-all duration-300 font-bold">

                <GraduationCap size={22} />

                Instrutores

              </button>

              <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-all duration-300 font-bold">

                <Calendar size={22} />

                Aulas

              </button>

            </div>

          </div>

          {/* FINANCEIRO */}
          <div className="mb-8">

            <h3 className="text-green-400 font-black text-sm tracking-widest mb-4 uppercase">
              Financeiro
            </h3>

            <div className="space-y-3">

              <Link
                to="/investimentos"
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold ${
                  ativo('/investimentos')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.5)]'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                }`}
              >

                <DollarSign size={22} />

                Financeiro

              </Link>

              <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-all duration-300 font-bold">

                <Wallet size={22} />

                Caixas

              </button>

              <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-all duration-300 font-bold">

                <CreditCard size={22} />

                Planos

              </button>

            </div>

          </div>

          {/* RELATÓRIOS */}
          <div className="mb-8">

            <h3 className="text-green-400 font-black text-sm tracking-widest mb-4 uppercase">
              Relatórios
            </h3>

            <div className="space-y-3">

              <Link
                to="/relatorios"
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold ${
                  ativo('/relatorios')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.5)]'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                }`}
              >

                <FileText size={22} />

                Relatórios

              </Link>

              <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-all duration-300 font-bold">

                <BarChart3 size={22} />

                Desempenho

              </button>

              <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-all duration-300 font-bold">

                <ClipboardList size={22} />

                Exportações

              </button>

            </div>

          </div>

          {/* CONFIG */}
          <div>

            <h3 className="text-green-400 font-black text-sm tracking-widest mb-4 uppercase">
              Configurações
            </h3>

            <div className="space-y-3">

              <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-all duration-300 font-bold">

                <Settings size={22} />

                Configurações

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* RODAPÉ */}
      <div className="p-6 border-t border-green-500/20">

        <button
          onClick={sair}
          className="w-full flex items-center justify-center gap-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 transition-all duration-300 p-5 rounded-2xl font-black shadow-lg hover:scale-[1.02]"
        >

          <LogOut size={22} />

          Sair do Sistema

        </button>

      </div>

    </aside>

  )

}