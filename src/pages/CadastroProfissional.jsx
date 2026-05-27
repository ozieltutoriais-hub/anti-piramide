export default function CadastroProfissional() {

  return (

    <div className="min-h-screen bg-[#060b17] text-white p-6">

      <div className="bg-[#11192c] p-8 rounded-3xl border border-zinc-800">

        <h1 className="text-5xl font-black text-yellow-400 mb-10">
          Cadastro Profissional
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <input
            placeholder="Nome completo"
            className="bg-[#18233b] p-4 rounded-2xl"
          />

          <input
            placeholder="CPF"
            className="bg-[#18233b] p-4 rounded-2xl"
          />

          <input
            placeholder="RG"
            className="bg-[#18233b] p-4 rounded-2xl"
          />

          <input
            placeholder="Telefone"
            className="bg-[#18233b] p-4 rounded-2xl"
          />

        </div>

      </div>

    </div>

  )
}