import axios, { AxiosRequestConfig } from 'axios'
const API_KEY_V1 = import.meta.env.VITE_API_KEY_V1
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL
const baseRequest = axios.create({
  baseURL: BASE_API_URL,
})

baseRequest.defaults.headers.common['Content-Type'] = 'application/json'
baseRequest.interceptors.request.use((req: AxiosRequestConfig) => {
  const accessToken = localStorage.getItem('access_token')
  req!.headers!['api-key'] = API_KEY_V1
  return req
})

export const basedAxiosRequest = baseRequest

// ---- USER MANAGEMENT
