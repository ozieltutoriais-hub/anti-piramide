/**
 * ERROR HANDLING
 * 
 * APIs do governo frequentemente retornam erros genéricos ou códigos feios.
 * Essa camada captura o erro do Axios e transforma em mensagens amigáveis para a UI.
 */

export class DetranError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'DetranError'
    this.code = code
  }
}

export function handleDetranError(error) {
  // Se não houver resposta, o servidor caiu ou deu timeout
  if (!error.response) {
    throw new DetranError(
      'Os servidores do DETRAN não estão respondendo. Verifique sua internet ou tente novamente mais tarde.',
      'TIMEOUT_OR_NETWORK'
    )
  }

  const { status, data } = error.response

  // Tratamento de códigos HTTP comuns
  if (status === 401) {
    throw new DetranError('Credenciais inválidas. O Certificado do CFC pode estar vencido.', 'AUTH_ERROR')
  }

  if (status === 500 || status === 503) {
    throw new DetranError('O sistema do Governo está indisponível (Erro 500).', 'GOV_UNAVAILABLE')
  }

  // Erros específicos de regra de negócio do Detran (exemplo genérico)
  if (data && data.codigoErro) {
    switch (data.codigoErro) {
      case 'RENACH_INVALIDO':
        throw new DetranError('O número de RENACH informado não existe na base do governo.', 'BUSINESS_ERROR')
      case 'BIOMETRIA_PENDENTE':
        throw new DetranError('O aluno precisa cadastrar a biometria antes de prosseguir.', 'BUSINESS_ERROR')
      default:
        throw new DetranError(`Erro desconhecido do Detran: ${data.mensagem}`, 'UNKNOWN_BUSINESS')
    }
  }

  throw new DetranError('Ocorreu um erro inesperado na comunicação com o governo.', 'UNKNOWN')
}
