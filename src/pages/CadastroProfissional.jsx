import { useState, useEffect } from 'react'

import {
  MapPin,
  Phone,
  CreditCard,
  Camera,
  Save,
  User,
  Search,
  Plus,
  X,
  Edit3
} from 'lucide-react'

import app from '../firebase/firebase'
import { getFirestore, collection, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore'

const db = getFirestore(app)

export default function CadastroProfissional() {

  const [form, setForm] = useState({})
  const [showPesquisaModal, setShowPesquisaModal] = useState(false)
  const [termoPesquisa, setTermoPesquisa] = useState('')
  const [profissionaisCadastrados, setProfissionaisCadastrados] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'profissionais'), (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setProfissionaisCadastrados(lista)
    })
    return () => unsub()
  }, [])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const limparFormulario = () => {
    setForm({})
  }

  async function salvarProfissional() {
    try {
      if (form.id) {
        const docRef = doc(db, 'profissionais', form.id)
        await updateDoc(docRef, form)
        alert('Profissional ATUALIZADO com sucesso!')
      } else {
        await addDoc(collection(db, 'profissionais'), form)
        alert('Profissional CRIADO com sucesso!')
        limparFormulario()
      }
    } catch (e) {
      console.error(e)
      alert('Erro ao salvar profissional')
    }
  }

  const profissionaisFiltrados = profissionaisCadastrados.filter(p => 
    p.nome?.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    p.cpf?.includes(termoPesquisa)
  )

  return (

    <div className="p-6 bg-[#f4f7fb] min-h-screen">

      {/* CARD PRINCIPAL */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#081120] to-[#0f172a] px-8 py-7 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Cadastro de Profissional
            </h1>
            <p className="text-zinc-400 mt-2">
              Preencha ou edite os dados do profissional
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={limparFormulario}
              className="h-12 px-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all duration-300 text-white font-semibold flex items-center gap-2"
            >
              <Plus size={18} />
              Limpar / Novo
            </button>

            <button
              onClick={() => setShowPesquisaModal(true)}
              className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all duration-300 text-white font-semibold flex items-center gap-2"
            >
              <Search size={18} />
              Pesquisar
            </button>

            <button
              onClick={salvarProfissional}
              className="h-12 px-6 rounded-xl bg-gradient-to-b from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 transition-all duration-300 text-white font-semibold shadow-lg flex items-center gap-3"
            >
              <Save size={18} strokeWidth={2.2} />
              {form.id ? 'Atualizar' : 'Salvar Cadastro'}
            </button>
          </div>

        </div>

        {/* TABS */}
        <div className="px-8 pt-6">
          <div className="flex gap-3 overflow-auto border-b border-zinc-200 pb-5">
            <button className="bg-gradient-to-b from-green-500 to-green-600 text-white px-6 h-11 rounded-xl font-semibold shadow-lg whitespace-nowrap">
              Dados Pessoais
            </button>
            <button className="bg-zinc-100 hover:bg-zinc-200 transition px-6 h-11 rounded-xl font-medium text-zinc-700 whitespace-nowrap">
              Endereço
            </button>
            <button className="bg-zinc-100 hover:bg-zinc-200 transition px-6 h-11 rounded-xl font-medium text-zinc-700 whitespace-nowrap">
              Documentos
            </button>
            <button className="bg-zinc-100 hover:bg-zinc-200 transition px-6 h-11 rounded-xl font-medium text-zinc-700 whitespace-nowrap">
              Financeiro
            </button>
            <button className="bg-zinc-100 hover:bg-zinc-200 transition px-6 h-11 rounded-xl font-medium text-zinc-700 whitespace-nowrap">
              Observações
            </button>
          </div>
        </div>

        {/* FORM */}
        <div className="p-8">

          {/* FOTO + CAMPOS */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* FOTO */}
            <div>
              <div className="border border-dashed border-green-500/40 rounded-3xl h-48 flex flex-col items-center justify-center bg-zinc-50 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-gradient-to-b from-green-500 to-green-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                  <Camera className="text-white" size={20} />
                </div>
                <User size={70} className="text-zinc-300" />
                <h2 className="mt-4 font-semibold text-zinc-700 text-lg">
                  Foto do Profissional
                </h2>
              </div>
            </div>

            {/* CAMPOS */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  name="nome"
                  value={form.nome || ''}
                  placeholder="Nome completo"
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
                />

                <input
                  name="cpf"
                  value={form.cpf || ''}
                  placeholder="CPF"
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
                />

                <input
                  name="rg"
                  value={form.rg || ''}
                  placeholder="RG"
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
                />

                <input
                  name="renach"
                  value={form.renach || ''}
                  placeholder="RENACH"
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
                />

                <select 
                  name="sexo" 
                  value={form.sexo || ''} 
                  onChange={handleChange} 
                  className="w-full h-12 px-4 rounded-xl border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
                >
                  <option value="">Sexo</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>

                <input
                  name="dataNascimento"
                  type="date"
                  value={form.dataNascimento || ''}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
            </div>

          </div>

          {/* ENDEREÇO */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#081120] mb-6 flex items-center gap-3">
              <MapPin className="text-green-500" size={22} />
              Endereço
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <input
                name="cep"
                value={form.cep || ''}
                placeholder="CEP"
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
              />

              <input
                name="logradouro"
                value={form.logradouro || ''}
                placeholder="Logradouro"
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500 md:col-span-2"
              />

              <input
                name="numero"
                value={form.numero || ''}
                placeholder="Número"
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
              />

              <input
                name="bairro"
                value={form.bairro || ''}
                placeholder="Bairro"
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
              />

              <input
                name="cidade"
                value={form.cidade || ''}
                placeholder="Cidade"
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
              />

              <select 
                name="uf" 
                value={form.uf || ''} 
                onChange={handleChange} 
                className="w-full h-12 px-4 rounded-xl border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
              >
                <option value="">UF</option>
                <option value="SP">SP</option>
                <option value="RJ">RJ</option>
                <option value="MG">MG</option>
              </select>
            </div>
          </div>

          {/* CONTATO */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#081120] mb-6 flex items-center gap-3">
              <Phone className="text-green-500" size={22} />
              Contato e Acesso
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <input
                name="telefone"
                value={form.telefone || ''}
                placeholder="Telefone"
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
              />

              <input
                name="celular"
                value={form.celular || ''}
                placeholder="Celular"
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
              />

              <input
                name="email"
                value={form.email || ''}
                placeholder="Email"
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
          </div>

          {/* OBS */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#081120] mb-6 flex items-center gap-3">
              <CreditCard className="text-green-500" size={22} />
              Observações Gerais
            </h2>

            <textarea
              name="observacoes"
              value={form.observacoes || ''}
              onChange={handleChange}
              placeholder="Digite observações sobre o profissional..."
              className="w-full border border-[#d8dee9] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500 p-5 rounded-2xl h-40"
            />
          </div>

        </div>

      </div>

      {/* MODAL PESQUISA */}
      {showPesquisaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-800 text-white p-5 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Search size={22} />
                Pesquisar Profissional
              </h2>
              <button onClick={() => setShowPesquisaModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 shrink-0 border-b border-zinc-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nome ou CPF..."
                  value={termoPesquisa}
                  onChange={e => setTermoPesquisa(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {profissionaisFiltrados.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  Nenhum profissional encontrado.
                </div>
              ) : (
                <div className="grid gap-2">
                  {profissionaisFiltrados.map(prof => (
                    <div 
                      key={prof.id} 
                      className="flex items-center justify-between p-4 bg-white border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 rounded-xl transition-colors group cursor-pointer"
                      onClick={() => {
                        setForm({
                          nome: prof.nome || '',
                          cpf: prof.cpf || '',
                          rg: prof.rg || '',
                          renach: prof.renach || '',
                          sexo: prof.sexo || '',
                          dataNascimento: prof.dataNascimento || '',
                          cep: prof.cep || '',
                          logradouro: prof.logradouro || '',
                          numero: prof.numero || '',
                          bairro: prof.bairro || '',
                          cidade: prof.cidade || '',
                          uf: prof.uf || '',
                          telefone: prof.telefone || '',
                          celular: prof.celular || '',
                          email: prof.email || '',
                          observacoes: prof.observacoes || '',
                          id: prof.id
                        })
                        setShowPesquisaModal(false)
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-lg">
                          {prof.nome?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">{prof.nome || 'Sem Nome'}</h3>
                          <div className="flex gap-3 text-sm text-slate-500 mt-1">
                            <span>CPF: {prof.cpf || '-'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button className="flex items-center gap-2 text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 hover:bg-blue-100 rounded-lg">
                        <Edit3 size={18} />
                        Editar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>

  )

}