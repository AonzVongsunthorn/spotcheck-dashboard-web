export interface LoginParams {
  username: string
  password: string
  isRememberSession: boolean
}

export interface SessionObject {
  name: string
  token: string
  basicAuth: string
  expiredAt?: number
}

export interface UserStore {
  name: string
  token: string
  basicAuth: string
}
