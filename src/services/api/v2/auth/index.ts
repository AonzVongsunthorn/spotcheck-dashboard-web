import { basedAxiosRequest as request } from '../baseImageAPIRequest'
import { LoginInput, LoginResponse } from './interface'
import { HTTP_CODES } from '../../../../constants'

export const callLoginAPI = async (user: LoginInput) => {
  try {
    const response = await request.post<LoginResponse>('/api/user/login', user)
    const result = {
      isSuccess: false,
      token: '',
    }
    if (response.status === HTTP_CODES.SUCCESS) {
      result.isSuccess = true
      result.token = response.data.token
    }
    return result
  } catch (e) {
    return {
      isSuccess: false,
      token: '',
    }
  }
}
