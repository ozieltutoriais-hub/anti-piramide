import { detranApi } from './api'
import { DetranAdapters } from './adapters'
import { handleDetranError } from './errors'

/**
 * SERVIÇO PRINCIPAL (Facade)
 * 
 * É este objeto que os seus componentes React (ex: Cadastro.jsx) vão importar.
 */
export const DetranService = {
  
  /**
   * Envia o formulário completo do Aluno para o sistema do governo.
   * @param {Object} formData Dados do form do React.
   */
  async enviarBCA(formData) {
    try {
      // 1. Adapta os dados pro formato do governo
      const payload = DetranAdapters.toCadastroPayload(formData)
      
      console.log('[DETRAN_API] Payload gerado para envio:', payload)

      // 2. Dispara a requisição oficial (MOCK temporário até plugar a VPN real)
      /* 
       * const response = await detranApi.post('/candidatos/bca', payload)
       * return response.protocolo 
       */

      // Simulação para testes de UI
      return new Promise((resolve) => {
        setTimeout(() => resolve('PRT-' + Math.floor(Math.random() * 99999)), 1500)
      })

    } catch (error) {
      // 3. Traduz qualquer erro que der para algo amigável para o usuário
      handleDetranError(error)
    }
  },

  /**
   * Abre uma aula na agenda governamental.
   */
  async abrirAula(aulaData) {
    try {
      const payload = DetranAdapters.toAgendamentoAulaPayload(aulaData)
      
      // const response = await detranApi.post('/aulas/abrir', payload)
      // return response
      
      return new Promise((resolve) => setTimeout(() => resolve({ status: 'AULA_ABERTA' }), 1000))
    } catch (error) {
      handleDetranError(error)
    }
  }

}
