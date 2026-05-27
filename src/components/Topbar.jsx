import {
  Bell,
  Search,
  User,
  ChevronDown
} from 'lucide-react'

export default function Topbar() {

  return (

    <div className="h-24 bg-[#071120] border-b border-green-500/20 flex items-center justify-between px-8 shadow-xl">

      {/* ESQUERDA */}
      <div>

        <h1 className="text-3xl font-black text-white">
          Autoescola Online
        </h1>

        <p className="text-zinc-400 text-sm mt-1">
          Sistema Administrativo
        </p>

      </div>

      {/* DIREITA */}
      <div className="flex items-center gap-5">

        {/* BUSCA */}
        <div className="w-[380px] h-14 rounded-xl bg-[#0b1730] border border-white/10 flex items-center px-5 gap-4">

          <Search className="text-zinc-400" />

          <input
            placeholder="Buscar..."
            className="bg-transparent outline-none text-white w-full"
          />

        </div>

        {/* NOTIFICAÇÃO */}
        <div className="relative">

          <button className="w-14 h-14 rounded-xl bg-[#0b1730] border border-white/10 flex items-center justify-center text-white">

            <Bell />

          </button>

          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-black">

            3

          </div>

        </div>

        {/* PERFIL */}
        <div className="h-14 px-4 rounded-xl bg-[#0b1730] border border-white/10 flex items-center gap-4">

          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">

            <User className="text-white" size={18} />

          </div>

          <div>

            <h2 className="text-white font-black leading-none">
              Admin
            </h2>

            <p className="text-zinc-400 text-xs mt-1">
              Administrador
            </p>

          </div>

          <ChevronDown className="text-white" size={18} />

        </div>

      </div>

    </div>

  )

}