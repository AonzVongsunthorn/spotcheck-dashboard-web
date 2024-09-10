import axios, { AxiosRequestConfig } from 'axios'
import { SESSION_TOKEN_KEY } from '../../constants'

const BASE_AUTH_API_URL = import.meta.env.VITE_BASE_AUTH_API_URL
console.log('BASE_AUTH_API_URL', BASE_AUTH_API_URL)
const baseRequest = axios.create({
  baseURL: BASE_AUTH_API_URL,
})

baseRequest.defaults.headers.common['Content-Type'] = 'application/json'
// @ts-ignore
baseRequest.interceptors.request.use((req: AxiosRequestConfig) => {
  const accessToken = localStorage.getItem(SESSION_TOKEN_KEY)
  req!.headers!.Authorization = `Bearer ${accessToken}`
  return req
})

export const basedAxiosRequest = baseRequest

// ---- USER MANAGEMENT
