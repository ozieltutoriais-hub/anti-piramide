import { useState, useEffect } from 'react'
import {
  Car,
  Plus,
  Save,
  CheckCircle,
  AlertCircle,
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

export default function Veiculos() {
  const [activeTab, setActiveTab] = useState('veiculos')
  
  const [veiculos, setVeiculos] = useState([])
  const [formVisible, setFormVisible] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const [form, setForm] = useState({
    placa: '',
    marca: '',
    modelo: '',
    ano: '',
    renavam: '',
    categoria: 'B',
    kmAtual: '',
    vencimentoSeguro: '',
    vencimentoIPVA: ''
  })

  const [multas, setMultas] = useState([])
  const [instrutores, setInstrutores] = useState([])
  const [formMultaVisible, setFormMultaVisible] = useState(false)
  const [mensagemMulta, setMensagemMulta] = useState('')
  
  const [formMulta, setFormMulta] = useState({
    veiculoId: '',
    instrutorId: '',
    data: '',
    gravidade: 'Média',
    valor: ''
  })

  async function carregarDados() {
    const veicSnapshot = await getDocs(collection(db, 'veiculos'))
    const listaVeic = []
    veicSnapshot.forEach((doc) => listaVeic.push({ id: doc.id, ...doc.data() }))
    
    const instSnapshot = await getDocs(collection(db, 'instrutores'))
    const listaInst = []
    instSnapshot.forEach((doc) => listaInst.push({ id: doc.id, ...doc.data() }))
    
    const multasSnapshot = await getDocs(collection(db, 'multas'))
    const listaMultas = []
    multasSnapshot.forEach((doc) => listaMultas.push({ id: doc.id, ...doc.data() }))
    
    listaMultas.sort((a,b) => new Date(b.data) - new Date(a.data))
    
    setVeiculos(listaVeic)
    setInstrutores(listaInst)
    setMultas(listaMultas)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarDados()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function cadastrarVeiculo(e) {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'veiculos'), {
        ...form,
        dataCadastro: serverTimestamp(),
        status: 'Ativo'
      })
      setMensagem('Veículo cadastrado com sucesso!')
      setFormVisible(false)
      setForm({
        placa: '', marca: '', modelo: '', ano: '', renavam: '', 
        categoria: 'B', kmAtual: '', vencimentoSeguro: '', vencimentoIPVA: ''
      })
      carregarDados()
      setTimeout(() => setMensagem(''), 4000)
    } catch (error) {
      console.error(error)
      alert('Erro ao cadastrar veículo.')
    }
  }

  function handleMultaChange(e) {
    setFormMulta({ ...formMulta, [e.target.name]: e.target.value })
  }

  async function cadastrarMulta(e) {
    e.preventDefault()
    try {
      const placaVeiculo = veiculos.find(v => v.id === formMulta.veiculoId)?.placa || 'Desconhecido'
      const nomeInstrutor = instrutores.find(i => i.id === formMulta.instrutorId)?.nome || 'Desconhecido'

      await addDoc(collection(db, 'multas'), {
        ...formMulta,
        placaVeiculo,
        nomeInstrutor,
        dataCadastro: serverTimestamp()
      })

      await addDoc(collection(db, 'financeiro'), {
        descricao: `Multa: ${placaVeiculo} - Resp: ${nomeInstrutor}`,
        valor: Number(formMulta.valor),
        tipo: 'Despesa',
        data: formMulta.data,
        status: 'Pendente'
      })

      setMensagemMulta('Multa registrada e Despesa Financeira gerada automaticamente!')
      setFormMultaVisible(false)
      setFormMulta({ veiculoId: '', instrutorId: '', data: '', gravidade: 'Média', valor: '' })
      
      carregarDados()
      setTimeout(() => setMensagemMulta(''), 6000)
    } catch (error) {
      console.error(error)
      alert('Erro ao cadastrar multa.')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
      
      <div className="flex flex-col gap-6 mb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-800 tracking-tight flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <Car className="text-white" size={26} />
              </div>
              Gestão de Frota e Infrações
            </h1>
            <p className="text-zinc-500 mt-2">Controle de veículos, documentação e pontuação/multas.</p>
          </div>
        </div>

        <div className="flex gap-4 border-b border-zinc-200">
          <button 
            onClick={() => setActiveTab('veiculos')}
            className={`px-4 py-3 font-bold transition-all ${activeTab === 'veiculos' ? 'text-green-600 border-b-2 border-green-600' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            Veículos da Frota
          </button>
          <button 
            onClick={() => setActiveTab('multas')}
            className={`px-4 py-3 font-bold transition-all ${activeTab === 'multas' ? 'text-red-500 border-b-2 border-red-500' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            Controle de Multas
          </button>
        </div>
      </div>

      {activeTab === 'veiculos' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button 
              onClick={() => setFormVisible(!formVisible)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-all shadow-lg"
            >
              {formVisible ? 'Voltar para Lista' : <><Plus size={20} /> Novo Veículo</>}
            </button>
          </div>

          {mensagem && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3">
              <CheckCircle className="text-green-600" />
              <span className="font-semibold">{mensagem}</span>
            </div>
          )}

          {formVisible ? (
            <div className="bg-[#020817] p-8 rounded-2xl shadow-xl border border-white/5">
              <h2 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-4">
                Cadastrar Novo Veículo
              </h2>
              <form onSubmit={cadastrarVeiculo} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Placa</label>
                    <input type="text" name="placa" value={form.placa} onChange={handleChange} className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Marca</label>
                    <input type="text" name="marca" value={form.marca} onChange={handleChange} className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Modelo</label>
                    <input type="text" name="modelo" value={form.modelo} onChange={handleChange} className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Ano</label>
                    <input type="text" name="ano" value={form.ano} onChange={handleChange} className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Renavam</label>
                    <input type="text" name="renavam" value={form.renavam} onChange={handleChange} className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Categoria (CNH)</label>
                    <select name="categoria" value={form.categoria} onChange={handleChange} className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500">
                      <option value="A">A (Moto)</option>
                      <option value="B">B (Carro)</option>
                      <option value="C">C (Caminhão)</option>
                      <option value="D">D (Ônibus)</option>
                      <option value="E">E (Carreta)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">KM Atual</label>
                    <input type="number" name="kmAtual" value={form.kmAtual} onChange={handleChange} className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Vencimento IPVA</label>
                    <input type="date" name="vencimentoIPVA" value={form.vencimentoIPVA} onChange={handleChange} className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Vencimento Seguro</label>
                    <input type="date" name="vencimentoSeguro" value={form.vencimentoSeguro} onChange={handleChange} className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" />
                  </div>

                </div>
                <div className="pt-6 border-t border-white/10 flex justify-end">
                  <button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-8 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,80,0.2)]">
                    <Save size={20} /> Salvar Veículo
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-zinc-400 border-b border-zinc-100">
                    <th className="pb-4 font-semibold text-sm uppercase">Veículo</th>
                    <th className="pb-4 font-semibold text-sm uppercase">Placa</th>
                    <th className="pb-4 font-semibold text-sm uppercase">Categoria</th>
                    <th className="pb-4 font-semibold text-sm uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-700">
                  {veiculos.map(v => (
                    <tr key={v.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                      <td className="py-4 font-semibold">{v.marca} {v.modelo} <span className="text-xs text-zinc-400 font-normal ml-2">{v.ano}</span></td>
                      <td className="py-4 font-mono">{v.placa}</td>
                      <td className="py-4"><span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-xs font-bold">{v.categoria}</span></td>
                      <td className="py-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">{v.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'multas' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button 
              onClick={() => setFormMultaVisible(!formMultaVisible)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg"
            >
              {formMultaVisible ? 'Voltar para Lista' : <><AlertTriangle size={20} /> Registrar Multa</>}
            </button>
          </div>

          {mensagemMulta && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-xl flex items-center gap-3">
              <AlertTriangle className="text-yellow-600" />
              <span className="font-semibold">{mensagemMulta}</span>
            </div>
          )}

          {formMultaVisible ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100">
              <h2 className="text-xl font-bold text-zinc-800 mb-6 border-b border-zinc-100 pb-4 text-red-600 flex items-center gap-2">
                <AlertCircle size={24} /> Nova Infração de Trânsito
              </h2>
              <form onSubmit={cadastrarMulta} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700">Veículo Autuado</label>
                    <select required name="veiculoId" value={formMulta.veiculoId} onChange={handleMultaChange} className="w-full h-11 px-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-red-500 outline-none">
                      <option value="">Selecione o Veículo...</option>
                      {veiculos.map(v => <option key={v.id} value={v.id}>{v.placa} - {v.modelo}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700">Instrutor Responsável</label>
                    <select required name="instrutorId" value={formMulta.instrutorId} onChange={handleMultaChange} className="w-full h-11 px-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-red-500 outline-none">
                      <option value="">Selecione o Instrutor...</option>
                      {instrutores.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700">Data da Infração</label>
                    <input required type="date" name="data" value={formMulta.data} onChange={handleMultaChange} className="w-full h-11 px-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-red-500 outline-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700">Gravidade</label>
                    <select required name="gravidade" value={formMulta.gravidade} onChange={handleMultaChange} className="w-full h-11 px-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-red-500 outline-none">
                      <option value="Leve">Leve (3 pontos)</option>
                      <option value="Média">Média (4 pontos)</option>
                      <option value="Grave">Grave (5 pontos)</option>
                      <option value="Gravíssima">Gravíssima (7 pontos)</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-zinc-700">Valor da Multa (R$)</label>
                    <input required type="number" step="0.01" name="valor" value={formMulta.valor} onChange={handleMultaChange} placeholder="0.00" className="w-full md:w-1/2 h-11 px-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-red-500 outline-none" />
                  </div>

                </div>

                <div className="pt-6 border-t border-zinc-100 flex justify-end">
                  <button type="submit" className="bg-red-600 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 hover:bg-red-700 shadow-lg">
                    <AlertTriangle size={20} /> Salvar Multa e Gerar Despesa
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-zinc-400 border-b border-zinc-100">
                    <th className="pb-4 font-semibold text-sm uppercase">Data</th>
                    <th className="pb-4 font-semibold text-sm uppercase">Veículo</th>
                    <th className="pb-4 font-semibold text-sm uppercase">Responsável</th>
                    <th className="pb-4 font-semibold text-sm uppercase">Gravidade</th>
                    <th className="pb-4 font-semibold text-sm uppercase">Valor</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-700">
                  {multas.length === 0 ? (
                     <tr><td colSpan="5" className="text-center py-8 text-zinc-500">Nenhuma multa registrada.</td></tr>
                  ) : (
                    multas.map(m => (
                      <tr key={m.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                        <td className="py-4 text-sm font-bold text-zinc-600">{new Date(m.data).toLocaleDateString('pt-BR')}</td>
                        <td className="py-4 font-mono font-bold">{m.placaVeiculo}</td>
                        <td className="py-4 text-sm">{m.nomeInstrutor}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            m.gravidade === 'Gravíssima' ? 'bg-red-100 text-red-700' :
                            m.gravidade === 'Grave' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {m.gravidade}
                          </span>
                        </td>
                        <td className="py-4 font-bold text-red-600">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(m.valor))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
