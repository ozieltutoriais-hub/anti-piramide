import { Link, useLocation } from 'react-router-dom'
import { Home, Users, Calendar, DollarSign, Menu } from 'lucide-react'

export default function BottomNav() {
  const location = useLocation()

  function ativo(path) {
    return location.pathname === path
  }

  const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Users, label: 'Alunos', path: '/cadastro' },
    { icon: Calendar, label: 'Agenda', path: '/agenda' },
    { icon: DollarSign, label: 'Finanças', path: '/financeiro' },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 flex items-center justify-around p-3 z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item, index) => {
        const Icon = item.icon
        const isActive = ativo(item.path)
        
        return (
          <Link
            key={index}
            to={item.path}
            className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all ${
              isActive 
                ? 'text-green-600 font-bold' 
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <Icon 
              size={isActive ? 24 : 22} 
              strokeWidth={isActive ? 2.5 : 2} 
              className={`mb-1 transition-all ${isActive ? 'text-green-600 scale-110' : ''}`}
            />
            <span className={`text-[10px] ${isActive ? 'text-green-600' : ''}`}>
              {item.label}
            </span>
            {/* Active Indicator Dot */}
            {isActive && (
              <div className="absolute bottom-1 w-1 h-1 bg-green-500 rounded-full" />
            )}
          </Link>
        )
      })}
    </div>
  )
}
