import { basedAxiosRequest as request } from '../baseRequest'
import { GetConfigurationResponse } from './api.interface'

// ---- CONFIGURATION

export const getConfigurations = async (key: string) => {
  const response = await request.get<GetConfigurationResponse>(`configurations?key=${key}`)
  return response.data
}
