import api from '@/apis/instance'
import type { GetParams, Optionalize } from '@/apis'
import type { AxiosResponse } from 'axios'
import type { ExperimentReport } from '@/apis/experimentReport/types'

export async function getExperimentReports(
  params: GetParams<ExperimentReport>
): Promise<AxiosResponse<ExperimentReport[], null>> {
  return await api.get('/experiment-report/', {
    params
  })
}

export async function getExperimentReport(
  params: GetParams<ExperimentReport>
): Promise<AxiosResponse<ExperimentReport[], null>> {
  return await api.get('/experiment-report/', {
    params
  })
}


export async function createExperimentReport(
  data: ExperimentReport
): Promise<AxiosResponse<ExperimentReport, ExperimentReport>> {
  return await api.post('/experiment-report/', data)
}

export async function updateExperimentReport(
  data: Optionalize<ExperimentReport>
): Promise<AxiosResponse<ExperimentReport, Optionalize<ExperimentReport>>> {
  return await api.patch(`/experiment-report/${data.id}/`, data)
}

export async function deleteExperimentReport(
  id: number
): Promise<AxiosResponse<ExperimentReport, Optionalize<ExperimentReport>>> {
  return await api.delete(`/experiment-report/${id}/`)
}

