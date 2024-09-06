export interface TokenDecodedResult {
  name: string
  email: string
  role: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthResult {
  access_token: string
}

export interface LoginResponse {
  data: AuthResult
}

export interface UserResponse {
  data: TokenDecodedResult
}
