import { useState, useEffect } from 'react'
import {
  User, Save, Camera, MapPin, Car, Search, ArrowLeft, Calendar, FileText, CreditCard, Copy, CheckCircle2, ChevronDown, ClipboardList, MonitorSmartphone, X, Printer
} from 'lucide-react'
import { motion } from 'framer-motion'
import app from '../firebase/firebase'
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { DetranService } from '../services/detran'

const db = getFirestore(app)

export default function Cadastro() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    rg: '',
    dataExpedicao: '',
    orgaoEmissor: '',
    uf: '',
    nomeMae: '',
    nomePai: '',
    dataNascimento: '',
    sexo: 'Masculino',
    nacionalidade: 'Brasileiro',
    estado: '',
    naturalidade: '',
    renach: '',
    tipoDocumento: '',
    registroPgu: '',
    categoriaAtual: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    profissao: '',
    celular: '',
    email: '',
    senha: ''
  })

  const [copied, setCopied] = useState('')
  const [showFichaModal, setShowFichaModal] = useState(false)
  const [showMatriculaModal, setShowMatriculaModal] = useState(false)
  const [showAgendaModal, setShowAgendaModal] = useState(false)
  const [showPesquisaModal, setShowPesquisaModal] = useState(false)
  const [termoPesquisa, setTermoPesquisa] = useState('')
  const [alunosCadastrados, setAlunosCadastrados] = useState([])
  
  const [instrutores, setInstrutores] = useState([])
  const [veiculos, setVeiculos] = useState([])
  const [agendaForm, setAgendaForm] = useState({
    instrutorId: '',
    veiculoId: '',
    dataInicio: '',
    dataFim: '',
    tipo: 'Carro'
  })

  useEffect(() => {
    const unsubInstr = onSnapshot(collection(db, 'profissionais'), snapshot => {
      setInstrutores(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    const unsubVeic = onSnapshot(collection(db, 'veiculos'), snapshot => {
      setVeiculos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    const unsubAlunos = onSnapshot(collection(db, 'alunos'), snapshot => {
      setAlunosCadastrados(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => {
      unsubInstr()
      unsubVeic()
      unsubAlunos()
    }
  }, [])

  async function agendarAula(e) {
    e.preventDefault()
    if (!form.nome) {
      alert("Por favor, preencha o Nome do Aluno no cadastro antes de agendar.")
      return
    }
    if (!agendaForm.instrutorId || !agendaForm.veiculoId || !agendaForm.dataInicio || !agendaForm.dataFim) {
      alert("Preencha todos os campos da agenda!")
      return
    }

    try {
      await addDoc(collection(db, 'aulas'), {
        alunoId: form.id || 'pendente',
        nomeAluno: form.nome,
        instrutorId: agendaForm.instrutorId,
        veiculoId: agendaForm.veiculoId,
        dataInicio: agendaForm.dataInicio,
        dataFim: agendaForm.dataFim,
        tipo: agendaForm.tipo,
        status: 'Agendada'
      })
      alert("Aula agendada com sucesso!")
      setShowAgendaModal(false)
      setAgendaForm({
        ...agendaForm,
        dataInicio: '',
        dataFim: ''
      })
    } catch (error) {
      console.error(error)
      alert("Erro ao agendar aula.")
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCopy = (text, field) => {
    if(!text) return;
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(''), 2000)
  }

  async function buscarCEP() {
    if (form.cep.length >= 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${form.cep.replace('-','')}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setForm({
            ...form,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          })
        }
      } catch (error) {
        console.error("Erro ao buscar CEP", error)
      }
    }
  }

  const limparFormulario = () => {
    setForm({
      nome: '', cpf: '', rg: '', dataExpedicao: '', orgaoEmissor: '', uf: '',
      nomeMae: '', nomePai: '', dataNascimento: '', sexo: 'Masculino',
      nacionalidade: 'Brasileiro', estado: '', naturalidade: '',
      renach: '', tipoDocumento: '', registroPgu: '', categoriaAtual: '',
      cep: '', logradouro: '', numero: '', bairro: '', cidade: '', email: '', senha: '',
      profissao: '', celular: ''
    })
  }

  async function cadastrar() {
    if (!form.nome || (!form.id && (!form.email || !form.senha))) {
      alert('Preencha pelo menos Nome, Email e Senha para gerar o acesso!')
      return
    }

    try {
      let protocoloDetran = null
      if (!form.id) {
         protocoloDetran = await DetranService.enviarBCA(form)
      }

      let novoAluno = { ...form }
      
      if (form.id) {
        delete novoAluno.senha // Não atualiza senha por aqui
        await updateDoc(doc(db, 'alunos', form.id), novoAluno)
        alert('Aluno atualizado com sucesso!')
      } else {
        const auth = getAuth(app)
        await createUserWithEmailAndPassword(auth, form.email, form.senha)
        novoAluno.status = 'Ativo'
        novoAluno.protocoloDetran = protocoloDetran
        delete novoAluno.senha
        await addDoc(collection(db, 'alunos'), novoAluno)
        alert('Aluno cadastrado com sucesso!')
      }

      limparFormulario()
    } catch (error) {
      console.log(error)
      let mensagem = 'Erro ao cadastrar aluno: ' + error.message
      if (error.code === 'auth/weak-password') mensagem = 'A senha deve ter pelo menos 6 caracteres!'
      else if (error.code === 'auth/email-already-in-use') mensagem = 'Este email já está cadastrado no sistema!'
      else if (error.code === 'auth/invalid-email') mensagem = 'Email inválido!'
      alert(mensagem)
    }
  }

  const inputClasses = "w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-700 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all hover:bg-white placeholder:text-zinc-400"
  const labelClasses = "text-[13px] font-semibold text-zinc-600 mb-1.5 block tracking-wide"

  const CopyInput = ({ label, name, value, ...props }) => (
    <div>
      <label className={labelClasses}>{label}</label>
      <div className="relative">
        <input 
          name={name}
          value={value}
          onChange={handleChange}
          className={`${inputClasses} pr-12`}
          {...props}
        />
        <button 
          type="button"
          onClick={() => handleCopy(value, name)}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-white border border-zinc-200 text-zinc-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 rounded-lg transition-all shadow-sm"
          title="Copiar"
        >
          {copied === name ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  )

  const SelectArrow = () => (
    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
  )

  return (
    <div className="min-h-full bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-4 lg:p-8">
      
      {/* HEADER BAR */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-zinc-200 p-5 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-[0_2px_20px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <User size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Aluno</h1>
            <p className="text-sm text-slate-500">Preencha os dados abaixo para cadastro</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button onClick={limparFormulario} className="h-10 px-4 rounded-xl bg-white border border-zinc-200 text-slate-700 font-medium hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 text-sm">
             Novo / Limpar
          </button>
          <button onClick={() => setShowPesquisaModal(true)} className="h-10 px-4 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-all shadow-sm flex items-center gap-2 text-sm">
             <Search size={16} /> Pesquisar Aluno
          </button>
          <button onClick={cadastrar} className="h-10 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 text-sm border border-blue-500">
            <Save size={16} /> {form.id ? 'Atualizar' : 'Salvar'}
          </button>
          
          <div className="h-8 w-px bg-zinc-200 mx-1 hidden lg:block"></div>

          <button onClick={() => setShowFichaModal(true)} disabled={!form.id} className="h-10 px-4 rounded-xl bg-teal-500 text-white font-medium hover:bg-teal-400 transition-all shadow-sm flex items-center gap-2 text-sm disabled:opacity-50">
            <ClipboardList size={16} /> Ficha do aluno
          </button>
          <button onClick={() => setShowMatriculaModal(true)} disabled={!form.id} className="h-10 px-4 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-400 transition-all shadow-sm flex items-center gap-2 text-sm disabled:opacity-50">
            <CheckCircle2 size={16} /> Matrícula
          </button>
          <button onClick={() => navigate('/financeiro-aluno', { state: { aluno: form } })} disabled={!form.id} className="h-10 px-4 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-400 transition-all shadow-sm flex items-center gap-2 text-sm disabled:opacity-50">
            $ Financeiro
          </button>
          <button onClick={() => setShowAgendaModal(true)} className="h-10 px-4 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-all shadow-sm flex items-center gap-2 text-sm">
            <Calendar size={16} /> Agenda
          </button>
          
          <div className="h-8 w-px bg-zinc-200 mx-1 hidden lg:block"></div>

          <button className="h-10 px-4 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-400 transition-all shadow-sm flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> Voltar
          </button>
        </div>
      </motion.div>

      {/* FORM SECTIONS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        
        {/* DADOS PESSOAIS */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="bg-slate-50/50 border-b border-zinc-100 px-8 py-5">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
              <User className="text-emerald-500" size={20} />
              Dados pessoais
            </h2>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col xl:flex-row gap-10">
              {/* PHOTO */}
              <div className="w-48 md:w-56 xl:w-[200px] mx-auto xl:mx-0 flex-shrink-0">
                <label className={labelClasses}>Foto</label>
                <div className="aspect-[3/4] w-full rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 flex flex-col items-center justify-center text-zinc-400 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-500 transition-all cursor-pointer relative overflow-hidden group">
                  <Camera size={40} className="mb-3 transition-transform group-hover:scale-110" />
                  <div className="text-sm font-semibold">Sem foto</div>
                </div>
              </div>

              {/* FIELDS */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6">
                <div className="md:col-span-8">
                  <label className={labelClasses}>Nome completo <span className="text-red-500">*</span></label>
                  <input name="nome" value={form.nome} onChange={handleChange} className={inputClasses} />
                </div>

                <div className="md:col-span-4">
                  <label className={labelClasses}>Celular / WhatsApp <span className="text-red-500">*</span></label>
                  <input name="celular" value={form.celular || ''} onChange={handleChange} placeholder="(00) 00000-0000" className={inputClasses} />
                </div>

                <div className="md:col-span-3">
                  <CopyInput label={<>CPF <span className="text-red-500">*</span></>} name="cpf" value={form.cpf} placeholder="000.000.000-00" />
                </div>
                
                <div className="md:col-span-3">
                  <label className={labelClasses}>RG</label>
                  <input name="rg" value={form.rg} onChange={handleChange} className={inputClasses} />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClasses}>Data expedição</label>
                  <input type="date" name="dataExpedicao" value={form.dataExpedicao} onChange={handleChange} className={inputClasses} />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClasses}>Órgão Emissor</label>
                  <input name="orgaoEmissor" value={form.orgaoEmissor} onChange={handleChange} placeholder="Ex.: SSP" className={inputClasses} />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClasses}>UF</label>
                  <div className="relative">
                    <select name="uf" value={form.uf} onChange={handleChange} className={`${inputClasses} appearance-none`}>
                      <option value="">SELECIONE</option>
                      <option value="SP">SP</option>
                      <option value="RJ">RJ</option>
                      <option value="MG">MG</option>
                    </select>
                    <SelectArrow />
                  </div>
                </div>

                <div className="md:col-span-6">
                  <CopyInput label={<>Nome da mãe <span className="text-red-500">*</span></>} name="nomeMae" value={form.nomeMae} />
                </div>

                <div className="md:col-span-6">
                  <label className={labelClasses}>Nome do pai <span className="text-red-500">*</span></label>
                  <input name="nomePai" value={form.nomePai} onChange={handleChange} className={inputClasses} />
                </div>

                <div className="md:col-span-4">
                  <CopyInput type="date" label={<>Data nascimento <span className="text-red-500">*</span></>} name="dataNascimento" value={form.dataNascimento} />
                </div>

                <div className="md:col-span-3">
                  <label className={labelClasses}>Sexo <span className="text-red-500">*</span></label>
                  <div className="flex h-11 bg-zinc-100/80 rounded-xl p-1 border border-zinc-200">
                    <button 
                      type="button"
                      onClick={() => setForm({...form, sexo: 'Masculino'})}
                      className={`flex-1 rounded-lg text-sm font-semibold transition-all ${form.sexo === 'Masculino' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}
                    >
                      Masculino
                    </button>
                    <button 
                      type="button"
                      onClick={() => setForm({...form, sexo: 'Feminino'})}
                      className={`flex-1 rounded-lg text-sm font-semibold transition-all ${form.sexo === 'Feminino' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}
                    >
                      Feminino
                    </button>
                  </div>
                </div>

                <div className="md:col-span-5">
                  <label className={labelClasses}>Profissão</label>
                  <input name="profissao" value={form.profissao || ''} onChange={handleChange} placeholder="Ex: Estudante" className={inputClasses} />
                </div>

                <div className="md:col-span-4">
                  <label className={labelClasses}>Nacionalidade <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select name="nacionalidade" value={form.nacionalidade} onChange={handleChange} className={`${inputClasses} appearance-none`}>
                      <option>Brasileiro</option>
                      <option>Estrangeiro</option>
                    </select>
                    <SelectArrow />
                  </div>
                </div>

                <div className="md:col-span-4">
                  <label className={labelClasses}>Estado <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select name="estado" value={form.estado} onChange={handleChange} className={`${inputClasses} appearance-none`}>
                      <option value="">XXXXX</option>
                      <option value="SP">SÃO PAULO</option>
                    </select>
                    <SelectArrow />
                  </div>
                </div>

                <div className="md:col-span-4">
                  <label className={labelClasses}>Naturalidade <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select name="naturalidade" value={form.naturalidade} onChange={handleChange} className={`${inputClasses} appearance-none`}>
                      <option value="">XXXXX</option>
                      <option value="CAMPINAS">CAMPINAS</option>
                    </select>
                    <SelectArrow />
                  </div>
                </div>

            </div>
          </div>
        </div>
        </div>

        {/* DADOS DO CONDUTOR */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="bg-slate-50/50 border-b border-zinc-100 px-8 py-5">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
              <Car className="text-emerald-500" size={20} />
              Dados do Condutor
            </h2>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className={labelClasses}>Renach</label>
                <input name="renach" value={form.renach} onChange={handleChange} placeholder="000000000" className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Tipo de Documento</label>
                <div className="relative">
                  <select name="tipoDocumento" value={form.tipoDocumento} onChange={handleChange} className={`${inputClasses} appearance-none`}>
                    <option value="">SELECIONE</option>
                    <option>Primeira Habilitação</option>
                    <option>Renovação</option>
                    <option>Adição de Categoria</option>
                  </select>
                  <SelectArrow />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Nº Registro/PGU</label>
                <input name="registroPgu" value={form.registroPgu} onChange={handleChange} placeholder="0000000000" className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Categoria Atual</label>
                <div className="relative">
                  <select name="categoriaAtual" value={form.categoriaAtual} onChange={handleChange} className={`${inputClasses} appearance-none`}>
                    <option value="">SELECIONE</option>
                    <option>NENHUMA</option>
                    <option>A</option>
                    <option>B</option>
                    <option>AB</option>
                    <option>C</option>
                    <option>D</option>
                    <option>E</option>
                  </select>
                  <SelectArrow />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ENDEREÇO & APP */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* ENDEREÇO */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="bg-slate-50/50 border-b border-zinc-100 px-8 py-5">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
                <MapPin className="text-emerald-500" size={20} />
                Endereço
              </h2>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-5 flex gap-2 items-end">
                  <div className="flex-1">
                    <label className={labelClasses}>CEP <span className="text-red-500">*</span></label>
                    <input name="cep" value={form.cep} onChange={handleChange} placeholder="00000-000" className={inputClasses} />
                  </div>
                  <button type="button" onClick={buscarCEP} className="h-11 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 flex-shrink-0">
                    <Search size={18} />
                  </button>
                </div>

                <div className="md:col-span-7">
                  <label className={labelClasses}>Logradouro <span className="text-red-500">*</span></label>
                  <input name="logradouro" value={form.logradouro} onChange={handleChange} className={inputClasses} />
                </div>

                <div className="md:col-span-4">
                  <label className={labelClasses}>Número <span className="text-red-500">*</span></label>
                  <input name="numero" value={form.numero} onChange={handleChange} className={inputClasses} />
                </div>

                <div className="md:col-span-8">
                  <label className={labelClasses}>Bairro <span className="text-red-500">*</span></label>
                  <input name="bairro" value={form.bairro} onChange={handleChange} className={inputClasses} />
                </div>

                <div className="md:col-span-12">
                  <label className={labelClasses}>Cidade <span className="text-red-500">*</span></label>
                  <input name="cidade" value={form.cidade} onChange={handleChange} className={inputClasses} />
                </div>
              </div>
            </div>
          </div>

          {/* ACESSO AO APP */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="bg-slate-50/50 border-b border-zinc-100 px-8 py-5">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
                <MonitorSmartphone className="text-emerald-500" size={20} />
                Acesso ao Aplicativo
              </h2>
            </div>
            
            <div className="p-8">
              <div className="space-y-6">
                <p className="text-sm text-zinc-500">Crie o acesso para o aluno acompanhar aulas e processos pelo aplicativo.</p>
                <div>
                  <label className={labelClasses}>Email de Acesso <span className="text-red-500">*</span></label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="aluno@email.com" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Senha de Acesso <span className="text-red-500">*</span></label>
                  <input name="senha" type="password" value={form.senha} onChange={handleChange} placeholder="******" className={inputClasses} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </motion.div>

      {/* MODAL FICHA DO ALUNO */}
      {showFichaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          >
            <div className="bg-slate-800 text-white p-5 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ClipboardList size={22} />
                Ficha do Aluno
              </h2>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Imprimir Ficha">
                  <Printer size={20} />
                </button>
                <button onClick={() => setShowFichaModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto print:p-0 print:overflow-visible">
              <div className="space-y-6">
                
                {/* Cabeçalho Impressão */}
                <div className="hidden print:block text-center border-b pb-4 mb-4">
                  <h1 className="text-2xl font-bold text-slate-800">FICHA DO ALUNO</h1>
                  <p className="text-slate-500">Auto Escola Online</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Dados Pessoais</h3>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Nome Completo</p>
                    <p className="font-semibold text-slate-800">{form.nome || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">CPF</p>
                    <p className="font-semibold text-slate-800">{form.cpf || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">RG / Órgão / UF</p>
                    <p className="font-semibold text-slate-800">{form.rg ? `${form.rg} - ${form.orgaoEmissor}/${form.uf}` : 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Data de Nascimento</p>
                    <p className="font-semibold text-slate-800">{form.dataNascimento || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Nome da Mãe</p>
                    <p className="font-semibold text-slate-800">{form.nomeMae || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Nome do Pai</p>
                    <p className="font-semibold text-slate-800">{form.nomePai || 'Não informado'}</p>
                  </div>

                  <div className="col-span-2 mt-4">
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Endereço</h3>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-slate-500">Logradouro</p>
                    <p className="font-semibold text-slate-800">
                      {form.logradouro ? `${form.logradouro}, ${form.numero} - ${form.bairro}` : 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Cidade / UF</p>
                    <p className="font-semibold text-slate-800">{form.cidade ? `${form.cidade} / ${form.estado}` : 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">CEP</p>
                    <p className="font-semibold text-slate-800">{form.cep || 'Não informado'}</p>
                  </div>

                  <div className="col-span-2 mt-4">
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Acesso</h3>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email de Acesso</p>
                    <p className="font-semibold text-slate-800">{form.email || 'Não informado'}</p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL MATRÍCULA (CONTRATO) */}
      {showMatriculaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          >
            <div className="bg-slate-800 text-white p-5 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 size={22} />
                Contrato de Matrícula
              </h2>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Imprimir Matrícula">
                  <Printer size={20} />
                </button>
                <button onClick={() => setShowMatriculaModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto print:p-0 print:overflow-visible">
              <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
                
                <div className="text-center border-b pb-4 mb-6">
                  <h1 className="text-2xl font-bold text-slate-800 uppercase">Contrato de Prestação de Serviços Educacionais</h1>
                  <p className="text-slate-500 mt-1">Auto Escola Online - Centro de Formação de Condutores (Credenciamento DETRAN nº _________)</p>
                </div>

                <p className="text-justify">
                  Pelo presente instrumento particular, de um lado <strong>Auto Escola Online</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 00.000.000/0001-00, com sede na Rua Exemplo, 123 - Centro, doravante denominada simplesmente <strong>CONTRATADA</strong>, e de outro lado:
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 print:border-none print:p-0 my-4 text-sm space-y-1">
                  <p><strong>NOME DO ALUNO:</strong> {form.nome || '_______________________________________________________'}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <p><strong>CPF:</strong> {form.cpf || '__________________'}</p>
                    <p><strong>RG:</strong> {form.rg || '__________________'}</p>
                    <p><strong>CELULAR:</strong> {form.celular || '__________________'}</p>
                    <p><strong>PROFISSÃO:</strong> {form.profissao || '__________________'}</p>
                  </div>
                  <p><strong>ENDEREÇO:</strong> {form.logradouro ? `${form.logradouro}, ${form.numero}` : '_______________________________________________________'}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <p><strong>BAIRRO:</strong> {form.bairro || '__________________'}</p>
                    <p><strong>CIDADE/UF:</strong> {form.cidade ? `${form.cidade}/${form.estado}` : '__________________'}</p>
                  </div>
                </div>

                <p className="text-justify mb-4">
                  doravante denominado simplesmente <strong>CONTRATANTE</strong>, têm entre si justo e acertado o presente contrato de prestação de serviços educacionais, que se regerá pelas cláusulas e condições a seguir:
                </p>

                <div className="space-y-4 text-justify">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">CLÁUSULA PRIMEIRA - DO OBJETO</h3>
                    <p>O presente contrato tem por objeto a prestação de serviços educacionais teóricos e/ou práticos pela CONTRATADA visando à formação, atualização, reciclagem ou adição de categoria do CONTRATANTE para a obtenção da Carteira Nacional de Habilitação (CNH), categoria pretendida: ______.</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES DA CONTRATADA</h3>
                    <p>A CONTRATADA compromete-se a ministrar as aulas em conformidade com a legislação de trânsito (Resoluções do CONTRAN), disponibilizando instrutores devidamente credenciados pelo DETRAN, material didático básico e veículos adaptados e em perfeitas condições de uso para a instrução prática.</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DO CONTRATANTE</h3>
                    <p>O CONTRATANTE obriga-se a comparecer pontualmente às aulas teóricas e práticas agendadas, portando documento de identificação original e LADV (para aulas práticas). O atraso superior a 15 (quinze) minutos implicará em falta. A ausência não justificada com antecedência mínima de 24 (vinte e quatro) horas úteis acarretará a perda da aula e a cobrança de taxa administrativa no valor de R$ ____ para remarcação.</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">CLÁUSULA QUARTA - DAS TAXAS E EXAMES (NÃO INCLUSOS)</h3>
                    <p>Fica expressamente acordado que <strong>NÃO estão inclusos</strong> no valor deste contrato: taxas estaduais (DUDA, GARE, etc.), exames médicos e psicotécnicos (pagos diretamente à clínica), laudos, aluguel do veículo para reteste em caso de reprovação no exame prático, e aulas práticas adicionais extracurriculares. Tais custos são de inteira responsabilidade do CONTRATANTE.</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">CLÁUSULA QUINTA - DO PRAZO DE VALIDADE</h3>
                    <p>O processo de habilitação junto ao DETRAN tem a validade de 12 (doze) meses a contar da data do cadastro. Vencido este prazo, o processo será cancelado automaticamente pelo órgão de trânsito, isentando a CONTRATADA de qualquer responsabilidade ou devolução de valores, devendo o CONTRATANTE arcar com novas taxas caso deseje reiniciar o processo.</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">CLÁUSULA SEXTA - DO CANCELAMENTO E RESCISÃO</h3>
                    <p>Em caso de desistência por parte do CONTRATANTE antes do término dos serviços, haverá a devolução dos valores referentes às aulas não cursadas, descontando-se uma multa rescisória de 15% (quinze por cento) sobre o saldo remanescente, a título de perdas e danos e despesas administrativas.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">CLÁUSULA SÉTIMA - DO FORO</h3>
                    <p>Para dirimir quaisquer controvérsias oriundas do presente contrato, as partes elegem o foro da Comarca da sede da CONTRATADA, renunciando a qualquer outro por mais privilegiado que seja.</p>
                  </div>
                  
                  <p className="mt-6 text-center">
                    E por estarem justos e contratados, assinam o presente em 02 (duas) vias de igual teor.
                  </p>
                  <p className="text-center font-bold">
                    _________________, ____ de _________________ de 20____.
                  </p>
                </div>

                <div className="pt-12 pb-8 grid grid-cols-2 gap-8 text-center mt-8">
                  <div>
                    <div className="border-t border-slate-400 pt-2 w-3/4 mx-auto">
                      <p className="font-bold uppercase">{form.nome || 'Assinatura do Aluno'}</p>
                      <p className="text-xs text-slate-500">CONTRATANTE</p>
                    </div>
                  </div>
                  <div>
                    <div className="border-t border-slate-400 pt-2 w-3/4 mx-auto">
                      <p className="font-bold">Auto Escola Online</p>
                      <p className="text-xs text-slate-500">CONTRATADA</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL AGENDAMENTO RÁPIDO */}
      {showAgendaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="bg-slate-800 text-white p-5 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar size={22} />
                Agendamento Rápido
              </h2>
              <button onClick={() => setShowAgendaModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={agendarAula} className="p-6 overflow-y-auto space-y-4">
              <div className="bg-sky-50 border border-sky-100 p-3 rounded-lg text-sm text-sky-800 mb-2 flex flex-col">
                <span className="font-semibold mb-1">Aluno selecionado:</span>
                <span>{form.nome || "Preencha o nome do aluno no cadastro."}</span>
              </div>

              <div>
                <label className={labelClasses}>Data e Hora Início <span className="text-red-500">*</span></label>
                <input 
                  type="datetime-local" 
                  value={agendaForm.dataInicio} 
                  onChange={e => setAgendaForm({...agendaForm, dataInicio: e.target.value})} 
                  className={inputClasses} 
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Data e Hora Fim <span className="text-red-500">*</span></label>
                <input 
                  type="datetime-local" 
                  value={agendaForm.dataFim} 
                  onChange={e => setAgendaForm({...agendaForm, dataFim: e.target.value})} 
                  className={inputClasses} 
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Instrutor <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    value={agendaForm.instrutorId} 
                    onChange={e => setAgendaForm({...agendaForm, instrutorId: e.target.value})} 
                    className={`${inputClasses} appearance-none cursor-pointer`}
                    required
                  >
                    <option value="">Selecione o instrutor</option>
                    {instrutores.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.nome}</option>
                    ))}
                  </select>
                  <SelectArrow />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Veículo <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      value={agendaForm.veiculoId} 
                      onChange={e => setAgendaForm({...agendaForm, veiculoId: e.target.value})} 
                      className={`${inputClasses} appearance-none cursor-pointer`}
                      required
                    >
                      <option value="">Selecione</option>
                      {veiculos.map(v => (
                        <option key={v.id} value={v.id}>{v.placa} ({v.modelo})</option>
                      ))}
                    </select>
                    <SelectArrow />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Tipo de Aula <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      value={agendaForm.tipo} 
                      onChange={e => setAgendaForm({...agendaForm, tipo: e.target.value})} 
                      className={`${inputClasses} appearance-none cursor-pointer`}
                    >
                      <option value="Carro">Carro</option>
                      <option value="Moto">Moto</option>
                      <option value="Simulador">Simulador</option>
                    </select>
                    <SelectArrow />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAgendaModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={!form.nome} className="px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30">
                  Agendar Aula
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* SEARCH MODAL */}
      {showPesquisaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
          >
            <div className="bg-slate-800 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Search size={22} className="text-emerald-400" />
                  Pesquisar Aluno
                </h2>
                <p className="text-slate-300 text-sm mt-1">Busque pelo nome ou CPF do aluno</p>
              </div>
              <button onClick={() => setShowPesquisaModal(false)} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="relative mb-6">
                <input 
                  type="text" 
                  placeholder="Digite o nome ou CPF..." 
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              </div>

              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                {alunosCadastrados.filter(a => a.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) || (a.cpf && a.cpf.includes(termoPesquisa))).length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">Nenhum aluno encontrado.</div>
                ) : (
                  alunosCadastrados.filter(a => a.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) || (a.cpf && a.cpf.includes(termoPesquisa))).map(aluno => (
                    <div 
                      key={aluno.id}
                      onClick={() => {
                        setForm({
                          nome: aluno.nome || '', cpf: aluno.cpf || '', rg: aluno.rg || '', dataExpedicao: aluno.dataExpedicao || '', orgaoEmissor: aluno.orgaoEmissor || '', uf: aluno.uf || '',
                          nomeMae: aluno.nomeMae || '', nomePai: aluno.nomePai || '', dataNascimento: aluno.dataNascimento || '', sexo: aluno.sexo || 'Masculino',
                          nacionalidade: aluno.nacionalidade || 'Brasileiro', estado: aluno.estado || '', naturalidade: aluno.naturalidade || '',
                          renach: aluno.renach || '', tipoDocumento: aluno.tipoDocumento || '', registroPgu: aluno.registroPgu || '', categoriaAtual: aluno.categoriaAtual || '',
                          cep: aluno.cep || '', logradouro: aluno.logradouro || '', numero: aluno.numero || '', bairro: aluno.bairro || '', cidade: aluno.cidade || '', email: aluno.email || '', senha: '',
                          profissao: aluno.profissao || '', celular: aluno.celular || '',
                          id: aluno.id
                        })
                        setShowPesquisaModal(false)
                      }}
                      className="p-4 rounded-xl border border-zinc-100 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <div>
                        <div className="font-bold text-slate-700 group-hover:text-emerald-700">{aluno.nome}</div>
                        <div className="text-sm text-zinc-500">CPF: {aluno.cpf || 'Não informado'}</div>
                      </div>
                      <CheckCircle2 size={20} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}