import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import Sidebar from './components/Sidebar'

import Dashboard from './pages/Dashboard'
import Investimentos from './pages/Investimentos'
import Relatorios from './pages/Relatorios'
import Cadastro from './pages/Cadastro'
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

export default function App() {

  const usuario = JSON.parse(
    localStorage.getItem('usuarioLogado')
  )

  return (

    <BrowserRouter basename="/">

      <div className="min-h-screen bg-[#060b17] text-white flex">

        {usuario && <Sidebar />}

        <main className="flex-1 p-6">

          <Routes>

            <Route
              path="/login"
              element={<Login />}
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
              path="/cadastro"
              element={
                <RotaPrivada>
                  <Cadastro />
                </RotaPrivada>
              }
            />

          </Routes>

        </main>

      </div>

    </BrowserRouter>

  )
}