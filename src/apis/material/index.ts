import api from '@/apis/instance'
import type { GetParams, Optionalize } from '@/apis'
import type { Material } from '@/apis/material/types'
import type { AxiosResponse } from 'axios'

export async function getMaterials(
  params: GetParams<Material>
): Promise<AxiosResponse<Material[], null>> {
  return await api.get('/materials/', {
    params
  })
}

export async function getMaterial(material_id: number): Promise<AxiosResponse<Material, null>> {
  return await api.get(`/materials/${material_id}/`)
}

export async function createMaterial(data: Material): Promise<AxiosResponse<Material, Material>> {
  return await api.post('/materials/', data)
}

export async function updateMaterial(
  data: Optionalize<Material>
): Promise<AxiosResponse<Material, Optionalize<Material>>> {
  return await api.patch(`/materials/${data.material_id}/`, data)
}

export async function deleteMaterial(
  data: Optionalize<Material>
): Promise<AxiosResponse<Material, Optionalize<Material>>> {
  return await api.patch(`/materials/${data.material_id}/`, data)
}
