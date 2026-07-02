import { useState, useEffect } from 'react'
import {
  Package, Plus, Search, X, Edit2, Trash2, CheckCircle2, ChevronRight, Tags, ArrowLeft
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import app from '../firebase/firebase'
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore'

const db = getFirestore(app)

export default function Pacotes() {
  const navigate = useNavigate()
  
  const [pacotes, setPacotes] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    valor: '',
    categoria: 'Habilitação',
    status: 'Ativo'
  })

  // Buscar pacotes
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'pacotes'), snapshot => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      // Ordenar alfabeticamente
      data.sort((a, b) => a.nome.localeCompare(b.nome))
      setPacotes(data)
    })
    return () => unsub()
  }, [])

  const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)

  async function salvar(e) {
    e.preventDefault()
    try {
      const dados = {
        ...form,
        valor: Number(form.valor)
      }

      if (editandoId) {
        await updateDoc(doc(db, 'pacotes', editandoId), dados)
      } else {
        await addDoc(collection(db, 'pacotes'), dados)
      }

      fecharModal()
    } catch (err) {
      alert('Erro ao salvar pacote')
    }
  }

  function editar(p) {
    setForm({
      nome: p.nome,
      descricao: p.descricao,
      valor: p.valor,
      categoria: p.categoria,
      status: p.status
    })
    setEditandoId(p.id)
    setModalAberto(true)
  }

  async function excluir(id) {
    if(window.confirm('Tem certeza que deseja excluir este pacote?')) {
      try {
        await deleteDoc(doc(db, 'pacotes', id))
      } catch (err) {
        alert('Erro ao excluir')
      }
    }
  }

  function fecharModal() {
    setModalAberto(false)
    setEditandoId(null)
    setForm({
      nome: '',
      descricao: '',
      valor: '',
      categoria: 'Habilitação',
      status: 'Ativo'
    })
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-4 lg:p-8">
      
      {/* HEADER BAR */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-zinc-200 p-5 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-[0_2px_20px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Package size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Pacotes e Serviços</h1>
            <p className="text-sm text-slate-500">Cadastre e gerencie os planos e vendas da autoescola</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="h-10 px-4 rounded-xl bg-white border border-zinc-200 text-slate-700 font-medium hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> Voltar ao Painel
          </button>
          <button onClick={() => setModalAberto(true)} className="h-10 px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold hover:from-indigo-400 hover:to-indigo-500 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 text-sm border border-indigo-500">
            <Plus size={16} /> Novo Pacote
          </button>
        </div>
      </motion.div>

      {/* SEARCH E LISTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b border-zinc-100 flex justify-end">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input placeholder="Buscar pacotes..." className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-50/50">
          {pacotes.length === 0 ? (
            <div className="col-span-full py-10 text-center text-slate-400">Nenhum pacote cadastrado.</div>
          ) : (
            pacotes.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider">
                    <Tags size={12} /> {p.categoria}
                  </span>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => editar(p)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => excluir(p.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>

                <h3 className="font-bold text-slate-800 text-lg mb-1">{p.nome}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{p.descricao}</p>
                
                <div className="pt-4 border-t border-zinc-100 flex items-end justify-between">
                  <div className="text-2xl font-black text-slate-800">{formatarMoeda(p.valor)}</div>
                  <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={14} /> Ativo</div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* MODAL NOVO PACOTE */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200"
          >
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">{editandoId ? 'Editar Pacote' : 'Cadastrar Novo Pacote'}</h3>
            </div>
            
            <form onSubmit={salvar} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wider">Nome do Pacote / Serviço</label>
                  <input required type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Ex: CNH Categoria B" className="w-full h-11 px-4 rounded-xl border border-zinc-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wider">Valor (R$)</label>
                  <input required type="number" step="0.01" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} placeholder="0.00" className="w-full h-11 px-4 rounded-xl border border-zinc-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wider">Categoria</label>
                  <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-zinc-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                    <option>Habilitação</option>
                    <option>Adição / Mudança</option>
                    <option>Aulas Práticas</option>
                    <option>Taxas e Exames</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wider">Descrição (Opcional)</label>
                  <textarea value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} rows={3} placeholder="Itens inclusos, observações..." className="w-full p-4 rounded-xl border border-zinc-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none" />
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-zinc-100 flex gap-3">
                <button type="button" onClick={fecharModal} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-[2] py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold rounded-xl hover:from-indigo-400 hover:to-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
                  {editandoId ? 'Atualizar Pacote' : 'Salvar Pacote'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  )
}
