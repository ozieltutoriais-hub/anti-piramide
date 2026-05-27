import { useState } from 'react'
import {
  Camera,
  Home,
  Users,
  FileText,
  DollarSign,
  Settings,
  LogOut
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

    <div className="flex min-h-screen bg-[#f4f4f4]">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#081120] text-white flex flex-col justify-between">

        <div>

          <div className="p-8 border-b border-zinc-800">

            <h1 className="text-4xl font-black text-yellow-400">
              AUTOESCOLA
            </h1>

            <p className="text-yellow-500 font-bold">
              ONLINE
            </p>

            <p className="text-zinc-500 mt-2">
              Sistema Administrativo
            </p>

          </div>

          <div className="p-5 space-y-3">

            <button className="w-full bg-yellow-500 text-black p-4 rounded-2xl font-bold flex items-center gap-3">
              <Home />
              Dashboard
            </button>

            <button className="w-full bg-[#131c31] hover:bg-[#1d2947] transition p-4 rounded-2xl flex items-center gap-3">
              <Users />
              Alunos
            </button>

            <button className="w-full bg-[#131c31] hover:bg-[#1d2947] transition p-4 rounded-2xl flex items-center gap-3">
              <DollarSign />
              Financeiro
            </button>

            <button className="w-full bg-[#131c31] hover:bg-[#1d2947] transition p-4 rounded-2xl flex items-center gap-3">
              <FileText />
              Relatórios
            </button>

            <button className="w-full bg-[#131c31] hover:bg-[#1d2947] transition p-4 rounded-2xl flex items-center gap-3">
              <Settings />
              Configurações
            </button>

          </div>

        </div>

        <div className="p-5">

          <button className="w-full bg-red-600 hover:bg-red-700 transition p-4 rounded-2xl font-bold flex items-center justify-center gap-3">
            <LogOut />
            Sair do Sistema
          </button>

        </div>

      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-8">

        {/* TOPO */}
        <div className="bg-gradient-to-r from-[#081120] to-yellow-600 rounded-3xl p-6 flex items-center justify-between mb-8 shadow-xl">

          <div>

            <h1 className="text-4xl font-black text-white">
              Cadastro de Aluno
            </h1>

            <p className="text-zinc-200 mt-2">
              Preencha os dados do aluno
            </p>

          </div>

          <button className="bg-yellow-400 hover:bg-yellow-500 transition text-black font-black px-8 py-4 rounded-2xl">
            Salvar Cadastro
          </button>

        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* ABAS */}
          <div className="flex gap-8 border-b pb-5 mb-8 overflow-auto">

            <button className="text-yellow-500 font-black border-b-4 border-yellow-500 pb-3">
              Dados Pessoais
            </button>

            <button className="text-zinc-500 font-bold">
              Endereço
            </button>

            <button className="text-zinc-500 font-bold">
              Documentos
            </button>

            <button className="text-zinc-500 font-bold">
              Financeiro
            </button>

            <button className="text-zinc-500 font-bold">
              Observações
            </button>

          </div>

          {/* FOTO + FORM */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* FOTO */}
            <div>

              <div className="border-2 border-dashed border-yellow-400 rounded-3xl h-80 flex flex-col items-center justify-center bg-zinc-50">

                <Camera
                  size={80}
                  className="text-yellow-500"
                />

                <p className="mt-4 text-zinc-500 font-bold">
                  Adicionar Foto
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
                  className="border p-4 rounded-2xl"
                />

                <input
                  name="cpf"
                  placeholder="CPF"
                  onChange={handleChange}
                  className="border p-4 rounded-2xl"
                />

                <input
                  name="rg"
                  placeholder="RG"
                  onChange={handleChange}
                  className="border p-4 rounded-2xl"
                />

                <input
                  name="renach"
                  placeholder="RENACH"
                  onChange={handleChange}
                  className="border p-4 rounded-2xl"
                />

                <select
                  className="border p-4 rounded-2xl"
                >
                  <option>Sexo</option>
                  <option>Masculino</option>
                  <option>Feminino</option>
                </select>

                <input
                  type="date"
                  className="border p-4 rounded-2xl"
                />

              </div>

            </div>

          </div>

          {/* ENDEREÇO */}
          <div className="mt-10">

            <h2 className="text-2xl font-black mb-5 text-zinc-700">
              Endereço
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

              <input
                placeholder="CEP"
                className="border p-4 rounded-2xl"
              />

              <input
                placeholder="Logradouro"
                className="border p-4 rounded-2xl md:col-span-2"
              />

              <input
                placeholder="Número"
                className="border p-4 rounded-2xl"
              />

              <input
                placeholder="Bairro"
                className="border p-4 rounded-2xl"
              />

              <input
                placeholder="Cidade"
                className="border p-4 rounded-2xl"
              />

              <select
                className="border p-4 rounded-2xl"
              >
                <option>UF</option>
                <option>SP</option>
                <option>RJ</option>
              </select>

            </div>

          </div>

          {/* CONTATO */}
          <div className="mt-10">

            <h2 className="text-2xl font-black mb-5 text-zinc-700">
              Contato e acesso
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <input
                placeholder="Telefone"
                className="border p-4 rounded-2xl"
              />

              <input
                placeholder="Celular"
                className="border p-4 rounded-2xl"
              />

              <input
                placeholder="Email"
                className="border p-4 rounded-2xl"
              />

            </div>

          </div>

          {/* OBS */}
          <div className="mt-10">

            <h2 className="text-2xl font-black mb-5 text-zinc-700">
              Observações
            </h2>

            <textarea
              placeholder="Observações do aluno..."
              className="w-full border p-5 rounded-2xl h-40"
            />

          </div>

        </div>

      </main>

    </div>

  )
}