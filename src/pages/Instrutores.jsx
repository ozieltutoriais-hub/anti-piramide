import { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Plus,
  Save,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import app from '../firebase/firebase'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'

const db = getFirestore(app)

export default function Instrutores() {
  const [instrutores, setInstrutores] = useState([])
  const [formVisible, setFormVisible] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    categoria: 'AB',
    validadeCNH: '',
    validadeCredencial: ''
  })

  async function carregarInstrutores() {
    const querySnapshot = await getDocs(collection(db, 'instrutores'))
    const lista = []
    querySnapshot.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() })
    })
    setInstrutores(lista)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarInstrutores()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function cadastrar(e) {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'instrutores'), {
        ...form,
        dataCadastro: serverTimestamp(),
        status: 'Ativo'
      })

      setMensagem('Instrutor cadastrado com sucesso!')
      setFormVisible(false)
      
      setForm({
        nome: '', cpf: '', telefone: '', categoria: 'AB', validadeCNH: '', validadeCredencial: ''
      })
      
      carregarInstrutores()
      setTimeout(() => setMensagem(''), 4000)
    } catch (error) {
      console.error(error)
      alert('Erro ao cadastrar instrutor.')
    }
  }

  const verificarVencimento = (dataStr) => {
    if(!dataStr) return { status: 'ok', msg: '' }
    const dataVenc = new Date(dataStr)
    const hoje = new Date()
    const difTempo = dataVenc.getTime() - hoje.getTime()
    const difDias = Math.ceil(difTempo / (1000 * 3600 * 24))

    if (difDias < 0) return { status: 'vencido', msg: 'Vencido' }
    if (difDias <= 30) return { status: 'alerta', msg: `Vence em ${difDias} dias` }
    return { status: 'ok', msg: 'Regular' }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-800 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
              <Users className="text-white" size={26} />
            </div>
            Corpo de Instrutores
          </h1>
          <p className="text-zinc-500 mt-2">Gestão de credenciais, categorias e equipe.</p>
        </div>
        
        <button 
          onClick={() => setFormVisible(!formVisible)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-all shadow-lg"
        >
          {formVisible ? 'Voltar para Lista' : (
            <>
              <Plus size={20} />
              Novo Instrutor
            </>
          )}
        </button>
      </div>

      {mensagem && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3">
          <CheckCircle className="text-green-600" />
          <span className="font-semibold">{mensagem}</span>
        </div>
      )}

      {formVisible ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
          <h2 className="text-xl font-semibold text-zinc-800 mb-6 border-b border-zinc-100 pb-4">
            Cadastrar Novo Instrutor
          </h2>

          <form onSubmit={cadastrar} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Nome Completo</label>
                <input type="text" name="nome" value={form.nome} onChange={handleChange} className="w-full h-11 px-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">CPF</label>
                <input type="text" name="cpf" value={form.cpf} onChange={handleChange} className="w-full h-11 px-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Telefone</label>
                <input type="text" name="telefone" value={form.telefone} onChange={handleChange} className="w-full h-11 px-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Categoria (Aulas)</label>
                <select name="categoria" value={form.categoria} onChange={handleChange} className="w-full h-11 px-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="A">A (Moto)</option>
                  <option value="B">B (Carro)</option>
                  <option value="AB">AB (Moto e Carro)</option>
                  <option value="D">D (Ônibus)</option>
                  <option value="E">E (Carreta)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Validade CNH</label>
                <input type="date" name="validadeCNH" value={form.validadeCNH} onChange={handleChange} className="w-full h-11 px-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Validade Credencial (Detran)</label>
                <input type="date" name="validadeCredencial" value={form.validadeCredencial} onChange={handleChange} className="w-full h-11 px-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>

            </div>

            <div className="pt-6 border-t border-zinc-100 flex justify-end">
              <button type="submit" className="bg-zinc-900 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 hover:bg-zinc-800 shadow-lg">
                <Save size={20} />
                Salvar Instrutor
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-100">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input type="text" placeholder="Buscar instrutor..." className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-12 pr-4 py-3 text-zinc-700 focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-zinc-400 border-b border-zinc-100">
                  <th className="pb-4 font-semibold text-sm uppercase">Instrutor</th>
                  <th className="pb-4 font-semibold text-sm uppercase">Categoria</th>
                  <th className="pb-4 font-semibold text-sm uppercase">Status CNH</th>
                  <th className="pb-4 font-semibold text-sm uppercase">Credencial</th>
                  <th className="pb-4 font-semibold text-sm uppercase">Situação</th>
                </tr>
              </thead>
              <tbody className="text-zinc-700">
                {instrutores.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-zinc-500">Nenhum instrutor cadastrado.</td>
                  </tr>
                ) : (
                  instrutores.map(i => {
                    const cnhCheck = verificarVencimento(i.validadeCNH)
                    const credCheck = verificarVencimento(i.validadeCredencial)
                    
                    return (
                      <tr key={i.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                        <td className="py-4">
                          <div className="font-bold text-zinc-800">{i.nome}</div>
                          <div className="text-xs text-zinc-500">{i.telefone}</div>
                        </td>
                        <td className="py-4 font-bold text-indigo-600">{i.categoria}</td>
                        <td className="py-4">
                          {cnhCheck.status === 'vencido' && <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded-md w-fit"><AlertTriangle size={14} /> {cnhCheck.msg}</span>}
                          {cnhCheck.status === 'alerta' && <span className="flex items-center gap-1 text-yellow-600 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-md w-fit"><AlertTriangle size={14} /> {cnhCheck.msg}</span>}
                          {cnhCheck.status === 'ok' && <span className="text-green-600 text-xs font-bold">Regular</span>}
                        </td>
                        <td className="py-4">
                          {credCheck.status === 'vencido' && <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded-md w-fit"><AlertTriangle size={14} /> {credCheck.msg}</span>}
                          {credCheck.status === 'alerta' && <span className="flex items-center gap-1 text-yellow-600 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-md w-fit"><AlertTriangle size={14} /> {credCheck.msg}</span>}
                          {credCheck.status === 'ok' && <span className="text-green-600 text-xs font-bold">Regular</span>}
                        </td>
                        <td className="py-4">
                           <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">{i.status}</span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
