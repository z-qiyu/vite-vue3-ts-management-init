import api from '@/apis/instance'
import type { GetParams, Optionalize } from '@/apis'
import type { AxiosResponse } from 'axios'
import type { ExperimentPlan } from '@/apis/experimentPlan/types'

export async function getExperimentPlans(
  params: GetParams<ExperimentPlan>
): Promise<AxiosResponse<ExperimentPlan[], null>> {
  return await api.get('/experiment-plans/', {
    params
  })
}

export async function getExperimentPlan(id: number): Promise<AxiosResponse<ExperimentPlan, null>> {
  return await api.get(`/experiment-plans/${id}/`)
}

export async function createExperimentPlan(
  data: ExperimentPlan
): Promise<AxiosResponse<ExperimentPlan, ExperimentPlan>> {
  return await api.post('/experiment-plans/', data)
}

export async function updateExperimentPlan(
  data: Optionalize<ExperimentPlan>
): Promise<AxiosResponse<ExperimentPlan, Optionalize<ExperimentPlan>>> {
  return await api.patch(`/experiment-plans/${data.id}/`, data)
}

export async function deleteExperimentPlan(
  id: number
): Promise<AxiosResponse<ExperimentPlan, Optionalize<ExperimentPlan>>> {
  return await api.delete(`/experiment-plans/${id}/`)
}
