import { useState } from 'react'

export default function CadastroProfissional() {

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [rg, setRg] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cidade, setCidade] = useState('')
  const [email, setEmail] = useState('')
  const [renach, setRenach] = useState('')

  return (

    <div className="min-h-screen bg-[#060b17] text-white p-6">

      <div className="bg-[#11192c] p-8 rounded-3xl border border-zinc-800">

        <h1 className="text-5xl font-black text-yellow-400 mb-10">
          Cadastro Profissional
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome completo"
            className="bg-[#18233b] p-4 rounded-2xl"
          />

          <input
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="CPF"
            className="bg-[#18233b] p-4 rounded-2xl"
          />

          <input
            value={rg}
            onChange={(e) => setRg(e.target.value)}
            placeholder="RG"
            className="bg-[#18233b] p-4 rounded-2xl"
          />

          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Telefone"
            className="bg-[#18233b] p-4 rounded-2xl"
          />

          <input
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Cidade"
            className="bg-[#18233b] p-4 rounded-2xl"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-[#18233b] p-4 rounded-2xl"
          />

          <input
            value={renach}
            onChange={(e) => setRenach(e.target.value)}
            placeholder="RENACH"
            className="bg-[#18233b] p-4 rounded-2xl"
          />

          <select
            className="bg-[#18233b] p-4 rounded-2xl"
          >
            <option>Categoria A</option>
            <option>Categoria B</option>
            <option>Categoria AB</option>
            <option>Categoria D</option>
          </select>

        </div>

        <div className="mt-10">

          <textarea
            placeholder="Observações"
            className="w-full bg-[#18233b] p-6 rounded-2xl h-40"
          />

        </div>

        <button
          className="mt-10 bg-yellow-500 hover:bg-yellow-600 transition text-black font-black p-5 rounded-2xl text-xl"
        >
          Salvar Cadastro
        </button>

      </div>

    </div>

  )
}