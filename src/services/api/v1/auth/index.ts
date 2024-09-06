import { basedAxiosRequest as request } from '../baseRequest'
import { LoginInput, LoginResponse, UserResponse } from './api.interface'

export const login = async (user: LoginInput) => {
  const response = await request.post<LoginResponse>('auth/login', user)
  return response.data
}

export const getProfile = async () => {
  const response = await request.get<UserResponse>('auth/me')
  return response.data
}
