import { useState } from 'react'

import {
  Users,
  MapPin,
  Phone,
  CreditCard,
  Camera,
  Save,
  User
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

    <div className="p-8 bg-[#f3f6fb] min-h-screen">

      {/* CARD PRINCIPAL */}
      <div className="bg-white rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.08)] border border-zinc-200 overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#081120] via-[#33240f] to-[#d18a00] p-8 flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-black text-white">
              Cadastro de Aluno
            </h1>

            <p className="text-zinc-200 mt-2 text-lg">
              Preencha todos os dados do aluno
            </p>

          </div>

          <button className="bg-yellow-400 hover:bg-yellow-300 transition-all duration-300 text-black font-black px-8 py-5 rounded-2xl shadow-lg flex items-center gap-3 hover:scale-[1.03]">
            <Save />
            Salvar Cadastro
          </button>

        </div>

        {/* TABS */}
        <div className="px-8 pt-8">

          <div className="flex gap-4 overflow-auto border-b border-zinc-200 pb-5">

            <button className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black shadow-lg whitespace-nowrap">
              Dados Pessoais
            </button>

            <button className="bg-zinc-100 hover:bg-zinc-200 transition px-8 py-4 rounded-2xl font-bold text-zinc-700 whitespace-nowrap">
              Endereço
            </button>

            <button className="bg-zinc-100 hover:bg-zinc-200 transition px-8 py-4 rounded-2xl font-bold text-zinc-700 whitespace-nowrap">
              Documentos
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

          {/* FOTO + CAMPOS */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* FOTO */}
            <div>

              <div className="border-2 border-dashed border-yellow-400 rounded-3xl h-80 flex flex-col items-center justify-center bg-zinc-50 relative overflow-hidden">

                <div className="absolute top-5 right-5 bg-yellow-400 w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
                  <Camera className="text-black" />
                </div>

                <User size={90} className="text-zinc-300" />

                <h2 className="mt-5 font-black text-zinc-700 text-xl">
                  Foto
                </h2>

              </div>

            </div>

            {/* CAMPOS */}
            <div className="lg:col-span-3">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <input
                  name="nome"
                  placeholder="Nome completo"
                  onChange={handleChange}
                  className="w-full border-2 border-zinc-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all p-4 rounded-2xl bg-white"
                />

                <input
                  name="cpf"
                  placeholder="CPF"
                  onChange={handleChange}
                  className="w-full border-2 border-zinc-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all p-4 rounded-2xl bg-white"
                />

                <input
                  name="rg"
                  placeholder="RG"
                  onChange={handleChange}
                  className="w-full border-2 border-zinc-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all p-4 rounded-2xl bg-white"
                />

                <input
                  name="renach"
                  placeholder="RENACH"
                  onChange={handleChange}
                  className="w-full border-2 border-zinc-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all p-4 rounded-2xl bg-white"
                />

                <select className="w-full border-2 border-zinc-200 focus:border-yellow-400 outline-none transition-all p-4 rounded-2xl bg-white">
                  <option>Sexo</option>
                  <option>Masculino</option>
                  <option>Feminino</option>
                </select>

                <input
                  type="date"
                  className="w-full border-2 border-zinc-200 focus:border-yellow-400 outline-none transition-all p-4 rounded-2xl bg-white"
                />

              </div>

            </div>

          </div>

          {/* ENDEREÇO */}
          <div className="mt-12">

            <h2 className="text-3xl font-black text-[#081120] mb-6 flex items-center gap-3">
              <MapPin className="text-yellow-500" />
              Endereço
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

              <input
                placeholder="CEP"
                className="w-full border-2 border-zinc-200 focus:border-yellow-400 outline-none transition-all p-4 rounded-2xl bg-white"
              />

              <input
                placeholder="Logradouro"
                className="w-full border-2 border-zinc-200 focus:border-yellow-400 outline-none transition-all p-4 rounded-2xl bg-white md:col-span-2"
              />

              <input
                placeholder="Número"
                className="w-full border-2 border-zinc-200 focus:border-yellow-400 outline-none transition-all p-4 rounded-2xl bg-white"
              />

              <input
                placeholder="Bairro"
                className="w-full border-2 border-zinc-200 focus:border-yellow-400 outline-none transition-all p-4 rounded-2xl bg-white"
              />

              <input
                placeholder="Cidade"
                className="w-full border-2 border-zinc-200 focus:border-yellow-400 outline-none transition-all p-4 rounded-2xl bg-white"
              />

              <select className="w-full border-2 border-zinc-200 focus:border-yellow-400 outline-none transition-all p-4 rounded-2xl bg-white">
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
              <Phone className="text-yellow-500" />
              Contato e Acesso
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <input
                placeholder="Telefone"
                className="w-full border-2 border-zinc-200 focus:border-yellow-400 outline-none transition-all p-4 rounded-2xl bg-white"
              />

              <input
                placeholder="Celular"
                className="w-full border-2 border-zinc-200 focus:border-yellow-400 outline-none transition-all p-4 rounded-2xl bg-white"
              />

              <input
                placeholder="Email"
                className="w-full border-2 border-zinc-200 focus:border-yellow-400 outline-none transition-all p-4 rounded-2xl bg-white"
              />

            </div>

          </div>

          {/* OBS */}
          <div className="mt-12">

            <h2 className="text-3xl font-black text-[#081120] mb-6 flex items-center gap-3">
              <CreditCard className="text-yellow-500" />
              Observações Gerais
            </h2>

            <textarea
              placeholder="Digite observações sobre o aluno..."
              className="w-full border-2 border-zinc-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all p-5 rounded-2xl bg-white h-44"
            />

          </div>

        </div>

      </div>

    </div>

  )

}