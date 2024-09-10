import { basedAxiosRequest as request } from '../baseAuthServiceRequest'
import {
  LoginInput,
  LoginResponse,
  OTPVerificationResponse,
  RequestOTPResponse,
  UserResponse,
  VerifyOTPResponse,
} from './api.interface'

export const login = async (user: LoginInput) => {
  const result = {
    isSuccess: true,
    response: {} as LoginResponse,
  }
  try {
    const response = await request.post<LoginResponse>('auth/login', user)
    result.response = response.data
  } catch (err) {
    console.log('err', err)
    result.isSuccess = false
  }
  return result
}

export const getProfile = async () => {
  const response = await request.get<UserResponse>('auth/me')
  return response.data
}

export const getOTPVerificationStatus = async () => {
  const response = await request.get<OTPVerificationResponse>('auth/otp-verification-status')
  return response.data
}

export const requestOTP = async () => {
  const response = await request.post<RequestOTPResponse>('auth/request-otp')
  return response.data
}

export const verifyOTP = async (otp: string) => {
  const result = {
    isSuccess: true,
  }
  try {
    await request.post<VerifyOTPResponse>('auth/verify-otp', { otp })
  } catch (err) {
    result.isSuccess = false
  }
  return result
}
