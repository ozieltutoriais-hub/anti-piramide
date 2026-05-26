import { useState, useEffect } from 'react'

import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Phone,
  MapPin
} from 'lucide-react'

import app from '../firebase/firebase'

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from 'firebase/firestore'

import {
  getAuth,
  createUserWithEmailAndPassword
} from 'firebase/auth'

const db = getFirestore(app)

export default function Cadastro() {

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cidade, setCidade] = useState('')
  const [senha, setSenha] = useState('')

  const [alunos, setAlunos] = useState([])

  useEffect(() => {

    carregarAlunos()

  }, [])

  async function carregarAlunos() {

    const querySnapshot = await getDocs(
      collection(db, 'alunos')
    )

    const lista = []

    querySnapshot.forEach((doc) => {

      lista.push({
        id: doc.id,
        ...doc.data()
      })

    })

    setAlunos(lista)

  }

  async function cadastrar() {

    if (!nome || !email || !telefone || !cidade || !senha) {

      alert('Preencha todos os campos!')

      return

    }

    try {

      const auth = getAuth(app)

      await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      )

      const novoAluno = {
        nome,
        email,
        telefone,
        cidade,
        status: 'Ativo'
      }

      await addDoc(
        collection(db, 'alunos'),
        novoAluno
      )

      alert('Aluno cadastrado online!')

      setNome('')
      setEmail('')
      setTelefone('')
      setCidade('')
      setSenha('')

      carregarAlunos()

    } catch (error) {

      console.log(error)

      alert('Erro ao cadastrar aluno')

    }

  }

  return (

    <div className="min-h-screen bg-[#060b17] text-white p-6">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">

        <div className="bg-[#11192c] rounded-[30px] border border-zinc-800 p-10 shadow-2xl">

          <div className="flex items-center gap-4 mb-8">

            <div className="bg-yellow-500 p-4 rounded-2xl">

              <GraduationCap
                size={30}
                className="text-black"
              />

            </div>

            <div>

              <h1 className="text-5xl font-black text-yellow-400">
                Cadastro Firebase
              </h1>

              <p className="text-zinc-400 mt-2">
                Sistema online de cadastro
              </p>

            </div>

          </div>

          <div className="space-y-6">

            <div className="relative">

              <User
                className="absolute left-4 top-5 text-zinc-400"
                size={22}
              />

              <input
                type="text"
                placeholder="Nome do aluno"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-[#18233b] border border-zinc-700 rounded-2xl p-5 pl-14 outline-none"
              />

            </div>

            <div className="relative">

              <Mail
                className="absolute left-4 top-5 text-zinc-400"
                size={22}
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#18233b] border border-zinc-700 rounded-2xl p-5 pl-14 outline-none"
              />

            </div>

            <div className="relative">

              <Phone
                className="absolute left-4 top-5 text-zinc-400"
                size={22}
              />

              <input
                type="text"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full bg-[#18233b] border border-zinc-700 rounded-2xl p-5 pl-14 outline-none"
              />

            </div>

            <div className="relative">

              <MapPin
                className="absolute left-4 top-5 text-zinc-400"
                size={22}
              />

              <input
                type="text"
                placeholder="Cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full bg-[#18233b] border border-zinc-700 rounded-2xl p-5 pl-14 outline-none"
              />

            </div>

            <div className="relative">

              <Lock
                className="absolute left-4 top-5 text-zinc-400"
                size={22}
              />

              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-[#18233b] border border-zinc-700 rounded-2xl p-5 pl-14 outline-none"
              />

            </div>

            <button
              onClick={cadastrar}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black transition p-5 rounded-2xl font-black text-lg shadow-2xl"
            >
              Cadastrar Online
            </button>

          </div>

        </div>

        <div className="bg-[#11192c] rounded-[30px] border border-zinc-800 p-10 shadow-2xl">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-4xl font-black text-yellow-400">
                Firebase
              </h2>

              <p className="text-zinc-400 mt-2">
                Alunos salvos online
              </p>

            </div>

            <div className="bg-green-500/20 text-green-400 px-5 py-3 rounded-2xl font-bold">
              {alunos.length} alunos
            </div>

          </div>

          <div className="space-y-4 max-h-[650px] overflow-auto pr-2">

            {alunos.map((aluno) => (

              <div
                key={aluno.id}
                className="bg-[#18233b] rounded-3xl p-6 border border-zinc-700"
              >

                <h3 className="text-2xl font-black">
                  {aluno.nome}
                </h3>

                <p className="text-zinc-400 mt-2">
                  {aluno.email}
                </p>

                <p className="text-zinc-500 mt-1">
                  {aluno.telefone}
                </p>

                <p className="text-zinc-500 mt-1">
                  {aluno.cidade}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  )
}