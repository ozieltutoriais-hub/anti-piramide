import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom'

import Sidebar from './components/Sidebar'

import Dashboard from './pages/Dashboard'
import Investimentos from './pages/Investimentos'
import Relatorios from './pages/Relatorios'
import Cadastro from './pages/Cadastro'
import CadastroProfissional from './pages/CadastroProfissional'
import Agenda from './pages/Agenda'
import Veiculos from './pages/Veiculos'
import Processos from './pages/Processos'
import IntegracaoDetran from './pages/IntegracaoDetran'
import Financeiro from './pages/Financeiro'
import FinanceiroAluno from './pages/FinanceiroAluno'
import Pacotes from './pages/Pacotes'
import Instrutores from './pages/Instrutores'
import Topbar from './components/Topbar'
import Login from './pages/Login'

function RotaPrivada({ children }) {

  const usuario = JSON.parse(
    localStorage.getItem('usuarioLogado')
  )

  if (!usuario) {
    return <Navigate to="/login" />
  }

  return children
}

function Layout() {

  const location = useLocation()

  const telaLogin =
    location.pathname === '/login'

  return (

    <div className="min-h-screen bg-[#f1f1f1] text-zinc-700 flex">

      {!telaLogin && <Sidebar />}

      <main className="flex-1 flex flex-col">

  {!telaLogin && <Topbar />}

  <div className="p-5 overflow-auto flex-1">

    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/cadastro"
        element={
          <RotaPrivada>
            <Cadastro />
          </RotaPrivada>
        }
      />

      <Route
        path="/"
        element={
          <RotaPrivada>
            <Dashboard />
          </RotaPrivada>
        }
      />

      <Route
        path="/investimentos"
        element={
          <RotaPrivada>
            <Investimentos />
          </RotaPrivada>
        }
      />

      <Route
        path="/relatorios"
        element={
          <RotaPrivada>
            <Relatorios />
          </RotaPrivada>
        }
      />

      <Route
        path="/cadastro-profissional"
        element={
          <RotaPrivada>
            <CadastroProfissional />
          </RotaPrivada>
        }
      />

      <Route
        path="/agenda"
        element={
          <RotaPrivada>
            <Agenda />
          </RotaPrivada>
        }
      />

      <Route
        path="/veiculos"
        element={
          <RotaPrivada>
            <Veiculos />
          </RotaPrivada>
        }
      />

      <Route
        path="/processos"
        element={
          <RotaPrivada>
            <Processos />
          </RotaPrivada>
        }
      />

      <Route
        path="/integracao-detran"
        element={
          <RotaPrivada>
            <IntegracaoDetran />
          </RotaPrivada>
        }
      />

      <Route
        path="/financeiro"
        element={
          <RotaPrivada>
            <Financeiro />
          </RotaPrivada>
        }
      />

      <Route
        path="/financeiro-aluno"
        element={
          <RotaPrivada>
            <FinanceiroAluno />
          </RotaPrivada>
        }
      />

      <Route
        path="/pacotes"
        element={
          <RotaPrivada>
            <Pacotes />
          </RotaPrivada>
        }
      />

      <Route
        path="/instrutores"
        element={
          <RotaPrivada>
            <Instrutores />
          </RotaPrivada>
        }
      />

        </Routes>

  </div>

</main>

</div>

  )

}

export default function App() {

  return (

    <BrowserRouter>
      <Layout />
    </BrowserRouter>

  )

}