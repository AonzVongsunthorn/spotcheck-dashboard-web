export interface TokenDecodedResult {
  name: string
  email: string
  telephoneNo: string
  role: string
  isAlive: boolean
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthResult {
  access_token: string
  name: string
  email: string
  telephoneNo: string
  role: string
}

export interface LoginResponse {
  data: AuthResult
}

export interface UserResponse {
  data: TokenDecodedResult
}

export interface User {
  id: number
  email: string
  telephoneNo: string
  name: string
  role: string
  password?: string
  lastLoginAt?: string
  isActive: boolean
  isDoneOTPVerification?: boolean
}

export interface RequestOTPResult {
  telephoneNo: string
  ref: string
  status: string
  lastRequest: string
  isFromCache: string
}

export interface RequestOTPResponse {
  data: RequestOTPResult
}

export interface VerifyOTPResultError {
  status: number
  message: number
}

export interface VerifyOTPResponse {
  data: VerifyOTPResultError
}

export interface RequestOTPVerificationResponse {
  isPassOTPVerification: boolean
}

export interface OTPVerificationResponse {
  data: RequestOTPVerificationResponse
}
