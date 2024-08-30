import api from '@/apis/instance'
import type { GetParams, Optionalize } from '@/apis'
import type { AxiosResponse } from 'axios'
import type {
  ExperimentProcess,
  ExperimentScheme,
  ExperimentSchemeHasExperimentProcess,
  ExperimentSchemeProcess
} from '@/apis/experimentScheme/types'

export async function getExperimentSchemes(
  params: GetParams<ExperimentScheme>
): Promise<AxiosResponse<ExperimentScheme[], null>> {
  return await api.get('/experiment-schemes/', {
    params
  })
}

export async function getExperimentSchemesProcess(
  params: GetParams<ExperimentScheme>
): Promise<AxiosResponse<ExperimentSchemeProcess[], null>> {
  return await api.get('/experiment-schemes-process/', {
    params
  })
}

export async function getExperimentScheme(
  id: number
): Promise<AxiosResponse<ExperimentScheme, null>> {
  return await api.get(`/experiment-schemes/${id}/`)
}

export async function createExperimentScheme(
  data: ExperimentScheme
): Promise<AxiosResponse<ExperimentScheme, ExperimentScheme>> {
  return await api.post('/experiment-schemes/', data)
}

export async function updateExperimentScheme(
  data: Optionalize<ExperimentScheme>
): Promise<AxiosResponse<ExperimentScheme, Optionalize<ExperimentScheme>>> {
  return await api.patch(`/experiment-schemes/${data.id}/`, data)
}

export async function deleteExperimentScheme(
  id: number
): Promise<AxiosResponse<ExperimentScheme, Optionalize<ExperimentScheme>>> {
  return await api.delete(`/experiment-schemes/${id}/`)
}

export async function getExperimentSchemeHasExperimentProcesses(
  params: GetParams<ExperimentScheme>
): Promise<AxiosResponse<ExperimentSchemeHasExperimentProcess[], null>> {
  return await api.get('/experiment-process/',{params})
}

export async function createExperimentSchemeHasExperimentProcesses(
  data: Record<string, any>
): Promise<AxiosResponse<null, null>> {
  return await api.post('/experiment-scheme-process/',data)
}

export async function updateExperimentSchemeHasExperimentProcesses(
  data: ExperimentProcess
): Promise<AxiosResponse<ExperimentProcess, null>> {
  return await api.patch(`/experiment-scheme-process/${data.id}/`,data)
}

export async function deleteExperimentSchemeHasExperimentProcesses(
  data: ExperimentProcess
): Promise<AxiosResponse<ExperimentProcess, null>> {
  return await api.delete(`/experiment-scheme-process/${data.id}/`)
}