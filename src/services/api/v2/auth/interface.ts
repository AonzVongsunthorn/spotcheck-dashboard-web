export interface LoginInput {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface LoginResult {
  isSuccess: boolean
  token: string
}
