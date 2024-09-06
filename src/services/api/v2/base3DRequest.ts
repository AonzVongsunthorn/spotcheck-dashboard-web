import axios, { AxiosRequestConfig } from 'axios'

const BASE_API_URL = import.meta.env.VITE_BASE_3D_API_URL
const baseRequest = axios.create({
  baseURL: BASE_API_URL,
})

export const basedAxiosRequest = baseRequest

