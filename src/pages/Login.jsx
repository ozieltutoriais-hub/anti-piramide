import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  Mail,
  Lock,
  ShieldCheck
} from 'lucide-react'

import app from '../firebase/firebase'
console.log(app)
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
  nome: 'Administrador',
  email: userCredential.user.email,
  tipo: 'admin'
}

      localStorage.setItem(
        'usuarioLogado',
        JSON.stringify(usuario)
      )

      alert('Login realizado com sucesso!')
navigate('/')

    } catch (error) {

      let mensagem = 'Erro ao tentar entrar no sistema.'
      
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        mensagem = 'Senha incorreta! Tente novamente.'
      } else if (error.code === 'auth/user-not-found') {
        mensagem = 'Nenhum usuário cadastrado com este email.'
      } else if (error.code === 'auth/invalid-email') {
        mensagem = 'Formato de email inválido.'
      } else if (error.code === 'auth/too-many-requests') {
        mensagem = 'Muitas tentativas falhas. Tente novamente mais tarde.'
      }

      alert(mensagem)
      console.log(error.code, error.message)

    }

  }

  return (

    <div className="min-h-screen bg-[#060b17] text-white flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-[#11192c] rounded-[35px] border border-zinc-800 p-10 shadow-2xl">

        <div className="text-center mb-10">

          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-green-600 mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]">

            <ShieldCheck
              size={50}
              className="text-white"
            />

          </div>

          <h1 className="text-5xl font-black text-white mb-3">
            LOGIN <span className="text-green-500">SISTEMA</span>
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
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white transition-all duration-300 p-5 rounded-2xl font-black text-lg shadow-lg"
          >
            Entrar no Sistema
          </button>

        </div>

      </div>

    </div>

  )
}