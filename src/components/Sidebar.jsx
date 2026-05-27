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

    <aside className="w-[290px] bg-gradient-to-b from-[#020817] via-[#081120] to-[#020817] text-white min-h-screen border-r border-green-500/20 shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden">

      {/* TOPO */}
      <div>

        {/* LOGO */}
        <div className="relative overflow-hidden border-b border-green-500/20">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.25),transparent_60%)]" />

          <div className="p-6 relative z-10">

            <h1 className="text-[42px] font-black tracking-tight leading-none">

              <span className="text-white">
                AUTOESCOLA
              </span>

            </h1>

            <h2 className="text-[34px] font-black text-[#00ff66] leading-none mt-1">
              ONLINE
            </h2>

            <p className="text-zinc-400 mt-4 text-sm">
              Sistema Administrativo
            </p>

          </div>

        </div>

        {/* BANNER */}
        <div className="px-4 pt-4">

          <div className="rounded-2xl overflow-hidden border border-green-500/20 shadow-[0_0_25px_rgba(34,197,94,0.15)]">

            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
              alt="banner"
              className="w-full h-40 object-cover"
            />

          </div>

        </div>

        {/* PERFIL */}
        <div className="p-4">

          <div className="bg-[#0b1730] border border-white/10 rounded-2xl p-4 shadow-xl">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">

                {
                  usuario?.tipo === 'admin'
                    ? <ShieldCheck className="text-white" size={28} />
                    : <User className="text-white" size={28} />
                }

              </div>

              <div>

                <h2 className="font-black text-lg text-white leading-none">
                  {usuario?.nome}
                </h2>

                <p className="text-zinc-400 capitalize mt-1 text-sm">
                  {usuario?.tipo}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* MENUS */}
        <div className="px-4 pb-6 overflow-auto">

          {/* PRINCIPAL */}
          <div className="mb-7">

            <h3 className="text-[#00ff66] font-black text-xs tracking-[3px] mb-4 uppercase">
              Principal
            </h3>

            <div className="space-y-3">

              <Link
                to="/"
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-bold ${
                  ativo('/')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.5)]'
                    : 'bg-[#0b1730] hover:bg-[#12203d] text-zinc-300'
                }`}
              >

                <Home size={20} />

                Dashboard

              </Link>

              <Link
                to="/cadastro-profissional"
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-bold ${
                  ativo('/cadastro-profissional')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.5)]'
                    : 'bg-[#0b1730] hover:bg-[#12203d] text-zinc-300'
                }`}
              >

                <Users size={20} />

                Condutores

              </Link>

              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-[#0b1730] hover:bg-[#12203d] text-zinc-300 transition-all duration-300 font-bold">

                <GraduationCap size={20} />

                Instrutores

              </button>

              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-[#0b1730] hover:bg-[#12203d] text-zinc-300 transition-all duration-300 font-bold">

                <Calendar size={20} />

                Aulas

              </button>

            </div>

          </div>

          {/* FINANCEIRO */}
          <div className="mb-7">

            <h3 className="text-[#00ff66] font-black text-xs tracking-[3px] mb-4 uppercase">
              Financeiro
            </h3>

            <div className="space-y-3">

              <Link
                to="/investimentos"
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-bold ${
                  ativo('/investimentos')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.5)]'
                    : 'bg-[#0b1730] hover:bg-[#12203d] text-zinc-300'
                }`}
              >

                <DollarSign size={20} />

                Financeiro

              </Link>

              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-[#0b1730] hover:bg-[#12203d] text-zinc-300 transition-all duration-300 font-bold">

                <Wallet size={20} />

                Caixas

              </button>

              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-[#0b1730] hover:bg-[#12203d] text-zinc-300 transition-all duration-300 font-bold">

                <CreditCard size={20} />

                Planos

              </button>

            </div>

          </div>

          {/* RELATÓRIOS */}
          <div className="mb-7">

            <h3 className="text-[#00ff66] font-black text-xs tracking-[3px] mb-4 uppercase">
              Relatórios
            </h3>

            <div className="space-y-3">

              <Link
                to="/relatorios"
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-bold ${
                  ativo('/relatorios')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.5)]'
                    : 'bg-[#0b1730] hover:bg-[#12203d] text-zinc-300'
                }`}
              >

                <FileText size={20} />

                Relatórios

              </Link>

              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-[#0b1730] hover:bg-[#12203d] text-zinc-300 transition-all duration-300 font-bold">

                <BarChart3 size={20} />

                Desempenho

              </button>

              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-[#0b1730] hover:bg-[#12203d] text-zinc-300 transition-all duration-300 font-bold">

                <ClipboardList size={20} />

                Exportações

              </button>

            </div>

          </div>

          {/* CONFIG */}
          <div>

            <h3 className="text-[#00ff66] font-black text-xs tracking-[3px] mb-4 uppercase">
              Configurações
            </h3>

            <div className="space-y-3">

              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-[#0b1730] hover:bg-[#12203d] text-zinc-300 transition-all duration-300 font-bold">

                <Settings size={20} />

                Configurações

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* RODAPÉ */}
      <div className="p-4 border-t border-green-500/20">

        <button
          onClick={sair}
          className="w-full flex items-center justify-center gap-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 transition-all duration-300 px-4 py-4 rounded-xl font-black shadow-lg"
        >

          <LogOut size={20} />

          Sair do Sistema

        </button>

      </div>

    </aside>

  )

}U