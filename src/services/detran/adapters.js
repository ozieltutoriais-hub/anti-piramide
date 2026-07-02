/**
 * ADAPTER PATTERN
 * 
 * O governo frequentemente usa padrões antigos. O CPF no frontend pode estar "123.456.789-00",
 * mas o Webservice do Detran exige numérico "12345678900".
 * 
 * Este arquivo isola essa responsabilidade de conversão (Frontend -> Backend Governo).
 */

export const DetranAdapters = {
  
  /**
   * Converte o formulário do nosso React para o JSON exato exigido pelo WebService do DETRAN-SP (BCA).
   */
  toCadastroPayload(alunoForm) {
    return {
      cpfCandidato: alunoForm.cpf.replace(/\D/g, ''), // Remove pontos e traços
      registroGeral: alunoForm.rg.replace(/\D/g, ''),
      nomeCompleto: alunoForm.nome.toUpperCase(), // O governo geralmente exige maiúsculas
      nomeMae: alunoForm.nomeMae.toUpperCase(),
      nomePai: alunoForm.nomePai.toUpperCase(),
      dataNascimento: alunoForm.dataNascimento, // Supondo que venha YYYY-MM-DD
      numeroRenach: alunoForm.renach.trim(),
      endereco: {
        cep: alunoForm.cep.replace(/\D/g, ''),
        logradouro: alunoForm.logradouro.toUpperCase(),
        numero: alunoForm.numero,
        bairro: alunoForm.bairro.toUpperCase()
      }
    }
  },

  /**
   * Converte a marcação de aula da nossa Agenda para o payload do Governo.
   */
  toAgendamentoAulaPayload(aulaData) {
    return {
      cpfInstrutor: aulaData.cpfInstrutor.replace(/\D/g, ''),
      placaVeiculo: aulaData.placa.replace('-', '').toUpperCase(),
      dataHoraInicio: aulaData.inicioISO, // ex: "2026-07-01T08:00:00"
      tipoAula: aulaData.tipo === 'Prática' ? 1 : 2 // 1-Prática, 2-Teórica
    }
  }

}
