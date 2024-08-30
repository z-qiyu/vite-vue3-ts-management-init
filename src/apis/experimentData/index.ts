import api from '@/apis/instance'
import type { GetParams, Optionalize } from '@/apis'
import type { AxiosResponse } from 'axios'
import type { ExperimentData } from '@/apis/experimentData/types'

export async function getExperimentDatas(
  params: GetParams<ExperimentData>
): Promise<AxiosResponse<ExperimentData[], null>> {
  return await api.get('/experiment-data/', {
    params
  })
}

export async function getExperimentData(id: number): Promise<AxiosResponse<ExperimentData, null>> {
  return await api.get(`/experiment-data/${id}/`)
}

export async function createExperimentData(
  data: ExperimentData
): Promise<AxiosResponse<ExperimentData, ExperimentData>> {
  return await api.post('/experiment-data/', data)
}

export async function updateExperimentData(
  data: Optionalize<ExperimentData>
): Promise<AxiosResponse<ExperimentData, Optionalize<ExperimentData>>> {
  return await api.patch(`/experiment-data/${data.id}/`, data)
}

export async function deleteExperimentData(
  data: Optionalize<ExperimentData>
): Promise<AxiosResponse<ExperimentData, Optionalize<ExperimentData>>> {
  return await api.patch(`/experiment-data/${data.id}/`, data)
}
