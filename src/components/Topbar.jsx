import {
  Bell,
  Search,
  User,
  ChevronDown
} from 'lucide-react'

export default function Topbar() {

  return (

    <div className="h-20 bg-[#071120]/95 backdrop-blur-md border-b border-green-500/10 flex items-center justify-between px-8 shadow-[0_2px_15px_rgba(0,0,0,0.08)]">

      {/* ESQUERDA */}
      <div>

        <h1 className="text-2xl font-bold text-white tracking-tight">
          Autoescola Online
        </h1>

        <p className="text-zinc-400 text-sm mt-1">
          Sistema Administrativo
        </p>

      </div>

      {/* DIREITA */}
      <div className="flex items-center gap-4">

        {/* BUSCA */}
        <div className="w-[320px] h-12 rounded-xl bg-[#0b1730] border border-white/5 flex items-center px-4 gap-3 transition-all focus-within:border-green-500/40 focus-within:shadow-[0_0_15px_rgba(0,255,80,0.15)]">

          <Search
            className="text-zinc-400"
            size={18}
            strokeWidth={2.2}
          />

          <input
            placeholder="Buscar..."
            className="bg-transparent outline-none text-white w-full text-sm placeholder:text-zinc-500"
          />

        </div>

        {/* NOTIFICAÇÃO */}
        <div className="relative">

          <button className="w-12 h-12 rounded-xl bg-[#0b1730] border border-white/5 flex items-center justify-center text-white hover:bg-[#12203d] transition-all">

            <Bell
              size={18}
              strokeWidth={2.2}
            />

          </button>

          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-b from-green-500 to-green-600 text-white text-[10px] flex items-center justify-center font-bold shadow-lg">

            3

          </div>

        </div>

        {/* PERFIL */}
        <div className="h-12 px-4 rounded-xl bg-[#0b1730] border border-white/5 flex items-center gap-3 hover:bg-[#12203d] transition-all cursor-pointer">

          <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-green-500 to-green-600 flex items-center justify-center shadow-lg">

            <User
              className="text-white"
              size={16}
              strokeWidth={2.2}
            />

          </div>

          <div>

            <h2 className="text-white font-semibold text-sm leading-none">
              Admin
            </h2>

            <p className="text-zinc-400 text-[11px] mt-1">
              Administrador
            </p>

          </div>

          <ChevronDown
            className="text-white"
            size={16}
            strokeWidth={2.2}
          />

        </div>

      </div>

    </div>

  )

}