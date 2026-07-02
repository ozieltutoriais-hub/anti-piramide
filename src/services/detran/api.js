import axios from 'axios'

// A URL base idealmente virá do arquivo .env (ex: import.meta.env.VITE_DETRAN_API_URL)
// Usamos uma mock URL enquanto as chaves de produção não são inseridas.
const baseURL = import.meta.env.VITE_DETRAN_API_URL || 'https://api.detran.mock.gov.br/v1'

export const detranApi = axios.create({
  baseURL,
  timeout: 15000, // Sistemas governamentais costumam ter lentidão, 15s é seguro
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor de Requisição (Antes de enviar ao Governo)
detranApi.interceptors.request.use(
  (config) => {
    // Aqui injetaremos o Bearer Token gerado via OAuth2 com o Prodesp/Serpro
    const token = localStorage.getItem('@detran_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    console.log(`[DETRAN_API] Disparando requisição para: ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de Resposta (Após receber do Governo)
detranApi.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // Se der erro 401 (Token Expirado), podemos implementar a lógica de Refresh Token aqui
    console.error('[DETRAN_API] Erro na resposta do servidor:', error.response?.status)
    return Promise.reject(error)
  }
)
