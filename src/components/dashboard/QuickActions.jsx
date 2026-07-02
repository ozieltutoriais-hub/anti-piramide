import {
  UserPlus,
  CalendarPlus,
  Wallet,
  FileText,
  Car,
  GraduationCap
} from 'lucide-react'

const actions = [
  {
    title: 'Novo Aluno',
    icon: UserPlus,
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Nova Aula',
    icon: CalendarPlus,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Financeiro',
    icon: Wallet,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    title: 'Relatórios',
    icon: FileText,
    color: 'from-purple-500 to-pink-600'
  },
  {
    title: 'Veículos',
    icon: Car,
    color: 'from-cyan-500 to-cyan-700'
  },
  {
    title: 'Instrutores',
    icon: GraduationCap,
    color: 'from-emerald-500 to-emerald-700'
  }
]

export default function QuickActions() {

  return (

    <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">

      {
        actions.map((item, index) => {

          const Icon = item.icon

          return (

            <button
              key={index}
              className="
                group
                relative
                overflow-hidden
                rounded-[28px]
                p-6
                bg-white
                border
                border-white
                shadow-[0_10px_40px_rgba(15,23,42,0.06)]
                hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]
                transition-all
                duration-300
                hover:-translate-y-1
                text-left
              "
            >

              <div
                className={`
                  w-16
                  h-16
                  rounded-3xl
                  bg-gradient-to-br
                  ${item.color}
                  flex
                  items-center
                  justify-center
                  shadow-lg
                `}
              >

                <Icon
                  className="text-white"
                  size={28}
                  strokeWidth={2.2}
                />

              </div>

              <h3 className="mt-6 text-xl font-bold text-[#081120]">

                {item.title}

              </h3>

              <p className="text-zinc-500 mt-2">

                Acesso rápido ao módulo

              </p>

              <div className="
                absolute
                inset-0
                bg-gradient-to-br
                from-transparent
                to-black/[0.02]
                opacity-0
                group-hover:opacity-100
                transition-all
              " />

            </button>

          )

        })
      }

    </div>

  )

}