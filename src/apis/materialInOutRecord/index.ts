import api from '@/apis/instance'
import type { GetParams, Optionalize } from '@/apis'
import type { AxiosResponse } from 'axios'
import type { MaterialInOutRecord } from '@/apis/materialInOutRecord/types'

export async function getMaterialInOutRecords(
  params: GetParams<MaterialInOutRecord>
): Promise<AxiosResponse<MaterialInOutRecord[], null>> {
  return await api.get('/material-records/', {
    params
  })
}

export async function getMaterialInOutRecord(
  id: number
): Promise<AxiosResponse<MaterialInOutRecord, null>> {
  return await api.get(`/material-records/${id}/`)
}

export async function createMaterialInOutRecord(
  data: MaterialInOutRecord
): Promise<AxiosResponse<MaterialInOutRecord, MaterialInOutRecord>> {
  return await api.post('/material-records/', data)
}

export async function updateMaterialInOutRecord(
  data: Optionalize<MaterialInOutRecord>
): Promise<AxiosResponse<MaterialInOutRecord, Optionalize<MaterialInOutRecord>>> {
  return await api.patch(`/material-records/${data.id}/`, data)
}

export async function deleteMaterialInOutRecord(
  data: Optionalize<MaterialInOutRecord>
): Promise<AxiosResponse<MaterialInOutRecord, Optionalize<MaterialInOutRecord>>> {
  return await api.patch(`/material-records/${data.id}/`, data)
}
