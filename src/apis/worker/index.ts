import api from '@/apis/instance'
import type { GetParams, Optionalize } from '@/apis'
import type { AxiosResponse } from 'axios'
import type { User } from '@/apis/users/types'
import type { Worker } from '@/apis/worker/types'

export async function getWorkers(params: GetParams<Worker>): Promise<AxiosResponse<Worker[], null>> {
  return await api.get('/worker/', {
    params
  })
}

export async function getWorker(id: number): Promise<AxiosResponse<Worker, null>> {
  return await api.get(`/worker/${id}/`)
}

export async function createWorker(data: Worker): Promise<AxiosResponse<Worker, Worker>> {
  return await api.post('/worker/', data)
}

export async function updateWorker(
  data: Optionalize<Worker>
): Promise<AxiosResponse<Worker, Optionalize<Worker>>> {
  return await api.patch(`/worker/${data.id}/`, data)
}

export async function deleteWorker(id: number): Promise<AxiosResponse<Worker, Optionalize<Worker>>> {
  return await api.delete(`/worker/${id}/`)
}
