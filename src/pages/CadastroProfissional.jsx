import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'

import { useState } from 'react'

import {
  MapPin,
  Phone,
  CreditCard,
  Camera,
  Save,
  User
} from 'lucide-react'

export default function CadastroProfissional() {

  const [form, setForm] = useState({})

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  return (

    <div className="p-8 bg-[#eef2f7] min-h-screen">

      {/* CARD PRINCIPAL */}
      <Card className="overflow-hidden shadow-[0_10px_40px_rgba(15,23,42,0.08)]">

        {/* HEADER */}
        <div className="p-8 pb-0">

          <PageHeader
            title="Cadastro de Aluno"
            subtitle="Preencha os dados do aluno"
            action={

              <Button>

                <Save
                  size={18}
                  strokeWidth={2.2}
                />

                Salvar Cadastro

              </Button>

            }
          />

          {/* TABS */}
          <div className="pt-6">

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

        </div>

        {/* FORM */}
        <div className="p-10">

          {/* FOTO + CAMPOS */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* FOTO */}
            <div>

              <div className="border border-dashed border-green-500/40 rounded-3xl h-[340px] flex flex-col items-center justify-center bg-zinc-50 relative overflow-hidden">

                <div className="absolute top-4 right-4 bg-gradient-to-b from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">

                  <Camera
                    className="text-white"
                    size={20}
                  />

                </div>

                <User
                  size={70}
                  className="text-zinc-300"
                />

                <h2 className="mt-4 font-semibold text-zinc-700 text-lg">

                  Foto do Aluno

                </h2>

              </div>

            </div>

            {/* CAMPOS */}
            <div className="lg:col-span-3">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <Input
                  name="nome"
                  placeholder="Nome completo"
                  onChange={handleChange}
                />

                <Input
                  name="cpf"
                  placeholder="CPF"
                  onChange={handleChange}
                />

                <Input
                  name="rg"
                  placeholder="RG"
                  onChange={handleChange}
                />

                <Input
                  name="renach"
                  placeholder="RENACH"
                  onChange={handleChange}
                />

                <select className="w-full h-12 px-4 rounded-2xl border border-[#dfe5ee] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500">

                  <option>Sexo</option>
                  <option>Masculino</option>
                  <option>Feminino</option>

                </select>

                <Input
                  type="date"
                />

              </div>

            </div>

          </div>

          {/* ENDEREÇO */}
          <div className="mt-14">

            <h2 className="text-2xl font-bold text-[#081120] mb-6 flex items-center gap-3">

              <MapPin
                className="text-green-500"
                size={22}
              />

              Endereço

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

              <Input
                placeholder="CEP"
              />

              <Input
                placeholder="Logradouro"
                className="md:col-span-2"
              />

              <Input
                placeholder="Número"
              />

              <Input
                placeholder="Bairro"
              />

              <Input
                placeholder="Cidade"
              />

              <select className="w-full h-12 px-4 rounded-2xl border border-[#dfe5ee] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500">

                <option>UF</option>
                <option>SP</option>
                <option>RJ</option>
                <option>MG</option>

              </select>

            </div>

          </div>

          {/* CONTATO */}
          <div className="mt-14">

            <h2 className="text-2xl font-bold text-[#081120] mb-6 flex items-center gap-3">

              <Phone
                className="text-green-500"
                size={22}
              />

              Contato e Acesso

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <Input
                placeholder="Telefone"
              />

              <Input
                placeholder="Celular"
              />

              <Input
                placeholder="Email"
              />

            </div>

          </div>

          {/* OBS */}
          <div className="mt-14">

            <h2 className="text-2xl font-bold text-[#081120] mb-6 flex items-center gap-3">

              <CreditCard
                className="text-green-500"
                size={22}
              />

              Observações Gerais

            </h2>

            <textarea
              placeholder="Digite observações sobre o aluno..."
              className="w-full border border-[#dfe5ee] bg-white outline-none transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500 p-5 rounded-2xl h-40"
            />

          </div>

        </div>

      </Card>

    </div>

  )

}