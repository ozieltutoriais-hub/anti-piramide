import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import { useState } from 'react'

import StatsCard from '../components/StatsCard'

const data = [
  { name: 'Seg', lucro: 400 },
  { name: 'Ter', lucro: 700 },
  { name: 'Qua', lucro: 1200 },
  { name: 'Qui', lucro: 980 },
  { name: 'Sex', lucro: 1800 },
  { name: 'Sab', lucro: 2400 },
  { name: 'Dom', lucro: 3200 },
]

export default function Dashboard() {

const usuario = JSON.parse(
  localStorage.getItem('venaUser')
)


const [vena, setVena] = useState(1250)
const [price] = useState(2.85)


function minerar() {
  setVena(vena + 25)
}

  return (
    <div>

      <div className="mb-10">
        <h1 className="text-5xl font-black mb-3">
          Autoescola Online
        </h1>

<div className="mt-4 bg-[#11192c] border border-zinc-800 rounded-3xl p-6">

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



        <p className="text-zinc-400 text-lg">
          Plataforma educacional simulada
        </p>
      </div>

      <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">

<StatsCard
  title="Alunos Ativos"
  value="248"
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
         title="Usuários"
          title="Veículos"
          color="bg-gradient-to-br from-cyan-500 to-blue-700"
        />

        <StatsCard
          title="VIP"
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
              Evolução simulada
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
                dataKey="lucro"
                stroke="#ef4444"
                strokeWidth={4}
              />

            </LineChart>
          </ResponsiveContainer>

        </div>

      </div>
<div className="mt-10 bg-[#11192c] rounded-3xl p-8 border border-zinc-800">

  <div className="flex items-center justify-between">

    <div>
      <h2 className="text-4xl font-black mb-2 text-yellow-400">
        VENAcoin Mining
      </h2>

      <p className="text-zinc-400">
        Simulação educacional de mineração virtual
      </p>
    </div>

    <button
      onClick={minerar}
      className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-2xl font-bold text-lg transition"
    >
      Minerar VENA
    </button>

  </div>

  <div className="mt-8 grid md:grid-cols-3 gap-6">

    <div className="bg-[#18233b] rounded-2xl p-6">
      <p className="text-zinc-400 mb-2">
        Supply
      </p>Crescimento

      <h3 className="text-3xl font-black">
        21M
      </h3>
    </div>

    <div className="bg-[#18233b] rounded-2xl p-6">
      <p className="text-zinc-400 mb-2">
        Valor
      </p>

      <h3 className="text-3xl font-black text-green-400">
        R$ {price}
      </h3>
    </div>

    <div className="bg-[#18233b] rounded-2xl p-6">
      <p className="text-zinc-400 mb-2">
        Holdings
      </p>

      <h3 className="text-3xl font-black text-yellow-400">
        {vena} VENA
      </h3>
    </div>

  </div>

</div>
    </div>
  )
}