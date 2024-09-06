export interface User {
  id: number
  email: string
  name: string
  role: string
  password?: string
  lastLoginAt?: string
  isActive: boolean
}

export interface ListUserResponse {
  data: User[]
}

export interface GetUserResponse {
  data: User
}

export interface CreateUserBody {
  email: string
  name: string
  role: string
  isActive: boolean
}

export interface CreateUserResponse {
  data: User
}

export interface UpdateUserBody {
  name: string
  role: string
}

export interface UpdateUserResponse {
  data: User
}

export interface UserUpdateStatusBody {
  isActive: boolean
}

export interface UpdateStatusUserResponse {
  data: User
}

export interface UserUpdatePasswordBody {
  password: string
}

export interface UpdatePasswordUserResponse {
  data: User
}
