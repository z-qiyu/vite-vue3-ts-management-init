import api from '@/apis/instance'
import type { GetParams, Optionalize } from '@/apis'
import type { AxiosResponse } from 'axios'
import type { User } from '@/apis/users/types'

export async function getUsers(params: GetParams<User>): Promise<AxiosResponse<User[], null>> {
  return await api.get('/users/', {
    params
  })
}

export async function getUser(id: number): Promise<AxiosResponse<User, null>> {
  return await api.get(`/users/${id}/`)
}

export async function createUser(data: User): Promise<AxiosResponse<User, User>> {
  return await api.post('/users/', data)
}

export async function updateUser(
  data: Optionalize<User>
): Promise<AxiosResponse<User, Optionalize<User>>> {
  return await api.patch(`/users/${data.id}/`, data)
}

export async function deleteUser(id: number): Promise<AxiosResponse<User, Optionalize<User>>> {
  return await api.delete(`/users/${id}/`)
}
