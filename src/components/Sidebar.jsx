import { Link, useNavigate, useLocation } from 'react-router-dom'
import bannerImg from '../img/banner.png'

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
  CreditCard,
  ClipboardList,
  Car,
  Wallet,
  Kanban,
  Server,
  Banknote,
  X
} from 'lucide-react'

export default function Sidebar({ menuAberto, setMenuAberto }) {

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
    <>
      {/* OVERLAY MOBILE */}
      {menuAberto && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMenuAberto(false)}
        />
      )}

      <aside className={`${menuAberto ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-50 transition-transform duration-300 flex w-[270px] bg-gradient-to-b from-[#020817] via-[#081120] to-[#020817] text-white h-screen border-r border-green-500/10 shadow-[0_0_25px_rgba(0,0,0,0.35)] flex-col justify-between overflow-hidden`}>

        {/* TOPO */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">

          {/* LOGO */}
          <div className="relative border-b border-green-500/10 flex justify-between items-center pr-4">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_60%)] pointer-events-none" />

            <button 
              className="md:hidden text-zinc-400 p-2 hover:bg-white/10 rounded-lg absolute right-2 top-4 z-50"
              onClick={() => setMenuAberto(false)}
            >
              <X size={20} />
            </button>

          <div className="p-6 relative z-10 flex flex-col items-center">

            <img 
              src={bannerImg} 
              alt="Logo C.I.A.T" 
              className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(0,255,102,0.3)]"
            />

            <p className="text-zinc-400 mt-4 text-sm text-center">
              Sistema Administrativo
            </p>

          </div>

        </div>



        {/* PERFIL */}
        <div className="p-4">

          <div className="bg-[#0b1730] border border-white/5 rounded-2xl p-4 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-green-500 to-green-600 flex items-center justify-center shadow-lg">

                {
                  usuario?.tipo === 'admin'
                    ? (
                      <ShieldCheck
                        className="text-white"
                        size={22}
                        strokeWidth={2.2}
                      />
                    )
                    : (
                      <User
                        className="text-white"
                        size={22}
                        strokeWidth={2.2}
                      />
                    )
                }

              </div>

              <div>

                <h2 className="font-semibold text-base text-white leading-none">
                  {usuario?.nome}
                </h2>

                <p className="text-zinc-400 capitalize mt-1 text-xs">
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

            <h3 className="text-[#00ff66] font-semibold text-[11px] tracking-[3px] mb-4 uppercase">
              Principal
            </h3>

            <div className="space-y-2">

              <Link onClick={() => setMenuAberto(false)}
                to="/"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold ${
                  ativo('/')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_30px_rgba(0,255,80,0.25)]'
                    : 'bg-[#0b1730] hover:bg-[#12203d] text-zinc-300'
                }`}
              >

                <Home
                  size={18}
                  strokeWidth={2.2}
                />

                Dashboard

              </Link>

              <Link onClick={() => setMenuAberto(false)}
                to="/cadastro"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold ${
                  ativo('/cadastro')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_30px_rgba(0,255,80,0.25)]'
                    : 'bg-[#0b1730] hover:bg-[#12203d] text-zinc-300'
                }`}
              >

                <Users
                  size={18}
                  strokeWidth={2.2}
                />

                Cadastro de Alunos

              </Link>

              <Link onClick={() => setMenuAberto(false)}
                to="/cadastro-profissional"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold ${
                  ativo('/cadastro-profissional')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_30px_rgba(0,255,80,0.25)]'
                    : 'bg-[#0b1730] hover:bg-[#12203d] text-zinc-300'
                }`}
              >

                <GraduationCap
                  size={18}
                  strokeWidth={2.2}
                />

                Instrutores

              </Link>

              <Link onClick={() => setMenuAberto(false)}
                to="/agenda"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold ${
                  ativo('/agenda')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_30px_rgba(0,255,80,0.25)]'
                    : 'bg-[#0b1730] hover:bg-[#12203d] text-zinc-300'
                }`}
              >

                <Calendar
                  size={18}
                  strokeWidth={2.2}
                />

                Aulas

              </Link>

              <Link onClick={() => setMenuAberto(false)}
                to="/veiculos"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold ${
                  ativo('/veiculos')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_30px_rgba(0,255,80,0.25)]'
                    : 'bg-[#0b1730] hover:bg-[#12203d] text-zinc-300'
                }`}
              >

                <Car
                  size={18}
                  strokeWidth={2.2}
                />

                Frota (Veículos)

              </Link>

              <Link onClick={() => setMenuAberto(false)}
                to="/processos"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold ${
                  ativo('/processos')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_30px_rgba(0,255,80,0.25)]'
                    : 'bg-[#0b1730] hover:bg-[#12203d] text-zinc-300'
                }`}
              >

                <Kanban
                  size={18}
                  strokeWidth={2.2}
                />

                Processos (Kanban)

              </Link>

              <Link onClick={() => setMenuAberto(false)}
                to="/integracao-detran"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold ${
                  ativo('/integracao-detran')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_30px_rgba(0,255,80,0.25)]'
                    : 'bg-[#0b1730] hover:bg-[#12203d] text-zinc-300'
                }`}
              >
                <Server size={18} strokeWidth={2.2} />
                Integração DETRAN
              </Link>

              <Link onClick={() => setMenuAberto(false)}
                to="/financeiro"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold ${
                  ativo('/financeiro')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_30px_rgba(0,255,80,0.25)]'
                    : 'bg-[#0b1730] hover:bg-[#12203d] text-zinc-300'
                }`}
              >
                <Banknote size={18} strokeWidth={2.2} />
                Financeiro
              </Link>

              <Link onClick={() => setMenuAberto(false)}
                to="/instrutores"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold ${
                  ativo('/instrutores')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_30px_rgba(0,255,80,0.25)]'
                    : 'bg-[#0b1730] hover:bg-[#12203d] text-zinc-300'
                }`}
              >
                <Users size={18} strokeWidth={2.2} />
                Instrutores
              </Link>

            </div>

          </div>

          {/* FINANCEIRO */}
          <div className="mb-7">

            <h3 className="text-[#00ff66] font-semibold text-[11px] tracking-[3px] mb-4 uppercase">
              Financeiro
            </h3>

            <div className="space-y-2">

              <Link onClick={() => setMenuAberto(false)}
                to="/investimentos"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold ${
                  ativo('/investimentos')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_30px_rgba(0,255,80,0.25)]'
                    : 'bg-[#0b1730] hover:bg-[#12203d] text-zinc-300'
                }`}
              >

                <DollarSign
                  size={18}
                  strokeWidth={2.2}
                />

                Financeiro

              </Link>

              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0b1730] hover:bg-[#12203d] text-zinc-300 transition-all duration-300 font-semibold">

                <Wallet
                  size={18}
                  strokeWidth={2.2}
                />

                Caixas

              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0b1730] hover:bg-[#12203d] text-zinc-300 transition-all duration-300 font-semibold">

                <CreditCard
                  size={18}
                  strokeWidth={2.2}
                />

                Planos

              </button>

            </div>

          </div>

          {/* RELATÓRIOS */}
          <div className="mb-7">

            <h3 className="text-[#00ff66] font-semibold text-[11px] tracking-[3px] mb-4 uppercase">
              Relatórios
            </h3>

            <div className="space-y-2">

              <Link onClick={() => setMenuAberto(false)}
                to="/relatorios"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold ${
                  ativo('/relatorios')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_30px_rgba(0,255,80,0.25)]'
                    : 'bg-[#0b1730] hover:bg-[#12203d] text-zinc-300'
                }`}
              >

                <FileText
                  size={18}
                  strokeWidth={2.2}
                />

                Relatórios

              </Link>

              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0b1730] hover:bg-[#12203d] text-zinc-300 transition-all duration-300 font-semibold">

                <BarChart3
                  size={18}
                  strokeWidth={2.2}
                />

                Desempenho

              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0b1730] hover:bg-[#12203d] text-zinc-300 transition-all duration-300 font-semibold">

                <ClipboardList
                  size={18}
                  strokeWidth={2.2}
                />

                Exportações

              </button>

            </div>

          </div>

          {/* CONFIG */}
          <div>

            <h3 className="text-[#00ff66] font-semibold text-[11px] tracking-[3px] mb-4 uppercase">
              Configurações
            </h3>

            <div className="space-y-2">

              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0b1730] hover:bg-[#12203d] text-zinc-300 transition-all duration-300 font-semibold">

                <Settings
                  size={18}
                  strokeWidth={2.2}
                />

                Configurações

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* RODAPÉ */}
      <div className="p-4 border-t border-green-500/10">

        <button
          onClick={sair}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 transition-all duration-300 px-4 py-3 rounded-xl font-semibold shadow-lg"
        >

          <LogOut
            size={18}
            strokeWidth={2.2}
          />

          Sair do Sistema

        </button>

      </div>

    </aside>
    </>

  )

}
