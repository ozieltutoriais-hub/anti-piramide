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
  GraduationCap,
  Car,
  Calendar,
  TrendingUp,
  Users,
  Bell,
  ArrowUpRight
} from 'lucide-react'

import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

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

  const [alunosOnline] = useState(248)
  const [veiculos] = useState(14)

  return (

    <div className="p-8 bg-[#eef2f7] min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">

        <div>

          <h1 className="text-4xl font-bold text-[#081120] tracking-tight">

            Dashboard

          </h1>

          <p className="text-zinc-500 mt-2 text-lg">

            Bem-vindo novamente,
            {' '}
            <span className="font-semibold text-[#081120]">

              {usuario?.nome || 'Administrador'}

            </span>

          </p>

        </div>

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-white border border-[#e4e9f2] flex items-center justify-center shadow-sm relative">

            <Bell
              size={18}
              strokeWidth={2.2}
              className="text-zinc-700"
            />

            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-green-500"></div>

          </div>

          <Button>

            Nova Matrícula

          </Button>

        </div>

      </div>

      {/* CARDS */}
      <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">

        <Card className="p-6">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-zinc-500 font-medium">

                Alunos Ativos

              </p>

              <h2 className="text-4xl font-bold text-[#081120] mt-4">

                {alunosOnline}

              </h2>

              <div className="mt-4 flex items-center gap-2 text-green-600 font-semibold text-sm">

                <ArrowUpRight size={16} />

                +12% este mês

              </div>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">

              <Users
                className="text-green-600"
                size={24}
                strokeWidth={2.2}
              />

            </div>

          </div>

        </Card>

        <Card className="p-6">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-zinc-500 font-medium">

                Aulas Hoje

              </p>

              <h2 className="text-4xl font-bold text-[#081120] mt-4">

                18

              </h2>

              <div className="mt-4 flex items-center gap-2 text-green-600 font-semibold text-sm">

                <ArrowUpRight size={16} />

                Agenda positiva

              </div>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

              <Calendar
                className="text-blue-600"
                size={24}
                strokeWidth={2.2}
              />

            </div>

          </div>

        </Card>

        <Card className="p-6">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-zinc-500 font-medium">

                Veículos

              </p>

              <h2 className="text-4xl font-bold text-[#081120] mt-4">

                {veiculos}

              </h2>

              <div className="mt-4 flex items-center gap-2 text-green-600 font-semibold text-sm">

                <ArrowUpRight size={16} />

                Frota disponível

              </div>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">

              <Car
                className="text-yellow-600"
                size={24}
                strokeWidth={2.2}
              />

            </div>

          </div>

        </Card>

        <Card className="p-6">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-zinc-500 font-medium">

                Aprovação

              </p>

              <h2 className="text-4xl font-bold text-[#081120] mt-4">

                92%

              </h2>

              <div className="mt-4 flex items-center gap-2 text-green-600 font-semibold text-sm">

                <TrendingUp size={16} />

                Excelente índice

              </div>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">

              <GraduationCap
                className="text-purple-600"
                size={24}
                strokeWidth={2.2}
              />

            </div>

          </div>

        </Card>

      </div>

      {/* GRÁFICO */}
      <Card className="mt-8 p-8">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-2xl font-bold text-[#081120]">

              Matrículas da Semana

            </h2>

            <p className="text-zinc-500 mt-2">

              Evolução semanal das matrículas

            </p>

          </div>

          <div className="bg-green-100 text-green-700 px-4 h-11 rounded-xl flex items-center font-semibold">

            +28%

          </div>

        </div>

        <div className="h-[350px]">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={data}>

              <XAxis
                dataKey="name"
                stroke="#94a3b8"
              />

              <YAxis
                stroke="#94a3b8"
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="matriculas"
                stroke="#16a34a"
                strokeWidth={4}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </Card>

      {/* BOTTOM */}
      <div className="grid lg:grid-cols-3 gap-6 mt-8">

        <Card className="p-6">

          <p className="text-zinc-500 font-medium mb-3">

            Instrutores

          </p>

          <h2 className="text-4xl font-bold text-[#081120]">

            6

          </h2>

        </Card>

        <Card className="p-6">

          <p className="text-zinc-500 font-medium mb-3">

            Exames Marcados

          </p>

          <h2 className="text-4xl font-bold text-[#081120]">

            12

          </h2>

        </Card>

        <Card className="p-6">

          <p className="text-zinc-500 font-medium mb-3">

            CNHs Emitidas

          </p>

          <h2 className="text-4xl font-bold text-[#081120]">

            1.284

          </h2>

        </Card>

      </div>

    </div>

  )

}