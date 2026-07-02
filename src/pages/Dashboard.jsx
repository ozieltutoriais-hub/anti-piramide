import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import { useState, useEffect } from 'react'

import {
  LayoutDashboard
} from 'lucide-react'
import { motion } from 'framer-motion'

import StatsCard from '../components/StatsCard'

import app from '../firebase/firebase'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const db = getFirestore(app)

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
    localStorage.getItem('usuarioLogado')
  )

  const [alunosOnline, setAlunosOnline] = useState(0)
  const [veiculos] = useState(14)

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const snapshot = await getDocs(collection(db, 'alunos'))
        setAlunosOnline(snapshot.size)
      } catch (e) {
        console.error("Erro ao buscar alunos", e)
      }
    }
    carregarAlunos()
  }, [])

  return (

    <div className="min-h-full bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] -m-5 p-4 lg:p-8">

      {/* HEADER BAR */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-zinc-200 p-5 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-[0_2px_20px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <LayoutDashboard size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Painel Principal</h1>
            <p className="text-sm text-slate-500">Visão geral do sistema e indicadores</p>
          </div>
        </div>
      </motion.div>

      <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6 mb-8">

        <StatsCard
          title="Alunos Ativos"
          value={alunosOnline}
          colorClass="bg-emerald-500"
        />

        <StatsCard
          title="Aulas Hoje"
          value="18"
          colorClass="bg-blue-500"
        />

        <StatsCard
          title="Exames Marcados"
          value="12"
          colorClass="bg-purple-500"
        />

        <StatsCard
          title="Veículos"
          value={veiculos}
          colorClass="bg-teal-400"
        />

        <StatsCard
          title="Instrutores"
          value="6"
          colorClass="bg-sky-400"
        />

      </div>

      <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-2xl font-bold text-slate-800">
              Matrículas da Semana
            </h2>

            <p className="text-zinc-500 mt-1 text-sm">
              Evolução semanal das matrículas
            </p>

          </div>

          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-bold text-sm border border-emerald-100">
            + 28%
          </div>

        </div>

        <div className="h-[350px]">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={data}>

              <XAxis dataKey="name" stroke="#94a3b8" />

              <YAxis stroke="#94a3b8" />

              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />

              <Line
                type="monotone"
                dataKey="matriculas"
                stroke="#10b981"
                strokeWidth={4}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="mt-8 bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">

          <div>

            <h2 className="text-2xl font-bold text-slate-800">
              Central Operacional
            </h2>

            <p className="text-zinc-500 mt-1 text-sm">
              Visão geral de aprovações e frota
            </p>

          </div>

          <button
            className="bg-slate-800 hover:bg-slate-700 text-white shadow-sm px-6 py-3 rounded-xl font-medium text-sm transition-all"
          >
            Nova Matrícula
          </button>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-slate-50 border border-zinc-100 rounded-2xl p-6">

            <p className="text-zinc-500 mb-2 font-medium text-sm">
              Aprovação
            </p>

            <h3 className="text-3xl font-bold text-emerald-600">
              92%
            </h3>

          </div>

          <div className="bg-slate-50 border border-zinc-100 rounded-2xl p-6">

            <p className="text-zinc-500 mb-2 font-medium text-sm">
              CNHs Emitidas
            </p>

            <h3 className="text-3xl font-bold text-blue-600">
              1.284
            </h3>

          </div>

          <div className="bg-slate-50 border border-zinc-100 rounded-2xl p-6">

            <p className="text-zinc-500 mb-2 font-medium text-sm">
              Veículos Disponíveis
            </p>

            <h3 className="text-3xl font-bold text-emerald-600">
              {veiculos}
            </h3>

          </div>

        </div>

      </div>

    </div>

  )
}