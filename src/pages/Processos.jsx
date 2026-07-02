import { useState, useEffect } from 'react'
import {
  Kanban,
  Search,
  User,
  Clock,
  ChevronRight,
  CheckCircle2,
  X,
  FileText
} from 'lucide-react'
import app from '../firebase/firebase'
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore'

const db = getFirestore(app)

const COLUNAS = [
  'Matrícula',
  'Médico/Psico',
  'Teórico',
  'Aulas Práticas',
  'Exame Prático',
  'CNH Emitida'
]

export default function Processos() {
  const [alunos, setAlunos] = useState([])
  const [alunoSelecionado, setAlunoSelecionado] = useState(null)
  const [loading, setLoading] = useState(true)

  async function carregarAlunos() {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'alunos'))
      const lista = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        lista.push({
          id: doc.id,
          faseProcesso: data.faseProcesso || 'Matrícula',
          ...data
        })
      })
      setAlunos(lista)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarAlunos()
  }, [])

  // Agrupar alunos por coluna
  const alunosPorFase = COLUNAS.reduce((acc, fase) => {
    acc[fase] = alunos.filter(a => a.faseProcesso === fase)
    return acc
  }, {})

  async function avancarFase(aluno) {
    const faseAtualIndex = COLUNAS.indexOf(aluno.faseProcesso)
    if (faseAtualIndex < COLUNAS.length - 1) {
      const novaFase = COLUNAS[faseAtualIndex + 1]
      
      // Atualizar localmente para interface rápida
      const novosAlunos = alunos.map(a => 
        a.id === aluno.id ? { ...a, faseProcesso: novaFase } : a
      )
      setAlunos(novosAlunos)
      
      // Atualizar no aluno selecionado se o modal estiver aberto
      if (alunoSelecionado && alunoSelecionado.id === aluno.id) {
        setAlunoSelecionado({ ...alunoSelecionado, faseProcesso: novaFase })
      }

      // Salvar no Firebase
      try {
        const alunoRef = doc(db, 'alunos', aluno.id)
        await updateDoc(alunoRef, {
          faseProcesso: novaFase
        })
      } catch (error) {
        console.error('Erro ao atualizar fase', error)
        // reverter em caso de erro idealmente
      }
    }
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-zinc-800 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
              <Kanban className="text-white" size={26} />
            </div>
            Status do Processo
          </h1>
          <p className="text-zinc-500 mt-2">Acompanhamento Kanban inteligente de todos os alunos.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar aluno..."
            className="pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-64"
          />
        </div>
      </div>

      {/* BOARD KANBAN */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full min-w-max">
          {COLUNAS.map(coluna => (
            <div key={coluna} className="w-80 flex flex-col bg-zinc-200/50 rounded-2xl p-3 border border-zinc-200 shadow-sm">
              
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-semibold text-zinc-700">{coluna}</h3>
                <span className="bg-white text-zinc-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {alunosPorFase[coluna]?.length || 0}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {alunosPorFase[coluna]?.map(aluno => (
                  <div 
                    key={aluno.id}
                    onClick={() => setAlunoSelecionado(aluno)}
                    className="bg-white p-4 rounded-xl shadow-sm border border-zinc-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-zinc-800 text-sm">{aluno.nome}</h4>
                        <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                          <span className="bg-zinc-100 px-2 py-0.5 rounded font-medium text-zinc-600">Cat: {aluno.categoria || 'B'}</span>
                          <span>CPF: {aluno.cpf}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {alunosPorFase[coluna]?.length === 0 && !loading && (
                  <div className="text-center py-6 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-400 text-sm">
                    Nenhum aluno nesta fase
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* DRAWER / MODAL DE DETALHES (Raio-X) */}
      {alunoSelecionado && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-[500px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Header Modal */}
            <div className="p-6 bg-[#020817] text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-tight">{alunoSelecionado.nome}</h2>
                  <p className="text-zinc-400 text-sm mt-1">Categoria {alunoSelecionado.categoria || 'B'} • {alunoSelecionado.cpf}</p>
                </div>
              </div>
              <button 
                onClick={() => setAlunoSelecionado(null)}
                className="text-zinc-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto p-8 bg-zinc-50">
              <h3 className="font-semibold text-zinc-800 mb-6 flex items-center gap-2">
                <Clock size={18} className="text-blue-500" />
                Linha do Tempo do Processo
              </h3>

              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
                
                {COLUNAS.map((fase, index) => {
                  const isPassado = COLUNAS.indexOf(fase) < COLUNAS.indexOf(alunoSelecionado.faseProcesso)
                  const isAtual = fase === alunoSelecionado.faseProcesso
                  const isFuturo = COLUNAS.indexOf(fase) > COLUNAS.indexOf(alunoSelecionado.faseProcesso)

                  return (
                    <div key={fase} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      
                      {/* Marker */}
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${
                        isPassado ? 'bg-green-500 text-white' : 
                        isAtual ? 'bg-blue-500 text-white ring-4 ring-blue-500/20' : 'bg-zinc-200 text-zinc-400'
                      }`}>
                        {isPassado ? <CheckCircle2 size={16} /> : <div className={`w-2.5 h-2.5 rounded-full ${isAtual ? 'bg-white' : 'bg-zinc-400'}`} />}
                      </div>

                      {/* Card */}
                      <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border shadow-sm ${
                        isAtual ? 'bg-white border-blue-200' : 'bg-white/50 border-zinc-100'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-bold text-sm ${isAtual ? 'text-blue-600' : 'text-zinc-700'}`}>{fase}</h4>
                          {isPassado && <span className="text-[10px] uppercase font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Concluído</span>}
                          {isAtual && <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Em Andamento</span>}
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">
                          {isPassado ? 'Etapa validada com sucesso.' : isAtual ? 'Aguardando ações ou agendamentos.' : 'Fase bloqueada.'}
                        </p>
                      </div>

                    </div>
                  )
                })}

              </div>
            </div>

            {/* Footer Ações */}
            <div className="p-6 bg-white border-t border-zinc-100">
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 text-zinc-700 rounded-xl font-semibold hover:bg-zinc-200 transition-colors">
                  <FileText size={18} />
                  Ver Ficha
                </button>
                {alunoSelecionado.faseProcesso !== 'CNH Emitida' && (
                  <button 
                    onClick={() => avancarFase(alunoSelecionado)}
                    className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-400 hover:to-blue-500 transition-all shadow-lg shadow-blue-500/25"
                  >
                    Avançar para Próxima Fase
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
