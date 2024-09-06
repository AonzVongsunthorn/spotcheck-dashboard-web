import { basedAxiosRequest as request } from '../baseImageAPIRequest'
import { SettingAPIResponse } from './interface'

export const getSettingAPI = async () => {
  const response = await request.get<SettingAPIResponse>('/api/setting')
  return response.data
}

export const updateSettingAPI = async (data) => {
  const response = await request.post<SettingAPIResponse>('/api/setting', data)
  return response.data
}
