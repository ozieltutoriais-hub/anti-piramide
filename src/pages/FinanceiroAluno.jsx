import { useState, useEffect } from 'react'
import {
  User, CreditCard, DollarSign, Calendar, CheckCircle2, AlertCircle, Plus, Receipt, ArrowLeft, Package, Printer
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

import app from '../firebase/firebase'
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, query, where } from 'firebase/firestore'

const db = getFirestore(app)

export default function FinanceiroAluno() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const alunoSelecionado = location.state?.aluno

  if (!alunoSelecionado || !alunoSelecionado.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <AlertCircle size={48} className="text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Nenhum aluno selecionado</h2>
        <p className="text-slate-500 mb-6">Por favor, pesquise e selecione um aluno na tela de Cadastro primeiro.</p>
        <button onClick={() => navigate('/cadastro')} className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg">
          Voltar ao Cadastro
        </button>
      </div>
    )
  }
  
  const alunoInfo = {
    nome: alunoSelecionado.nome,
    cpf: alunoSelecionado.cpf,
    pacote: 'Não informado', // Pode ser vinculado ao pacote futuramente
    id: alunoSelecionado.id
  }

  const [parcelas, setParcelas] = useState([])
  const [pacotes, setPacotes] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [modalVendaAberto, setModalVendaAberto] = useState(false)
  const [modalReceber, setModalReceber] = useState({ aberto: false, id: null, valor: 0, descricao: '' })
  const [formaPagamento, setFormaPagamento] = useState('PIX')
  const [reciboPrint, setReciboPrint] = useState(null)
  const [tipoRecibo, setTipoRecibo] = useState('A4')
  const [venda, setVenda] = useState({
    pacoteId: '',
    qtdParcelas: 1,
    vencimentoInicial: new Date().toISOString().slice(0, 10)
  })
  const [novaParcela, setNovaParcela] = useState({
    descricao: 'Parcela CNH',
    valor: '',
    vencimento: '',
    status: 'Pendente'
  })

  // Buscar parcelas do aluno
  useEffect(() => {
    if (!alunoInfo.id) return;
    const q = query(collection(db, 'mensalidades_aluno'), where('alunoId', '==', alunoInfo.id))
    const unsub = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento))
      setParcelas(data)
    })
    return () => unsub()
  }, [])

  // Buscar pacotes disponíveis
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'pacotes'), snapshot => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => a.nome.localeCompare(b.nome))
      setPacotes(data)
    })
    return () => unsub()
  }, [])

  const total = parcelas.reduce((acc, curr) => acc + Number(curr.valor), 0)
  const totalPago = parcelas.filter(p => p.status === 'Pago').reduce((acc, curr) => acc + Number(curr.valor), 0)
  const totalPendente = total - totalPago

  function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
  }

  function imprimirRecibo(parcela, tipo) {
    setTipoRecibo(tipo)
    setReciboPrint(parcela)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  async function gerarCobranca(e) {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'mensalidades_aluno'), {
        ...novaParcela,
        alunoId: alunoInfo.id,
        valor: Number(novaParcela.valor)
      })
      setModalAberto(false)
      setNovaParcela({ descricao: 'Cobrança Avulsa', valor: '', vencimento: '', status: 'Pendente' })
    } catch(err) {
      alert('Erro ao gerar cobrança')
    }
  }

  async function processarVendaPacote(e) {
    e.preventDefault()
    if (!venda.pacoteId) return alert('Selecione um pacote!')

    const pacoteSelecionado = pacotes.find(p => p.id === venda.pacoteId)
    if (!pacoteSelecionado) return

    const valorTotal = pacoteSelecionado.valor
    const numParcelas = Number(venda.qtdParcelas)
    const valorParcela = valorTotal / numParcelas

    try {
      let dataBase = new Date(venda.vencimentoInicial + 'T12:00:00')

      for (let i = 1; i <= numParcelas; i++) {
        const novaData = new Date(dataBase)
        novaData.setMonth(novaData.getMonth() + (i - 1))
        
        await addDoc(collection(db, 'mensalidades_aluno'), {
          alunoId: alunoInfo.id,
          descricao: `${pacoteSelecionado.nome} (Parc. ${i}/${numParcelas})`,
          valor: valorParcela,
          vencimento: novaData.toISOString().slice(0, 10),
          status: 'Pendente'
        })
      }

      setModalVendaAberto(false)
      setVenda({ pacoteId: '', qtdParcelas: 1, vencimentoInicial: new Date().toISOString().slice(0, 10) })
      alert('Pacote vendido e parcelas geradas com sucesso!')
    } catch(err) {
      console.error(err)
      alert('Erro ao processar venda de pacote')
    }
  }

  function abrirModalReceber(id, valor, descricao) {
    setModalReceber({ aberto: true, id, valor, descricao })
    setFormaPagamento('PIX')
  }

  async function confirmarRecebimento(e) {
    e.preventDefault()
    try {
      await updateDoc(doc(db, 'mensalidades_aluno', modalReceber.id), {
        status: 'Pago',
        dataPagamento: new Date().toISOString(),
        formaPagamento: formaPagamento
      })
      
      // Registrar no caixa geral
      await addDoc(collection(db, 'financeiro'), {
        descricao: `Recebimento Aluno: ${alunoInfo.nome} - ${modalReceber.descricao} (${formaPagamento})`,
        valor: Number(modalReceber.valor),
        tipo: 'Receita',
        data: new Date().toISOString().slice(0, 10),
        status: 'Pago',
        formaPagamento: formaPagamento
      })

      setModalReceber({ aberto: false, id: null, valor: 0, descricao: '' })
      alert('Pagamento registrado com sucesso!')
    } catch(err) {
      alert('Erro ao processar pagamento')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 print:pb-0 print:bg-white">
      
      {/* CONTEÚDO PRINCIPAL - OCULTO NA IMPRESSÃO */}
      <div className="max-w-5xl mx-auto p-6 print:hidden">
      
      {/* HEADER BAR */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-zinc-200 p-5 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-[0_2px_20px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <DollarSign size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Financeiro do Aluno</h1>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <User size={14} /> {alunoInfo.nome} • {alunoInfo.pacote}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/pacotes')} className="h-10 px-4 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-all shadow-sm flex items-center gap-2 text-sm">
            <Package size={16} /> Configurar Pacotes
          </button>
          
          <button onClick={() => setModalVendaAberto(true)} className="h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 text-sm border border-emerald-500">
            <Package size={16} /> Vender Pacote
          </button>

          <button onClick={() => setModalAberto(true)} className="h-10 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-400 transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2 text-sm border border-orange-500">
            <Plus size={16} /> Cobrança Avulsa
          </button>
          
          <div className="h-8 w-px bg-zinc-200 mx-1 hidden lg:block"></div>

          <button onClick={() => navigate('/cadastro')} className="h-10 px-4 rounded-xl bg-white border border-zinc-200 text-slate-700 font-medium hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> Voltar
          </button>
        </div>
      </motion.div>

      {/* DASHBOARD CARDS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-slate-500 font-semibold text-sm">Valor Total do Contrato</p>
            <CreditCard className="text-blue-500" size={20} />
          </div>
          <h3 className="text-3xl font-black text-slate-800">{formatarMoeda(total)}</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-slate-500 font-semibold text-sm">Total Pago</p>
            <CheckCircle2 className="text-emerald-500" size={20} />
          </div>
          <h3 className="text-3xl font-black text-emerald-600">{formatarMoeda(totalPago)}</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-slate-500 font-semibold text-sm">Saldo Pendente</p>
            <AlertCircle className="text-orange-500" size={20} />
          </div>
          <h3 className="text-3xl font-black text-orange-600">{formatarMoeda(totalPendente)}</h3>
        </div>
      </motion.div>

      {/* LISTA DE COBRANÇAS */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden"
      >
        <div className="bg-slate-50/50 border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="text-orange-500" size={20} />
            Cronograma de Pagamentos
          </h2>
        </div>
        
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-zinc-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="p-4">Descrição</th>
                <th className="p-4">Vencimento</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {parcelas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">Nenhuma cobrança registrada para este aluno. Crie uma nova!</td>
                </tr>
              ) : (
                parcelas.map(p => (
                  <tr key={p.id} className="border-b border-zinc-100 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{p.descricao}</td>
                    <td className="p-4 text-slate-600 flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(p.vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4 font-bold text-slate-800">{formatarMoeda(p.valor)}</td>
                    <td className="p-4">
                      {p.status === 'Pago' ? (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                          <CheckCircle2 size={12} /> Pago
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">
                          <AlertCircle size={12} /> Pendente
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {p.status !== 'Pago' ? (
                        <button 
                          onClick={() => abrirModalReceber(p.id, p.valor, p.descricao)}
                          className="h-8 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ml-auto"
                        >
                          <DollarSign size={14} /> Receber
                        </button>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => imprimirRecibo(p, 'A4')}
                            title="Recibo A4 (Brother 8157)"
                            className="h-8 px-3 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 text-slate-600 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                          >
                            <Printer size={14} /> A4
                          </button>
                          <button 
                            onClick={() => imprimirRecibo(p, 'Termica')}
                            title="Cupom 80mm (Sweda)"
                            className="h-8 px-3 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 text-slate-600 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                          >
                            <Receipt size={14} /> Cupom
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* MODAL COBRANÇA AVULSA */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200"
          >
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Cobrança Avulsa</h3>
            </div>
            
            <form onSubmit={gerarCobranca} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wider">Descrição</label>
                <input required type="text" value={novaParcela.descricao} onChange={e => setNovaParcela({...novaParcela, descricao: e.target.value})} placeholder="Ex: Taxa de Re-teste" className="w-full h-11 px-4 rounded-xl border border-zinc-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wider">Valor (R$)</label>
                  <input required type="number" step="0.01" value={novaParcela.valor} onChange={e => setNovaParcela({...novaParcela, valor: e.target.value})} placeholder="0.00" className="w-full h-11 px-4 rounded-xl border border-zinc-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wider">Vencimento</label>
                  <input required type="date" value={novaParcela.vencimento} onChange={e => setNovaParcela({...novaParcela, vencimento: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-zinc-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-zinc-100 flex gap-3">
                <button type="button" onClick={() => setModalAberto(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-[2] py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-400 hover:to-orange-500 transition-all shadow-lg shadow-orange-500/20">Gerar Cobrança</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL VENDER PACOTE */}
      {modalVendaAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200"
          >
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Vender Pacote / Serviços</h3>
            </div>
            
            <form onSubmit={processarVendaPacote} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wider">Selecione o Pacote <span className="text-red-500">*</span></label>
                <select required value={venda.pacoteId} onChange={e => setVenda({...venda, pacoteId: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-zinc-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  <option value="">Selecione...</option>
                  {pacotes.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} - {formatarMoeda(p.valor)}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wider">Parcelar em (x) <span className="text-red-500">*</span></label>
                  <select required value={venda.qtdParcelas} onChange={e => setVenda({...venda, qtdParcelas: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-zinc-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                      <option key={n} value={n}>{n}x</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wider">1º Vencimento <span className="text-red-500">*</span></label>
                  <input required type="date" value={venda.vencimentoInicial} onChange={e => setVenda({...venda, vencimentoInicial: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-zinc-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                </div>
              </div>
              
              {venda.pacoteId && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl mt-2">
                  <p className="text-xs text-blue-700 font-semibold text-center">
                    Serão geradas {venda.qtdParcelas} parcelas de {formatarMoeda(pacotes.find(p => p.id === venda.pacoteId)?.valor / venda.qtdParcelas)}
                  </p>
                </div>
              )}

              <div className="pt-4 mt-6 border-t border-zinc-100 flex gap-3">
                <button type="button" onClick={() => setModalVendaAberto(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-[2] py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20">Confirmar Venda</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL RECEBER PARCELA */}
      {modalReceber.aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-zinc-200"
          >
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Confirmar Recebimento</h3>
            </div>
            
            <form onSubmit={confirmarRecebimento} className="p-6 space-y-4">
              <div className="text-center mb-6 mt-2">
                <p className="text-sm text-slate-500 mb-1">{modalReceber.descricao}</p>
                <p className="text-4xl font-black text-emerald-600">{formatarMoeda(modalReceber.valor)}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-2 block uppercase tracking-wider text-center">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-3">
                  {['PIX', 'Dinheiro', 'Cartão', 'Link'].map(forma => (
                    <label key={forma} className="cursor-pointer">
                      <input type="radio" name="formaPagamento" value={forma} checked={formaPagamento === forma} onChange={e => setFormaPagamento(e.target.value)} className="peer sr-only" />
                      <div className="p-3 text-center border-2 border-zinc-200 rounded-xl peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 font-bold transition-all text-sm text-slate-600">
                        {forma}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-zinc-100 flex gap-3">
                <button type="button" onClick={() => setModalReceber({ aberto: false, id: null, valor: 0, descricao: '' })} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-[2] py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20">Receber</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      </div> {/* FIM DO CONTEÚDO PRINCIPAL */}

      {/* ÁREA DE IMPRESSÃO DO RECIBO */}
      {reciboPrint && (
        <div className="hidden print:block">
          
          {/* LAYOUT A4 (BROTHER 8157) */}
          {tipoRecibo === 'A4' && (
            <div className="p-8 bg-white text-black w-full max-w-3xl mx-auto border-4 border-double border-zinc-400">
               <div className="text-center mb-8">
                 <h1 className="text-3xl font-black uppercase tracking-widest border-b-2 border-black pb-4">Auto Escola Online</h1>
                 <h2 className="text-2xl font-bold mt-4">RECIBO DE PAGAMENTO</h2>
                 <p className="text-lg mt-2 text-zinc-600">Nº {reciboPrint.id.substring(0, 8).toUpperCase()}</p>
               </div>

               <div className="space-y-5 text-xl mt-12 mb-20 px-8">
                 <p className="flex justify-between border-b border-zinc-200 pb-2">
                   <span className="text-zinc-500 font-semibold uppercase text-sm tracking-wider">Recebemos de</span>
                   <span className="font-bold">{alunoInfo.nome}</span>
                 </p>
                 <p className="flex justify-between border-b border-zinc-200 pb-2">
                   <span className="text-zinc-500 font-semibold uppercase text-sm tracking-wider">A importância de</span>
                   <span className="font-bold text-2xl">{formatarMoeda(reciboPrint.valor)}</span>
                 </p>
                 <p className="flex justify-between border-b border-zinc-200 pb-2">
                   <span className="text-zinc-500 font-semibold uppercase text-sm tracking-wider">Referente a</span>
                   <span className="font-bold">{reciboPrint.descricao}</span>
                 </p>
                 <p className="flex justify-between border-b border-zinc-200 pb-2">
                   <span className="text-zinc-500 font-semibold uppercase text-sm tracking-wider">Forma de Pagamento</span>
                   <span className="font-bold">{reciboPrint.formaPagamento || 'Dinheiro'}</span>
                 </p>
                 <p className="flex justify-between border-b border-zinc-200 pb-2">
                   <span className="text-zinc-500 font-semibold uppercase text-sm tracking-wider">Data do Pagamento</span>
                   <span className="font-bold">{reciboPrint.dataPagamento ? new Date(reciboPrint.dataPagamento).toLocaleDateString('pt-BR') : '-'}</span>
                 </p>
               </div>

               <div className="mt-20 pt-8 border-t-2 border-black text-center mx-16">
                 <p className="font-black text-xl uppercase tracking-wider">Auto Escola Online</p>
                 <p className="text-zinc-500 mt-1">Assinatura / Carimbo</p>
               </div>

               <div className="mt-16 text-center text-xs text-zinc-400 font-mono">
                 Documento gerado eletronicamente em {new Date().toLocaleString('pt-BR')} - ID: {reciboPrint.id}
               </div>
            </div>
          )}

          {/* LAYOUT TÉRMICA 80mm (SWEDA) */}
          {tipoRecibo === 'Termica' && (
            <div className="bg-white text-black font-mono text-sm leading-tight" style={{ width: '75mm', margin: 0, padding: 0 }}>
              <div className="text-center mb-4">
                <h1 className="text-lg font-bold uppercase">Auto Escola Online</h1>
                <p className="text-xs">Rua Exemplo, 123 - Centro</p>
                <p className="text-xs">CNPJ: 00.000.000/0001-00</p>
                <p className="text-xs">Tel: (11) 99999-9999</p>
              </div>
              
              <div className="border-t border-dashed border-black my-2"></div>
              <h2 className="text-center font-bold text-sm my-2 uppercase">Recibo de Pagamento</h2>
              <div className="border-t border-dashed border-black my-2"></div>
              
              <div className="text-xs space-y-1 mb-4">
                <p><strong>Nº:</strong> {reciboPrint.id.substring(0, 8).toUpperCase()}</p>
                <p><strong>Data:</strong> {reciboPrint.dataPagamento ? new Date(reciboPrint.dataPagamento).toLocaleDateString('pt-BR') : '-'}</p>
                <p><strong>Cliente:</strong> {alunoInfo.nome}</p>
                <div className="border-t border-dashed border-black my-2"></div>
                <p className="uppercase"><strong>Ref:</strong> {reciboPrint.descricao}</p>
                <div className="border-t border-dashed border-black my-2"></div>
                <p className="flex justify-between font-bold text-sm mt-2">
                  <span>TOTAL:</span>
                  <span>{formatarMoeda(reciboPrint.valor)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Pgto:</span>
                  <span>{reciboPrint.formaPagamento || 'Dinheiro'}</span>
                </p>
              </div>

              <div className="border-t border-dashed border-black my-4"></div>
              
              <div className="text-center text-xs space-y-6">
                <p className="px-2">_________________________________<br/>Assinatura do Responsável</p>
                <p className="font-bold">Obrigado pela preferência!</p>
                <p className="text-[10px]">Emissão: {new Date().toLocaleString('pt-BR')}</p>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  )
}
