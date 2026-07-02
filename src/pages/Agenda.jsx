import { useState, useEffect } from 'react'
import {
  Calendar as CalendarIcon,
  Search,
  Plus,
  X
} from 'lucide-react'

import app from '../firebase/firebase'
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const db = getFirestore(app)

export default function Agenda() {
  const [aulas, setAulas] = useState([])
  const [alunos, setAlunos] = useState([])
  const [instrutores, setInstrutores] = useState([])
  const [veiculos, setVeiculos] = useState([])

  const [filtroInstrutor, setFiltroInstrutor] = useState('Todos')
  const [filtroVeiculo, setFiltroVeiculo] = useState('Todos')
  const [filtroAluno, setFiltroAluno] = useState('Todos')
  
  const [modalAberto, setModalAberto] = useState(false)
  const [formData, setFormData] = useState({
    alunoId: '',
    instrutorId: '',
    veiculoId: '',
    dataInicio: '',
    dataFim: '',
    tipo: 'Carro'
  })
  const [eventoSelecionado, setEventoSelecionado] = useState(null)

  useEffect(() => {
    // Buscar todas as coleções
    const unsubAulas = onSnapshot(collection(db, 'aulas'), snapshot => {
      setAulas(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    const unsubAlunos = onSnapshot(collection(db, 'alunos'), snapshot => {
      setAlunos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    const unsubInstr = onSnapshot(collection(db, 'profissionais'), snapshot => {
      // Filtrar apenas instrutores se necessário, ou usar todos
      setInstrutores(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    const unsubVeic = onSnapshot(collection(db, 'veiculos'), snapshot => {
      setVeiculos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })

    return () => {
      unsubAulas()
      unsubAlunos()
      unsubInstr()
      unsubVeic()
    }
  }, [])

  // Filtrar eventos pro calendário
  const eventosFormatados = aulas
    .filter(aula => filtroInstrutor === 'Todos' || aula.instrutorId === filtroInstrutor)
    .filter(aula => filtroVeiculo === 'Todos' || aula.veiculoId === filtroVeiculo)
    .filter(aula => filtroAluno === 'Todos' || aula.alunoId === filtroAluno)
    .map(aula => {
      const alunoInfo = alunos.find(a => a.id === aula.alunoId)
      const nome = alunoInfo ? alunoInfo.nome : (aula.nomeAluno || 'Aluno Desconhecido')
      
      let cor = '#3b82f6' // blue para carro
      if(aula.tipo === 'Moto') cor = '#8b5cf6' // purple
      if(aula.tipo === 'Simulador') cor = '#10b981' // emerald

      return {
        id: aula.id,
        title: `${nome} (${aula.tipo})`,
        start: aula.dataInicio,
        end: aula.dataFim,
        backgroundColor: cor,
        borderColor: cor,
        extendedProps: { ...aula }
      }
    })

  async function salvarAula(e) {
    e.preventDefault()
    if (!formData.alunoId || !formData.instrutorId || !formData.veiculoId || !formData.dataInicio || !formData.dataFim) {
      alert("Preencha todos os campos obrigatórios!")
      return
    }

    try {
      if (eventoSelecionado) {
        // Atualizar
        await updateDoc(doc(db, 'aulas', eventoSelecionado.id), formData)
      } else {
        // Criar
        await addDoc(collection(db, 'aulas'), formData)
      }
      fecharModal()
    } catch(err) {
      console.error(err)
      alert("Erro ao salvar aula.")
    }
  }

  async function excluirAula() {
    if(window.confirm("Deseja realmente excluir esta aula?")) {
      await deleteDoc(doc(db, 'aulas', eventoSelecionado.id))
      fecharModal()
    }
  }

  // Handler arrastar/redimensionar FullCalendar
  async function handleEventChange(changeInfo) {
    const id = changeInfo.event.id
    const start = changeInfo.event.start.toISOString()
    const end = changeInfo.event.end ? changeInfo.event.end.toISOString() : null

    try {
      await updateDoc(doc(db, 'aulas', id), {
        dataInicio: start,
        ...(end && { dataFim: end })
      })
    } catch(error) {
      console.error(error)
      changeInfo.revert()
    }
  }

  function abrirNovoAgendamento(info) {
    setEventoSelecionado(null)
    let inicio = '';
    let fim = '';

    if (info?.date) {
      // Ajuste de fuso para pegar a hora certa clicada no calendário
      const start = new Date(info.date);
      inicio = new Date(start.getTime() - start.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      
      // Aula padrão de 50 minutos
      const end = new Date(start.getTime() + 50 * 60000);
      fim = new Date(end.getTime() - end.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }

    setFormData({
      alunoId: '',
      instrutorId: '',
      veiculoId: '',
      dataInicio: inicio,
      dataFim: fim,
      tipo: 'Carro'
    })
    setModalAberto(true)
  }

  function abrirEdicaoAgendamento(info) {
    const ev = info.event.extendedProps
    setEventoSelecionado({ id: info.event.id, ...ev })
    setFormData({
      alunoId: ev.alunoId,
      instrutorId: ev.instrutorId,
      veiculoId: ev.veiculoId,
      dataInicio: info.event.startStr.slice(0, 16),
      dataFim: info.event.endStr ? info.event.endStr.slice(0, 16) : '',
      tipo: ev.tipo || 'Carro'
    })
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setEventoSelecionado(null)
  }

  return (
    <div className="p-6 bg-[#f4f7fb] min-h-screen text-zinc-800 animate-in fade-in duration-500 flex flex-col h-screen overflow-hidden">
      
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden w-full flex flex-col flex-1">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#081120] to-[#0f172a] px-8 py-7 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <CalendarIcon className="text-blue-400" size={26} />
              </div>
              Agenda Geral (Pro)
            </h1>
            <p className="text-zinc-400 mt-1 ml-14 text-sm">
              Agendamento visual inteligente com Drag and Drop
            </p>
          </div>
          <button 
            onClick={() => abrirNovoAgendamento()}
            className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
          >
            <Plus size={18} /> Nova Aula
          </button>
        </div>

        {/* CONTROLS & FILTERS */}
        <div className="p-4 border-b border-zinc-200 shrink-0 bg-zinc-50/50 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Filtrar Instrutor</label>
            <select 
              value={filtroInstrutor} 
              onChange={(e) => setFiltroInstrutor(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-zinc-300 bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todos">Todos os Instrutores</option>
              {instrutores.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Filtrar Veículo</label>
            <select 
              value={filtroVeiculo} 
              onChange={(e) => setFiltroVeiculo(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-zinc-300 bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todos">Todos os Veículos</option>
              {veiculos.map(v => <option key={v.id} value={v.id}>{v.placa} ({v.modelo})</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Filtrar Aluno</label>
            <select 
              value={filtroAluno} 
              onChange={(e) => setFiltroAluno(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-zinc-300 bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todos">Todos os Alunos</option>
              {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
          </div>
        </div>

        {/* CALENDAR BODY */}
        <div className="flex-1 overflow-auto p-4 calendar-container">
          <style dangerouslySetInnerHTML={{__html: `
            .calendar-container .fc { font-family: inherit; }
            .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 700; color: #3f3f46; }
            .fc .fc-button-primary { background-color: #fff; color: #3f3f46; border-color: #e4e4e7; text-transform: capitalize; }
            .fc .fc-button-primary:hover { background-color: #f4f4f5; color: #18181b; border-color: #d4d4d8; }
            .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active {
              background-color: #e4e4e7; color: #18181b; border-color: #d4d4d8;
            }
            .fc .fc-col-header-cell-cushion { padding: 8px; color: #52525b; text-transform: uppercase; font-size: 0.75rem; font-weight: 700; }
            .fc-event { cursor: pointer; border-radius: 4px; border: none; padding: 2px 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
            .fc-timegrid-event .fc-event-main { padding: 2px 4px; font-size: 0.75rem; }
          `}} />
          <FullCalendar
            plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            locale="pt-br"
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia'
            }}
            allDaySlot={false}
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
            events={eventosFormatados}
            editable={true}
            droppable={true}
            eventDrop={handleEventChange}
            eventResize={handleEventChange}
            dateClick={abrirNovoAgendamento}
            eventClick={abrirEdicaoAgendamento}
            height="auto"
            contentHeight="auto"
            expandRows={false}
            slotDuration="00:30:00"
          />
        </div>

      </div>

      {/* MODAL DE AGENDAMENTO */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <h3 className="text-lg font-bold text-zinc-800">
                {eventoSelecionado ? 'Editar Aula' : 'Agendar Nova Aula'}
              </h3>
              <button onClick={fecharModal} className="text-zinc-400 hover:text-zinc-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={salvarAula} className="p-6 space-y-4">
              
              <div>
                <label className="text-sm font-semibold text-zinc-700 mb-1 block">Aluno *</label>
                <select 
                  required
                  value={formData.alunoId}
                  onChange={e => setFormData({...formData, alunoId: e.target.value})}
                  className="w-full h-11 px-3 rounded-lg border border-zinc-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Selecione o Aluno...</option>
                  {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-zinc-700 mb-1 block">Instrutor *</label>
                  <select 
                    required
                    value={formData.instrutorId}
                    onChange={e => setFormData({...formData, instrutorId: e.target.value})}
                    className="w-full h-11 px-3 rounded-lg border border-zinc-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Selecione...</option>
                    {instrutores.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-zinc-700 mb-1 block">Veículo *</label>
                  <select 
                    required
                    value={formData.veiculoId}
                    onChange={e => setFormData({...formData, veiculoId: e.target.value})}
                    className="w-full h-11 px-3 rounded-lg border border-zinc-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Selecione...</option>
                    {veiculos.map(v => <option key={v.id} value={v.id}>{v.placa} ({v.modelo})</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-zinc-700 mb-1 block">Início *</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={formData.dataInicio}
                    onChange={e => setFormData({...formData, dataInicio: e.target.value})}
                    className="w-full h-11 px-3 rounded-lg border border-zinc-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-zinc-700 mb-1 block">Fim *</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={formData.dataFim}
                    onChange={e => setFormData({...formData, dataFim: e.target.value})}
                    className="w-full h-11 px-3 rounded-lg border border-zinc-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-zinc-700 mb-1 block">Tipo de Aula</label>
                <div className="flex gap-4">
                  {['Carro', 'Moto', 'Simulador'].map(tipo => (
                    <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="tipo" 
                        value={tipo}
                        checked={formData.tipo === tipo}
                        onChange={e => setFormData({...formData, tipo: e.target.value})}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-zinc-300"
                      />
                      <span className="text-sm font-medium text-zinc-700">{tipo}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-zinc-100 flex items-center justify-between">
                {eventoSelecionado ? (
                  <button 
                    type="button" 
                    onClick={excluirAula}
                    className="text-red-500 hover:text-red-600 font-bold px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Excluir Aula
                  </button>
                ) : <div />}
                
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={fecharModal}
                    className="px-5 py-2.5 text-zinc-600 font-bold hover:bg-zinc-100 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25"
                  >
                    {eventoSelecionado ? 'Salvar Alterações' : 'Criar Agendamento'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
