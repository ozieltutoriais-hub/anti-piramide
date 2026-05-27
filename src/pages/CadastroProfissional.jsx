import { useState } from 'react'
import {
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Camera
} from 'lucide-react'

export default function CadastroProfissional() {

  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    rg: '',
    telefone: '',
    celular: '',
    email: '',
    cidade: '',
    bairro: '',
    cep: '',
    endereco: '',
    numero: '',
    observacoes: '',
    renach: ''
  })

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function salvarAluno() {
    alert('Cadastro salvo com sucesso!')
  }

  return (

    <div className="min-h-screen bg-[#f1f1f1]">

      {/* TOPO */}
      <div className="bg-green-500 h-14 flex items-center justify-between px-6 shadow-md">

        <h1 className="text-white font-black text-2xl">
          e-condutor
        </h1>

        <button
          onClick={salvarAluno}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold"
        >
          Salvar
        </button>

      </div>

      {/* CONTEÚDO */}
      <div className="p-6">

        <div className="bg-white rounded-xl shadow border p-6">

          <h1 className="text-5xl text-zinc-700 mb-10">
            Aluno
          </h1>

          {/* DADOS PESSOAIS */}
          <div className="border rounded-xl p-6 mb-8">

            <h2 className="text-2xl font-bold text-zinc-700 mb-6">
              Dados pessoais
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* FOTO */}
              <div className="lg:col-span-1">

                <div className="border rounded-xl h-72 flex flex-col items-center justify-center bg-zinc-100">

                  <Camera
                    size={80}
                    className="text-zinc-400"
                  />

                  <p className="mt-4 text-zinc-500">
                    Sem foto
                  </p>

                </div>

              </div>

              {/* CAMPOS */}
              <div className="lg:col-span-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Nome completo"
                    className="border p-4 rounded-lg"
                  />

                  <input
                    name="cpf"
                    value={form.cpf}
                    onChange={handleChange}
                    placeholder="CPF"
                    className="border p-4 rounded-lg"
                  />

                  <input
                    name="rg"
                    value={form.rg}
                    onChange={handleChange}
                    placeholder="RG"
                    className="border p-4 rounded-lg"
                  />

                  <input
                    name="renach"
                    value={form.renach}
                    onChange={handleChange}
                    placeholder="RENACH"
                    className="border p-4 rounded-lg"
                  />

                  <select
                    className="border p-4 rounded-lg"
                  >
                    <option>Masculino</option>
                    <option>Feminino</option>
                  </select>

                  <input
                    placeholder="Data nascimento"
                    className="border p-4 rounded-lg"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* ENDEREÇO */}
          <div className="border rounded-xl p-6 mb-8">

            <h2 className="text-2xl font-bold text-zinc-700 mb-6">
              Endereço
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

              <input
                name="cep"
                value={form.cep}
                onChange={handleChange}
                placeholder="CEP"
                className="border p-4 rounded-lg"
              />

              <input
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                placeholder="Logradouro"
                className="border p-4 rounded-lg md:col-span-2"
              />

              <input
                name="numero"
                value={form.numero}
                onChange={handleChange}
                placeholder="Número"
                className="border p-4 rounded-lg"
              />

              <input
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
                placeholder="Bairro"
                className="border p-4 rounded-lg"
              />

              <input
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                placeholder="Cidade"
                className="border p-4 rounded-lg"
              />

              <select
                className="border p-4 rounded-lg"
              >
                <option>UF</option>
                <option>SP</option>
                <option>RJ</option>
                <option>MG</option>
              </select>

            </div>

          </div>

          {/* CONTATO */}
          <div className="border rounded-xl p-6 mb-8">

            <h2 className="text-2xl font-bold text-zinc-700 mb-6">
              Contato e acesso
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="Telefone"
                className="border p-4 rounded-lg"
              />

              <input
                name="celular"
                value={form.celular}
                onChange={handleChange}
                placeholder="Celular"
                className="border p-4 rounded-lg"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="border p-4 rounded-lg"
              />

            </div>

          </div>

          {/* OBSERVAÇÕES */}
          <div className="border rounded-xl p-6">

            <h2 className="text-2xl font-bold text-zinc-700 mb-6">
              Observações gerais
            </h2>

            <textarea
              name="observacoes"
              value={form.observacoes}
              onChange={handleChange}
              placeholder="Observações do aluno..."
              className="w-full border p-5 rounded-lg h-40"
            />

          </div>

        </div>

      </div>

    </div>

  )
}