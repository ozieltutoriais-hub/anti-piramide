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

      <main className="flex-1 p-6">

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

        </Routes>

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