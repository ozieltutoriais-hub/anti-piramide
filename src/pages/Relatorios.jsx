import { useEffect, useState } from 'react'

import {
  Search,
  Trash2,
  Users,
  BadgeCheck,
  Pencil,
  X
} from 'lucide-react'

export default function Relatorios() {

  const [alunos, setAlunos] = useState([])
  const [busca, setBusca] = useState('')

  const [editando, setEditando] = useState(null)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cidade, setCidade] = useState('')
  const [status, setStatus] = useState('Ativo')

  useEffect(() => {

    const dados = JSON.parse(
      localStorage.getItem('alunosAutoEscola')
    ) || []

    setAlunos(dados)

  }, [])

  function excluirAluno(id) {

    const confirmar = confirm(
      'Deseja excluir este aluno?'
    )

    if (!confirmar) return

    const novaLista = alunos.filter(
      (aluno) => aluno.id !== id
    )

    setAlunos(novaLista)

    localStorage.setItem(
      'alunosAutoEscola',
      JSON.stringify(novaLista)
    )

  }

  function abrirEdicao(aluno) {

    setEditando(aluno)

    setNome(aluno.nome)
    setEmail(aluno.email)
    setTelefone(aluno.telefone)
    setCidade(aluno.cidade)
    setStatus(aluno.status || 'Ativo')

  }

  function salvarEdicao() {

    const novaLista = alunos.map((aluno) => {

      if (aluno.id === editando.id) {

        return {
          ...aluno,
          nome,
          email,
          telefone,
          cidade,
          status
        }

      }

      return aluno
    })

    setAlunos(novaLista)

    localStorage.setItem(
      'alunosAutoEscola',
      JSON.stringify(novaLista)
    )

    setEditando(null)

    alert('Aluno atualizado com sucesso!')

  }

  const alunosFiltrados = alunos.filter(
    (aluno) =>
      aluno.nome
        .toLowerCase()
        .includes(busca.toLowerCase())
  )

  return (

    <div className="min-h-screen bg-[#060b17] text-white p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between flex-wrap gap-6 mb-10">

          <div>

            <h1 className="text-5xl font-black text-yellow-400">
              Painel Administrativo
            </h1>

            <p className="text-zinc-400 mt-3 text-lg">
              Gerenciamento completo dos alunos
            </p>

          </div>

          <div className="bg-[#11192c] px-6 py-4 rounded-3xl border border-zinc-800 flex items-center gap-4">

            <Users size={26} className="text-yellow-400" />

            <div>

              <p className="text-zinc-400 text-sm">
                Total de alunos
              </p>

              <h2 className="text-3xl font-black">
                {alunos.length}
              </h2>

            </div>

          </div>

        </div>

        <div className="bg-[#11192c] rounded-[30px] border border-zinc-800 p-8 shadow-2xl">

          <div className="flex items-center justify-between flex-wrap gap-6 mb-8">

            <div>

              <h2 className="text-3xl font-black">
                Lista de Alunos
              </h2>

              <p className="text-zinc-500 mt-2">
                Controle administrativo
              </p>

            </div>

            <div className="relative w-full max-w-md">

              <Search
                className="absolute left-4 top-5 text-zinc-400"
                size={22}
              />

              <input
                type="text"
                placeholder="Pesquisar aluno..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full bg-[#18233b] border border-zinc-700 rounded-2xl p-5 pl-14 outline-none"
              />

            </div>

          </div>

          <div className="overflow-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-zinc-800 text-left">

                  <th className="p-5">Nome</th>
                  <th className="p-5">Email</th>
                  <th className="p-5">Telefone</th>
                  <th className="p-5">Cidade</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-center">Ações</th>

                </tr>

              </thead>

              <tbody>

                {alunosFiltrados.map((aluno) => (

                  <tr
                    key={aluno.id}
                    className="border-b border-zinc-800 hover:bg-[#18233b] transition"
                  >

                    <td className="p-5 font-bold">
                      {aluno.nome}
                    </td>

                    <td className="p-5 text-zinc-300">
                      {aluno.email}
                    </td>

                    <td className="p-5 text-zinc-300">
                      {aluno.telefone}
                    </td>

                    <td className="p-5 text-zinc-300">
                      {aluno.cidade}
                    </td>

                    <td className="p-5">

                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-bold ${
                        aluno.status === 'Inativo'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>

                        <BadgeCheck size={18} />

                        {aluno.status || 'Ativo'}

                      </div>

                    </td>

                    <td className="p-5">

                      <div className="flex items-center justify-center gap-3">

                        <button
                          onClick={() => abrirEdicao(aluno)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black transition p-3 rounded-2xl"
                        >

                          <Pencil size={20} />

                        </button>

                        <button
                          onClick={() => excluirAluno(aluno.id)}
                          className="bg-red-500 hover:bg-red-600 transition p-3 rounded-2xl"
                        >

                          <Trash2 size={20} />

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {editando && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">

          <div className="w-full max-w-2xl bg-[#11192c] rounded-[30px] border border-zinc-800 p-10 relative">

            <button
              onClick={() => setEditando(null)}
              className="absolute top-5 right-5 bg-red-500 p-3 rounded-2xl"
            >

              <X size={20} />

            </button>

            <h2 className="text-4xl font-black text-yellow-400 mb-8">
              Editar Aluno
            </h2>

            <div className="space-y-5">

              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-[#18233b] border border-zinc-700 rounded-2xl p-5 outline-none"
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#18233b] border border-zinc-700 rounded-2xl p-5 outline-none"
              />

              <input
                type="text"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full bg-[#18233b] border border-zinc-700 rounded-2xl p-5 outline-none"
              />

              <input
                type="text"
                placeholder="Cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full bg-[#18233b] border border-zinc-700 rounded-2xl p-5 outline-none"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#18233b] border border-zinc-700 rounded-2xl p-5 outline-none"
              >

                <option value="Ativo">
                  Ativo
                </option>

                <option value="Inativo">
                  Inativo
                </option>

              </select>

              <button
                onClick={salvarEdicao}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black transition p-5 rounded-2xl font-black text-lg"
              >
                Salvar Alterações
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )
}