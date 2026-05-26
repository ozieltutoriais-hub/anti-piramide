import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  Mail,
  Lock,
  ShieldCheck
} from 'lucide-react'

import app from '../firebase/firebase'

import {
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth'

const auth = getAuth(app)

export default function Login() {

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const navigate = useNavigate()

  async function entrar() {

    try {

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          senha
        )

      const usuario = {
        email: userCredential.user.email
      }

      localStorage.setItem(
        'usuarioLogado',
        JSON.stringify(usuario)
      )

      alert('Login realizado com sucesso!')

      navigate('/')

    } catch (error) {

      alert('Email ou senha inválidos')

      console.log(error)

    }

  }

  return (

    <div className="min-h-screen bg-[#060b17] text-white flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-[#11192c] rounded-[35px] border border-zinc-800 p-10 shadow-2xl">

        <div className="text-center mb-10">

          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mx-auto mb-6 flex items-center justify-center">

            <ShieldCheck
              size={50}
              className="text-black"
            />

          </div>

          <h1 className="text-5xl font-black text-yellow-400 mb-3">
            LOGIN FIREBASE
          </h1>

        </div>

        <div className="space-y-6">

          <div className="relative">

            <Mail
              className="absolute left-4 top-5 text-zinc-400"
              size={22}
            />

            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-[#18233b] border border-zinc-700 rounded-2xl p-5 pl-14 outline-none"
            />

          </div>

          <button
            type="button"
            onClick={entrar}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black transition p-5 rounded-2xl font-black text-lg shadow-2xl"
          >
            Entrar no Sistema
          </button>

        </div>

      </div>

    </div>

  )
}