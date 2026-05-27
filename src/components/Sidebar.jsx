import {
  Bell,
  Camera,
  Calendar,
  ChevronDown,
  CreditCard,
  FileText,
  Home,
  Mail,
  MapPin,
  Menu,
  Phone,
  Save,
  Search,
  User,
  Users
} from 'lucide-react'

export default function CadastroProfissional() {

  return (

    <div className="flex bg-[#edf1f7] min-h-screen">

      {/* CONTEÚDO */}
      <div className="flex-1">

        {/* TOPBAR */}
        <div className="bg-[#071120] border-b-4 border-green-500 px-10 py-5 flex items-center justify-between shadow-xl">

          <div className="flex items-center gap-6">

            <button className="w-14 h-14 rounded-2xl bg-[#0d1b30] border border-white/10 flex items-center justify-center text-white hover:bg-[#132542] transition">

              <Menu />

            </button>

            <div>

              <h1 className="text-4xl font-black text-white">
                Cadastro de Condutores
              </h1>

            </div>

          </div>

          <div className="flex items-center gap-5">

            {/* BUSCA */}
            <div className="bg-[#0d1b30] border border-white/10 rounded-2xl px-5 h-14 flex items-center gap-4 w-[420px]">

              <Search className="text-zinc-400" />

              <input
                placeholder="Buscar..."
                className="bg-transparent outline-none text-white w-full"
              />

            </div>

            {/* NOTIFICAÇÃO */}
            <div className="relative">

              <button className="w-14 h-14 rounded-2xl bg-[#0d1b30] border border-white/10 flex items-center justify-center text-white">

                <Bell />

              </button>

              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-7 h-7 rounded-full flex items-center justify-center font-black">

                3

              </div>

            </div>

            {/* PERFIL */}
            <div className="flex items-center gap-4 bg-[#0d1b30] border border-white/10 rounded-2xl px-5 py-2">

              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">

                <User className="text-zinc-700" />

              </div>

              <div>

                <h2 className="font-black text-white">
                  Administrador
                </h2>

                <p className="text-zinc-400 text-sm">
                  Admin
                </p>

              </div>

              <ChevronDown className="text-white" />

            </div>

          </div>

        </div>

        {/* PAGE */}
        <div className="p-8">

          {/* CARD */}
          <div className="bg-white rounded-[30px] shadow-[0_0_40px_rgba(0,0,0,0.08)] overflow-hidden border border-zinc-200">

            {/* HEADER */}
            <div className="px-8 pt-8 pb-5 flex items-center justify-between">

              <div>

                <div className="flex items-center gap-3 text-zinc-500 mb-4">

                  <Home size={18} />

                  <span>Home</span>

                  <span>›</span>

                  <span className="text-green-600 font-bold">
                    Condutores
                  </span>

                  <span>›</span>

                  <span>Cadastro</span>

                </div>

                <h1 className="text-5xl font-black text-[#081120]">
                  Cadastro de Condutor
                </h1>

                <p className="text-zinc-500 text-lg mt-2">
                  Preencha todos os dados do condutor
                </p>

              </div>

              <button className="bg-green-500 hover:bg-green-400 transition-all text-white font-black px-8 py-5 rounded-2xl shadow-[0_0_25px_rgba(34,197,94,0.4)] flex items-center gap-4">

                <Save />

                Salvar Condutor

              </button>

            </div>

            {/* TABS */}
            <div className="px-8">

              <div className="flex gap-1 border-b border-zinc-200 overflow-auto">

                <button className="bg-gradient-to-b from-green-500 to-green-600 text-white px-10 py-5 rounded-t-2xl font-black flex items-center gap-3 shadow-lg whitespace-nowrap">

                  <Users />

                  Dados Pessoais

                </button>

                <button className="px-10 py-5 font-black text-[#081120] flex items-center gap-3 whitespace-nowrap">

                  <MapPin />

                  Endereço

                </button>

                <button className="px-10 py-5 font-black text-[#081120] flex items-center gap-3 whitespace-nowrap">

                  <CreditCard />

                  Documentos

                </button>

                <button className="px-10 py-5 font-black text-[#081120] flex items-center gap-3 whitespace-nowrap">

                  <FileText />

                  Financeiro

                </button>

                <button className="px-10 py-5 font-black text-[#081120] flex items-center gap-3 whitespace-nowrap">

                  <Mail />

                  Observações

                </button>

              </div>

            </div>

            {/* FORM */}
            <div className="p-8">

              {/* FOTO + CAMPOS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* FOTO */}
                <div className="lg:col-span-3">

                  <div className="border-2 border-dashed border-green-400 rounded-[30px] p-8 h-full relative flex flex-col items-center justify-center bg-zinc-50">

                    <button className="absolute top-5 right-5 w-16 h-16 rounded-full bg-green-500 shadow-[0_0_25px_rgba(34,197,94,0.5)] flex items-center justify-center text-white">

                      <Camera />

                    </button>

                    <div className="w-36 h-36 rounded-full bg-zinc-200 flex items-center justify-center">

                      <User size={70} className="text-zinc-400" />

                    </div>

                    <h2 className="text-3xl font-black mt-8 text-[#081120]">
                      Adicionar Foto
                    </h2>

                    <p className="text-zinc-500 mt-2">
                      JPG, PNG (máx. 3MB)
                    </p>

                  </div>

                </div>

                {/* CAMPOS */}
                <div className="lg:col-span-9">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>

                      <label className="font-black text-[#081120] mb-2 block">
                        Nome completo *
                      </label>

                      <div className="relative">

                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />

                        <input
                          placeholder="Digite o nome completo"
                          className="w-full h-16 rounded-2xl border border-[#cdd5e1] pl-14 pr-5 outline-none focus:border-green-500"
                        />

                      </div>

                    </div>

                    <div>

                      <label className="font-black text-[#081120] mb-2 block">
                        CPF *
                      </label>

                      <div className="relative">

                        <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />

                        <input
                          placeholder="000.000.000-00"
                          className="w-full h-16 rounded-2xl border border-[#cdd5e1] pl-14 pr-5 outline-none focus:border-green-500"
                        />

                      </div>

                    </div>

                    <div>

                      <label className="font-black text-[#081120] mb-2 block">
                        RG
                      </label>

                      <input
                        placeholder="00.000.000-0"
                        className="w-full h-16 rounded-2xl border border-[#cdd5e1] px-5 outline-none focus:border-green-500"
                      />

                    </div>

                    <div>

                      <label className="font-black text-[#081120] mb-2 block">
                        RENACH
                      </label>

                      <input
                        placeholder="Digite o RENACH"
                        className="w-full h-16 rounded-2xl border border-[#cdd5e1] px-5 outline-none focus:border-green-500"
                      />

                    </div>

                    <div>

                      <label className="font-black text-[#081120] mb-2 block">
                        Sexo *
                      </label>

                      <select className="w-full h-16 rounded-2xl border border-[#cdd5e1] px-5 outline-none focus:border-green-500">

                        <option>
                          Selecione o sexo
                        </option>

                        <option>
                          Masculino
                        </option>

                        <option>
                          Feminino
                        </option>

                      </select>

                    </div>

                    <div>

                      <label className="font-black text-[#081120] mb-2 block">
                        Data de nascimento *
                      </label>

                      <div className="relative">

                        <input
                          type="date"
                          className="w-full h-16 rounded-2xl border border-[#cdd5e1] px-5 outline-none focus:border-green-500"
                        />

                        <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400" />

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}