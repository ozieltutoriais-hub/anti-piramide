import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import { useState } from 'react'

import {
  Bell,
  Search
} from 'lucide-react'

import StatsCard from '../components/StatsCard'

const data = [
  { name: 'Seg', matriculas: 4 },
  { name: 'Ter', matriculas: 7 },
  { name: 'Qua', matriculas: 12 },
  { name: 'Qui', matriculas: 9 },
  { name: 'Sex', matriculas: 18 },
  { name: 'Sab', matriculas: 24 },
  { name: 'Dom', matriculas: 32 },
]

export default function Dashboard() {

  const usuario = JSON.parse(
    localStorage.getItem('venaUser')
  )

  const [alunosOnline] = useState(248)
  const [veiculos] = useState(14)

  return (

    <div>

      <div className="mb-10">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h1 className="text-5xl font-black mb-3 text-yellow-400">
              Auto Escola Online
            </h1>

            <p className="text-zinc-400 text-lg">
              Plataforma educacional e gerenciamento de alunos
            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="bg-[#11192c] p-4 rounded-2xl cursor-pointer hover:bg-[#18233b] transition">
              <Search size={22} />
            </div>

            <div className="bg-[#11192c] p-4 rounded-2xl cursor-pointer hover:bg-[#18233b] transition relative">

              <Bell size={22} />

              <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></div>

            </div>

            <div className="flex items-center gap-3 bg-[#11192c] px-5 py-3 rounded-2xl">

              <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-black text-xl">
                J
              </div>

              <div>

                <p className="font-bold">
                  {usuario?.nome || 'Administrador'}
                </p>

                <p className="text-zinc-400 text-sm">
                  Administrador
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="mt-4 bg-[#11192c] border border-zinc-800 rounded-3xl p-6 mb-10">

        <p className="text-zinc-400 mb-2">
          Usuário Logado
        </p>

        <h2 className="text-3xl font-black text-yellow-400">
          {usuario?.nome}
        </h2>

        <p className="text-zinc-500 mt-2">
          {usuario?.email}
        </p>

      </div>

      <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">

        <StatsCard
          title="Alunos Ativos"
          value={alunosOnline}
          color="bg-gradient-to-br from-blue-500 to-cyan-700"
        />

        <StatsCard
          title="Aulas Hoje"
          value="18"
          color="bg-gradient-to-br from-green-500 to-green-700"
        />

        <StatsCard
          title="Exames Marcados"
          value="12"
          color="bg-gradient-to-br from-yellow-400 to-orange-500"
        />

        <StatsCard
          title="Veículos"
          value={veiculos}
          color="bg-gradient-to-br from-cyan-500 to-blue-700"
        />

        <StatsCard
          title="Instrutores"
          value="6"
          color="bg-gradient-to-br from-purple-500 to-pink-600"
        />

      </div>

      <div className="bg-[#11192c] rounded-3xl p-8 border border-zinc-800 mt-10">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-3xl font-bold">
              Matrículas da Semana
            </h2>

            <p className="text-zinc-500 mt-2">
              Evolução semanal das matrículas
            </p>

          </div>

          <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-2xl font-bold">
            + 28%
          </div>

        </div>

        <div className="h-[350px]">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={data}>

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="matriculas"
                stroke="#eab308"
                strokeWidth={4}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="mt-10 bg-[#11192c] rounded-3xl p-8 border border-zinc-800">

        <div className="flex items-center justify-between flex-wrap gap-6">

          <div>

            <h2 className="text-4xl font-black mb-2 text-yellow-400">
              Central Administrativa
            </h2>

            <p className="text-zinc-400">
              Controle educacional e operacional da auto escola
            </p>

          </div>

          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-2xl font-bold text-lg transition"
          >
            Nova Matrícula
          </button>

        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">

          <div className="bg-[#18233b] rounded-2xl p-6">

            <p className="text-zinc-400 mb-2">
              Aprovação
            </p>

            <h3 className="text-3xl font-black text-green-400">
              92%
            </h3>

          </div>

          <div className="bg-[#18233b] rounded-2xl p-6">

            <p className="text-zinc-400 mb-2">
              CNHs Emitidas
            </p>

            <h3 className="text-3xl font-black text-blue-400">
              1.284
            </h3>

          </div>

          <div className="bg-[#18233b] rounded-2xl p-6">

            <p className="text-zinc-400 mb-2">
              Veículos Disponíveis
            </p>

            <h3 className="text-3xl font-black text-yellow-400">
              {veiculos}
            </h3>

          </div>

        </div>

      </div>

    </div>

  )
}