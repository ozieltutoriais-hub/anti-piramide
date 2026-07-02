import { useState, useEffect } from 'react'
import {
  Server,
  Activity,
  ShieldCheck,
  RefreshCcw,
  UploadCloud,
  CheckCircle2,
  Terminal,
  AlertTriangle
} from 'lucide-react'

import { DetranService } from '../services/detran'

export default function IntegracaoDetran() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [ping, setPing] = useState(24)
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), type: 'info', msg: 'Sistema de Integração Iniciado.' },
    { time: new Date().toLocaleTimeString(), type: 'success', msg: 'Conectado à PRODESP/e-CNH.' },
  ])

  // Mock de fila
  const [fila, setFila] = useState([
    { id: 1, aluno: 'João Silva', tipo: 'BCA (Boletim de Cadastro)', status: 'Pendente' },
    { id: 2, aluno: 'Maria Oliveira', tipo: 'Resultado Exame Médico', status: 'Pendente' },
    { id: 3, aluno: 'Carlos Santos', tipo: 'Agendamento LADV', status: 'Erro - CPF Inválido' },
  ])

  // Simular oscilação de Ping
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * (45 - 15 + 1) + 15))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  function addLog(msg, type = 'info') {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type, msg }])
  }

  async function sincronizarLote() {
    setIsSyncing(true)
    addLog('Iniciando processamento em lote da fila...', 'info')
    
    // Simular requests usando o nosso DetranService mockado
    for (let i = 0; i < fila.length; i++) {
      const item = fila[i]
      if (item.status === 'Sincronizado') continue

      addLog(`Processando ${item.tipo} de ${item.aluno}...`, 'info')
      
      try {
        // Mock de delay de rede
        await new Promise(r => setTimeout(r, 1200))
        
        // Simular sucesso/falha
        if (item.id === 3) {
          throw new Error('Retorno SEFAZ: CPF divergente na Receita Federal.')
        }

        addLog(`[200 OK] Sucesso ao integrar: ${item.aluno}`, 'success')
        
        setFila(prev => prev.map(f => f.id === item.id ? { ...f, status: 'Sincronizado' } : f))

      } catch (err) {
        addLog(`[400 ERROR] Falha ao integrar: ${err.message}`, 'error')
      }
    }

    addLog('Processamento em lote finalizado.', 'info')
    setIsSyncing(false)
  }

  return (
    <div className="p-6 bg-[#f4f7fb] min-h-screen text-zinc-800 animate-in fade-in duration-500 flex flex-col h-screen">
      
      {/* HEADER */}
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-zinc-800 tracking-tight flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Server className="text-white" size={26} />
          </div>
          Central de Integração DETRAN-SP
        </h1>
        <p className="text-zinc-500 mt-2">Monitoramento e Envio em Lote para a PRODESP (e-CNH).</p>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* COLUNA ESQUERDA - STATUS E FILA */}
        <div className="col-span-2 flex flex-col gap-6">
          
          {/* CARDS DE HEALTH */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Activity size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-semibold uppercase tracking-wider">Status WebService</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <h3 className="text-2xl font-black text-zinc-800">ONLINE</h3>
                </div>
                <p className="text-xs text-zinc-400 mt-1">Ping: {ping}ms | PRODESP SP</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ShieldCheck size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-semibold uppercase tracking-wider">Certificado A1</p>
                <h3 className="text-2xl font-black text-zinc-800">VÁLIDO</h3>
                <p className="text-xs text-zinc-400 mt-1">Vence em: 14/11/2027</p>
              </div>
            </div>

          </div>

          {/* FILA DE PROCESSAMENTO */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex-1 flex flex-col min-h-0">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-zinc-50 rounded-t-2xl">
              <h2 className="font-bold text-zinc-800 text-lg flex items-center gap-2">
                <RefreshCcw size={20} className="text-blue-500" />
                Fila de Sincronização
              </h2>
              <button 
                onClick={sincronizarLote}
                disabled={isSyncing}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSyncing ? (
                  <RefreshCcw size={18} className="animate-spin" />
                ) : (
                  <UploadCloud size={18} />
                )}
                Sincronizar Lote
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100">
                    <th className="p-4">Aluno</th>
                    <th className="p-4">Tipo de Envio</th>
                    <th className="p-4">Status Atual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 text-sm font-medium text-zinc-700">
                  {fila.map(item => (
                    <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="p-4">{item.aluno}</td>
                      <td className="p-4 text-zinc-500">{item.tipo}</td>
                      <td className="p-4">
                        {item.status === 'Sincronizado' ? (
                          <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg w-fit">
                            <CheckCircle2 size={16} /> Sincronizado
                          </span>
                        ) : item.status.includes('Erro') ? (
                          <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-lg w-fit">
                            <AlertTriangle size={16} /> {item.status}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg w-fit">
                            <RefreshCcw size={16} className={isSyncing ? 'animate-spin' : ''} /> Pendente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>

        {/* COLUNA DIREITA - CONSOLE DE LOGS */}
        <div className="bg-[#0b1730] rounded-2xl border border-zinc-800 shadow-2xl flex flex-col min-h-0 overflow-hidden font-mono text-sm relative">
          
          <div className="p-4 bg-[#081120] border-b border-white/10 shrink-0 flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-zinc-400 text-xs font-bold flex items-center gap-2 ml-2">
              <Terminal size={14} /> DETRAN GATEWAY LOGS
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-end">
            <div className="space-y-2">
              {logs.map((l, i) => (
                <div key={i} className="flex gap-3 leading-relaxed">
                  <span className="text-zinc-500 shrink-0">[{l.time}]</span>
                  <span className={`
                    ${l.type === 'success' ? 'text-green-400' : ''}
                    ${l.type === 'error' ? 'text-red-400' : ''}
                    ${l.type === 'info' ? 'text-blue-300' : ''}
                  `}>
                    {l.msg}
                  </span>
                </div>
              ))}
              {isSyncing && (
                <div className="flex gap-3 text-zinc-500">
                  <span>[{new Date().toLocaleTimeString()}]</span>
                  <span className="animate-pulse">Aguardando resposta da PRODESP...</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
