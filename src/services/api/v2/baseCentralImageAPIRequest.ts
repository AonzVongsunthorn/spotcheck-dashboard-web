import axios from 'axios'

const BASE_API_URL = import.meta.env.VITE_BASE_CENTRAL_IMAGE_API_URL
const baseImageAPIRequest = axios.create({
  baseURL: BASE_API_URL,
})

// baseImageAPIRequest.defaults.headers.common['Content-Type'] = 'application/json'
// baseImageAPIRequest.interceptors.request.use((req: AxiosRequestConfig) => {
//   const accessToken = localStorage.getItem('access_token')
//   req!.headers!.Authorization = `Bearer ${accessToken}`
//   return req
// })

export const basedAxiosRequest = baseImageAPIRequest

// ---- USER MANAGEMENT
