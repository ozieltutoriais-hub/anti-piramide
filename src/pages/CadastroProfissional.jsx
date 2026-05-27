```jsx
import { useState } from 'react'

import {
  Home,
  Users,
  GraduationCap,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
  Camera,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  Save
} from 'lucide-react'

export default function CadastroProfissional() {

  const [form, setForm] = useState({})

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  return (

    <div className="flex min-h-screen bg-[#f3f6fb]">

      {/* SIDEBAR */}
      <aside className="w-72 bg-gradient-to-b from-[#020817] via-[#081120] to-[#0a1324] text-white min-h-screen shadow-2xl border-r border-green-500/20 flex flex-col justify-between">

        <div>

          {/* LOGO */}
          <div className="p-6 border-b border-green-500/20">

            <h1 className="text-4xl font-black text-white leading-none">
              AUTOESCOLA
            </h1>

            <h2 className="text-3xl font-black text-green-400 leading-none mt-1">
              ONLINE
            </h2>

            <p className="text-zinc-400 mt-3 text-sm">
              Sistema Administrativo
            </p>

          </div>

          {/* MENU */}
          <div className="p-5 space-y-3">

            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl flex items-center gap-3 font-bold shadow-lg hover:scale-[1.02] transition-all">
              <Home size={22} />
              Dashboard
            </button>

            <button className="w-full bg-[#131c31] hover:bg-[#1b2742] p-4 rounded-2xl flex items-center gap-3 transition-all">
              <Users size={22} />
              Condutores
            </button>

            <button className="w-full bg-[#131c31] hover:bg-[#1b2742] p-4 rounded-2xl flex items-center gap-3 transition-all">
              <GraduationCap size={22} />
              Instrutores
            </button>

            <button className="w-full bg-[#131c31] hover:bg-[#1b2742] p-4 rounded-2xl flex items-center gap-3 transition-all">
              <Calendar size={22} />
              Aulas
            </button>

            <button className="w-full bg-[#131c31] hover:bg-[#1b2742] p-4 rounded-2xl flex items-center gap-3 transition-all">
              <DollarSign size={22} />
              Financeiro
            </button>

            <button className="w-full bg-[#131c31] hover:bg-[#1b2742] p-4 rounded-2xl flex items-center gap-3 transition-all">
              <FileText size={22} />
              Relatórios
            </button>

            <button className="w-full bg-[#131c31] hover:bg-[#1b2742] p-4 rounded-2xl flex items-center gap-3 transition-all">
              <Settings size={22} />
              Configurações
            </button>

          </div>

        </div>

        {/* SAIR */}
        <div className="p-5">

          <button className="w-full bg-red-600 hover:bg-red-700 transition-all p-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg">
            <LogOut size={22} />
            Sair do Sistema
          </button>

        </div>

      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 overflow-auto">

        {/* TOPBAR */}
        <div className="bg-[#081120] border-b-4 border-green-500 px-8 py-5 flex items-center justify-between shadow-xl">

          <h1 className="text-4xl font-black text-white">
            Cadastro de Condutores
          </h1>

          <div className="flex items-center gap-5">

            <div className="bg-[#131c31] rounded-2xl px-5 py-3 flex items-center gap-3 border border-green-500/20">

              <Search className="text-zinc-400" />

              <input
                placeholder="Buscar..."
                className="bg-transparent outline-none text-white"
              />

            </div>

            <div className="relative">

              <Bell className="text-white" size={28} />

              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                3
              </div>

            </div>

            <div className="flex items-center gap-3 bg-[#131c31] p-3 rounded-2xl border border-green-500/20">

              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <User className="text-white" />
              </div>

              <div>
                <h2 className="text-white font-bold">
                  Administrador
                </h2>

                <p className="text-zinc-400 text-sm">
                  Admin
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* CONTEÚDO */}
        <div className="p-8">

          {/* CARD PRINCIPAL */}
          <div className="bg-white rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.08)] border border-zinc-200 overflow-hidden">

            {/* HEADER */}
            <div className="p-8 border-b border-zinc-200 flex items-center justify-between">

              <div>

                <h1 className="text-5xl font-black text-[#081120]">
                  Cadastro de Condutor
                </h1>

                <p className="text-zinc-500 mt-2 text-lg">
                  Preencha todos os dados do condutor
                </p>

              </div>

              <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 transition-all duration-300 text-white font-black px-8 py-5 rounded-2xl shadow-lg flex items-center gap-3 hover:scale-[1.03]">
                <Save />
                Salvar Condutor
              </button>

            </div>

            {/* TABS */}
            <div className="px-8 pt-6">

              <div className="flex gap-3 overflow-auto border-b border-zinc-200 pb-5">

                <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg whitespace-nowrap">
                  Dados Pessoais
                </button>

                <button className="bg-zinc-100 hover:bg-zinc-200 transition px-8 py-4 rounded-2xl font-bold text-zinc-700 whitespace-nowrap">
                  Endereço
                </button>

                <button className="bg-zinc-100 hover:bg-zinc-200 transition px-8 py-4 rounded-2xl font-bold text-zinc-700 whitespace-nowrap">
                  Documentos
                </button>

                <button className="bg-zinc-100 hover:bg-zinc-200 transition px-8 py-4 rounded-2xl font-bold text-zinc-700 whitespace-nowrap">
                  CNH
                </button>

                <button className="bg-zinc-100 hover:bg-zinc-200 transition px-8 py-4 rounded-2xl font-bold text-zinc-700 whitespace-nowrap">
                  Financeiro
                </button>

                <button className="bg-zinc-100 hover:bg-zinc-200 transition px-8 py-4 rounded-2xl font-bold text-zinc-700 whitespace-nowrap">
                  Observações
                </button>

              </div>

            </div>

            {/* FORM */}
            <div className="p-8">

              {/* FOTO + DADOS */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* FOTO */}
                <div>

                  <div className="border-2 border-dashed border-green-400 rounded-3xl h-80 flex flex-col items-center justify-center bg-zinc-50 relative overflow-hidden">

                    <div className="absolute top-5 right-5 bg-green-500 w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
                      <Camera className="text-white" />
                    </div>

                    <User size={90} className="text-zinc-300" />

                    <h2 className="mt-5 font-black text-zinc-700 text-xl">
                      Adicionar Foto
                    </h2>

                    <p className="text-zinc-500 mt-2">
                      JPG, PNG
                    </p>

                  </div>

                </div>

                {/* CAMPOS */}
                <div className="lg:col-span-3">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <input
                      name="nome"
                      placeholder="Nome completo"
                      onChange={handleChange}
                      className="w-full border-2 border-zinc-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all p-4 rounded-2xl bg-white"
                    />

                    <input
                      name="cpf"
                      placeholder="CPF"
                      onChange={handleChange}
                      className="w-full border-2 border-zinc-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all p-4 rounded-2xl bg-white"
                    />

                    <input
                      name="rg"
                      placeholder="RG"
                      onChange={handleChange}
                      className="w-full border-2 border-zinc-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all p-4 rounded-2xl bg-white"
                    />

                    <input
                      name="renach"
                      placeholder="RENACH"
                      onChange={handleChange}
                      className="w-full border-2 border-zinc-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all p-4 rounded-2xl bg-white"
                    />

                    <select className="w-full border-2 border-zinc-200 focus:border-green-500 outline-none transition-all p-4 rounded-2xl bg-white">
                      <option>Sexo</option>
                      <option>Masculino</option>
                      <option>Feminino</option>
                    </select>

                    <input
                      type="date"
                      className="w-full border-2 border-zinc-200 focus:border-green-500 outline-none transition-all p-4 rounded-2xl bg-white"
                    />

                  </div>

                </div>

              </div>

              {/* ENDEREÇO */}
              <div className="mt-12">

                <h2 className="text-3xl font-black text-[#081120] mb-6 flex items-center gap-3">
                  <MapPin className="text-green-500" />
                  Endereço
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                  <input
                    placeholder="CEP"
                    className="w-full border-2 border-zinc-200 focus:border-green-500 outline-none transition-all p-4 rounded-2xl bg-white"
                  />

                  <input
                    placeholder="Logradouro"
                    className="w-full border-2 border-zinc-200 focus:border-green-500 outline-none transition-all p-4 rounded-2xl bg-white md:col-span-2"
                  />

                  <input
                    placeholder="Número"
                    className="w-full border-2 border-zinc-200 focus:border-green-500 outline-none transition-all p-4 rounded-2xl bg-white"
                  />

                  <input
                    placeholder="Bairro"
                    className="w-full border-2 border-zinc-200 focus:border-green-500 outline-none transition-all p-4 rounded-2xl bg-white"
                  />

                  <input
                    placeholder="Cidade"
                    className="w-full border-2 border-zinc-200 focus:border-green-500 outline-none transition-all p-4 rounded-2xl bg-white"
                  />

                  <select className="w-full border-2 border-zinc-200 focus:border-green-500 outline-none transition-all p-4 rounded-2xl bg-white">
                    <option>UF</option>
                    <option>SP</option>
                    <option>RJ</option>
                    <option>MG</option>
                  </select>

                </div>

              </div>

              {/* CONTATO */}
              <div className="mt-12">

                <h2 className="text-3xl font-black text-[#081120] mb-6 flex items-center gap-3">
                  <Phone className="text-green-500" />
                  Contato e Acesso
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                  <input
                    placeholder="Telefone"
                    className="w-full border-2 border-zinc-200 focus:border-green-500 outline-none transition-all p-4 rounded-2xl bg-white"
                  />

                  <input
                    placeholder="Celular"
                    className="w-full border-2 border-zinc-200 focus:border-green-500 outline-none transition-all p-4 rounded-2xl bg-white"
                  />

                  <input
                    placeholder="Email"
                    className="w-full border-2 border-zinc-200 focus:border-green-500 outline-none transition-all p-4 rounded-2xl bg-white"
                  />

                </div>

              </div>

              {/* OBS */}
              <div className="mt-12">

                <h2 className="text-3xl font-black text-[#081120] mb-6 flex items-center gap-3">
                  <CreditCard className="text-green-500" />
                  Observações Gerais
                </h2>

                <textarea
                  placeholder="Digite observações sobre o condutor..."
                  className="w-full border-2 border-zinc-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all p-5 rounded-2xl bg-white h-44"
                />

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>

  )

}
```
