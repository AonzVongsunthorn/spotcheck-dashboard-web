import { basedAxiosRequest as request } from '../baseRequest'
import {
  CreateUserBody,
  CreateUserResponse,
  GetUserResponse,
  ListUserResponse,
  UpdatePasswordUserResponse,
  UpdateStatusUserResponse,
  UpdateUserBody,
  UpdateUserResponse,
  UserUpdatePasswordBody,
  UserUpdateStatusBody,
} from './api.interface'

export const listUsers = async () => {
  const response = await request.get<ListUserResponse>(`user`)
  return response.data
}

export const getUser = async (id: number) => {
  const response = await request.get<GetUserResponse>(`user/${id}`)
  return response.data
}

export const createUser = async (body: CreateUserBody) => {
  const response = await request.post<CreateUserResponse>(`user`, body)
  return response.data
}

export const updateUser = async (id: number, body: UpdateUserBody) => {
  const response = await request.patch<UpdateUserResponse>(`user/${id}`, body)
  return response.data
}

export const updateUserStatus = async (id: number, body: UserUpdateStatusBody) => {
  const response = await request.patch<UpdateStatusUserResponse>(`user/${id}/status`, body)
  return response.data
}

export const updateUserPassword = async (id: number, body: UserUpdatePasswordBody) => {
  const response = await request.patch<UpdatePasswordUserResponse>(`user/${id}/password`, body)
  return response.data
}
