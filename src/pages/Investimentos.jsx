import { useEffect, useState } from 'react'

import {
  DollarSign,
  Wallet,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'

import app from '../firebase/firebase'
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore'

const db = getFirestore(app)

export default function Investimentos() {

  const [mensalidades, setMensalidades] = useState([])

  useEffect(() => {

    async function carregarMensalidades() {
      const snapshot = await getDocs(collection(db, 'mensalidades'))
      const lista = []
      snapshot.forEach(doc => lista.push({ id: doc.id, ...doc.data() }))
      setMensalidades(lista)
    }

    carregarMensalidades()

  }, [])

  async function adicionarMensalidade() {

    const novaMensalidade = {
      aluno: 'Aluno ' + (mensalidades.length + 1),
      valor: 850,
      vencimento: '10/06/2026',
      status: mensalidades.length % 2 === 0
        ? 'Pago'
        : 'Pendente'
    }

    try {
      const docRef = await addDoc(collection(db, 'mensalidades'), novaMensalidade)
      setMensalidades([
        ...mensalidades,
        { id: docRef.id, ...novaMensalidade }
      ])
    } catch (e) {
      console.error(e)
    }

  }

  const totalRecebido = mensalidades
    .filter((item) => item.status === 'Pago')
    .reduce((acc, item) => acc + item.valor, 0)

  const totalPendente = mensalidades
    .filter((item) => item.status === 'Pendente')
    .reduce((acc, item) => acc + item.valor, 0)

  return (

    <div className="min-h-screen bg-[#060b17] text-white p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between flex-wrap gap-6 mb-10">

          <div>

            <h1 className="text-5xl font-black text-green-500">
              Financeiro
            </h1>

            <p className="text-zinc-400 mt-3 text-lg">
              Gestão financeira da auto escola
            </p>

          </div>

          <button
            onClick={adicionarMensalidade}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white shadow-lg px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
          >
            Nova Mensalidade
          </button>

        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">

          <div className="bg-[#11192c] rounded-3xl p-8 border border-zinc-800 shadow-2xl">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-black">
                Recebido
              </h2>

              <Wallet className="text-green-400" size={35} />

            </div>

            <h3 className="text-5xl font-black text-green-400">
              R$ {totalRecebido}
            </h3>

          </div>

          <div className="bg-[#11192c] rounded-3xl p-8 border border-zinc-800 shadow-2xl">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-black">
                Pendentes
              </h2>

              <AlertTriangle className="text-red-400" size={35} />

            </div>

            <h3 className="text-5xl font-black text-red-400">
              R$ {totalPendente}
            </h3>

          </div>

          <div className="bg-[#11192c] rounded-3xl p-8 border border-zinc-800 shadow-2xl">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-black">
                Total
              </h2>

              <DollarSign className="text-green-500" size={35} />

            </div>

            <h3 className="text-5xl font-black text-green-500">
              R$ {totalRecebido + totalPendente}
            </h3>

          </div>

        </div>

        <div className="bg-[#11192c] rounded-[30px] border border-zinc-800 p-8 shadow-2xl">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-3xl font-black">
                Mensalidades
              </h2>

              <p className="text-zinc-500 mt-2">
                Controle financeiro dos alunos
              </p>

            </div>

            <div className="bg-green-500/20 text-green-400 px-5 py-3 rounded-2xl font-bold">
              {mensalidades.length} registros
            </div>

          </div>

          <div className="overflow-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-zinc-800 text-left">

                  <th className="p-5">
                    Aluno
                  </th>

                  <th className="p-5">
                    Valor
                  </th>

                  <th className="p-5">
                    Vencimento
                  </th>

                  <th className="p-5">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {mensalidades.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b border-zinc-800 hover:bg-[#18233b] transition"
                  >

                    <td className="p-5 font-bold">
                      {item.aluno}
                    </td>

                    <td className="p-5 text-green-500 font-bold">
                      R$ {item.valor}
                    </td>

                    <td className="p-5 text-zinc-300">
                      {item.vencimento}
                    </td>

                    <td className="p-5">

                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-bold ${
                        item.status === 'Pago'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>

                        <CheckCircle2 size={18} />

                        {item.status}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  )
}