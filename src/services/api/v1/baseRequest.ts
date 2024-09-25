import axios, { AxiosRequestConfig } from 'axios'
import { SESSION_TOKEN_KEY } from '../../../constants'
const API_KEY_V1 = import.meta.env.VITE_API_KEY_V1
const BASE_IMPS_API_URL = import.meta.env.VITE_BASE_IMPS_API_URL
const baseRequest = axios.create({
  baseURL: BASE_IMPS_API_URL,
})

baseRequest.defaults.headers.common['Content-Type'] = 'application/json'
baseRequest.interceptors.request.use((req: AxiosRequestConfig) => {
  const accessToken = localStorage.getItem(SESSION_TOKEN_KEY)
  req!.headers!['api-key'] = API_KEY_V1
  return req
})

export const basedAxiosRequest = baseRequest

// ---- USER MANAGEMENT
