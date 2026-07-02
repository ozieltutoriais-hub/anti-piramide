import { useState, useEffect } from 'react'
import {
  Banknote,
  TrendingUp,
  TrendingDown,
  Plus,
  X,
  Search,
  Wallet,
  AlertCircle
} from 'lucide-react'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import app from '../firebase/firebase'
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc
} from 'firebase/firestore'

const db = getFirestore(app)

export default function Financeiro() {
  const [lancamentos, setLancamentos] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'Receita',
    data: new Date().toISOString().slice(0, 10),
    status: 'Pago'
  })

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'financeiro'), snapshot => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      // Ordenar por data mais recente
      data.sort((a, b) => new Date(b.data) - new Date(a.data))
      setLancamentos(data)
    })
    return () => unsub()
  }, [])

  const totalReceitas = lancamentos.filter(l => l.tipo === 'Receita' && l.status === 'Pago').reduce((acc, curr) => acc + Number(curr.valor), 0)
  const totalDespesas = lancamentos.filter(l => l.tipo === 'Despesa' && l.status === 'Pago').reduce((acc, curr) => acc + Number(curr.valor), 0)
  const saldoAtual = totalReceitas - totalDespesas
  const totalPendente = lancamentos.filter(l => l.status === 'Pendente').reduce((acc, curr) => acc + Number(curr.valor), 0)

  // Dados para o Gráfico Mockados misturados com real (simplificado)
  const dataGrafico = [
    { name: '10/06', receita: 4000, despesa: 2400 },
    { name: '15/06', receita: 3000, despesa: 1398 },
    { name: '20/06', receita: 2000, despesa: 9800 },
    { name: '25/06', receita: 2780, despesa: 3908 },
    { name: 'Hoje', receita: totalReceitas > 0 ? totalReceitas : 1890, despesa: totalDespesas > 0 ? totalDespesas : 4800 },
  ]

  async function salvarLancamento(e) {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'financeiro'), {
        ...formData,
        valor: Number(formData.valor)
      })
      setModalAberto(false)
      setFormData({
        descricao: '',
        valor: '',
        tipo: 'Receita',
        data: new Date().toISOString().slice(0, 10),
        status: 'Pago'
      })
    } catch (error) {
      console.error(error)
      alert('Erro ao salvar lançamento.')
    }
  }

  async function excluirLancamento(id) {
    if(window.confirm('Excluir este lançamento?')) {
      await deleteDoc(doc(db, 'financeiro', id))
    }
  }

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
  }

  return (
    <div className="p-6 bg-[#f4f7fb] min-h-screen text-zinc-800 animate-in fade-in duration-500 flex flex-col">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-800 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
              <Banknote className="text-white" size={26} />
            </div>
            Gestão Financeira
          </h1>
          <p className="text-zinc-500 mt-2">Controle de caixa, receitas, despesas e inadimplência.</p>
        </div>
        <button 
          onClick={() => setModalAberto(true)}
          className="h-11 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus size={18} /> Novo Lançamento
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-zinc-500 font-semibold">Saldo Atual</p>
            <Wallet className="text-blue-500" size={24} />
          </div>
          <h3 className="text-3xl font-black text-zinc-800">{formatarMoeda(saldoAtual)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-zinc-500 font-semibold">Receitas (Mês)</p>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <h3 className="text-3xl font-black text-green-600">{formatarMoeda(totalReceitas)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-zinc-500 font-semibold">Despesas (Mês)</p>
            <TrendingDown className="text-red-500" size={24} />
          </div>
          <h3 className="text-3xl font-black text-red-600">{formatarMoeda(totalDespesas)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-zinc-500 font-semibold">Inadimplência</p>
            <AlertCircle className="text-yellow-500" size={24} />
          </div>
          <h3 className="text-3xl font-black text-yellow-600">{formatarMoeda(totalPendente)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1">
        
        {/* GRÁFICO */}
        <div className="col-span-2 bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 flex flex-col">
          <h2 className="text-xl font-bold text-zinc-800 mb-6">Fluxo de Caixa (Mensal)</h2>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataGrafico} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
                <YAxis stroke="#a1a1aa" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="receita" stroke="#22c55e" fillOpacity={1} fill="url(#colorReceita)" strokeWidth={3} />
                <Area type="monotone" dataKey="despesa" stroke="#ef4444" fillOpacity={1} fill="url(#colorDespesa)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* EXTRATO RECENTE */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
            <h2 className="font-bold text-zinc-800">Extrato Recente</h2>
            <Search size={18} className="text-zinc-400" />
          </div>
          <div className="flex-1 overflow-auto p-2">
            {lancamentos.length === 0 ? (
              <div className="text-center py-10 text-zinc-400 text-sm">Nenhum lançamento.</div>
            ) : (
              <div className="space-y-1">
                {lancamentos.map(l => (
                  <div key={l.id} className="p-3 hover:bg-zinc-50 rounded-xl transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${l.tipo === 'Receita' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {l.tipo === 'Receita' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-800 text-sm">{l.descricao}</p>
                        <p className="text-xs text-zinc-400">{new Date(l.data).toLocaleDateString('pt-BR')} • {l.status}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <span className={`font-black ${l.tipo === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                        {l.tipo === 'Receita' ? '+' : '-'}{formatarMoeda(l.valor)}
                      </span>
                      <button onClick={() => excluirLancamento(l.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* MODAL */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <h3 className="text-lg font-bold text-zinc-800">Novo Lançamento</h3>
              <button onClick={() => setModalAberto(false)} className="text-zinc-400 hover:text-zinc-600"><X size={20} /></button>
            </div>
            
            <form onSubmit={salvarLancamento} className="p-6 space-y-4">
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="tipo" value="Receita" checked={formData.tipo === 'Receita'} onChange={e => setFormData({...formData, tipo: e.target.value})} className="peer sr-only" />
                  <div className="p-3 text-center border-2 border-zinc-200 rounded-xl peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 font-bold transition-all">
                    Receita
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="tipo" value="Despesa" checked={formData.tipo === 'Despesa'} onChange={e => setFormData({...formData, tipo: e.target.value})} className="peer sr-only" />
                  <div className="p-3 text-center border-2 border-zinc-200 rounded-xl peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-700 font-bold transition-all">
                    Despesa
                  </div>
                </label>
              </div>

              <div>
                <label className="text-sm font-semibold text-zinc-700 mb-1 block">Descrição</label>
                <input required type="text" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} placeholder="Ex: Mensalidade João" className="w-full h-11 px-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-zinc-900 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-zinc-700 mb-1 block">Valor (R$)</label>
                  <input required type="number" step="0.01" value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} placeholder="0.00" className="w-full h-11 px-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-zinc-900 outline-none" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-zinc-700 mb-1 block">Data</label>
                  <input required type="date" value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} className="w-full h-11 px-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-zinc-900 outline-none" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-zinc-700 mb-1 block">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full h-11 px-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-zinc-900 outline-none">
                  <option value="Pago">Pago / Recebido</option>
                  <option value="Pendente">Pendente / Atrasado</option>
                </select>
              </div>

              <div className="pt-4 mt-6 border-t border-zinc-100 flex gap-3">
                <button type="button" onClick={() => setModalAberto(false)} className="flex-1 py-3 text-zinc-600 font-bold hover:bg-zinc-100 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-[2] py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg">Salvar Lançamento</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
