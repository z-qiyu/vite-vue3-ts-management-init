import api from '@/apis/instance'
import type { GetParams, Optionalize } from '@/apis'
import type { AxiosResponse } from 'axios'
import type { Equipment } from '@/apis/equipment/types'

export async function getEquipments(
  params: GetParams<Equipment>
): Promise<AxiosResponse<Equipment[], null>> {
  return await api.get('/equipments/', {
    params
  })
}

export async function getEquipment(id: number): Promise<AxiosResponse<Equipment, null>> {
  return await api.get(`/equipments/${id}/`)
}

export async function createEquipment(
  data: Equipment
): Promise<AxiosResponse<Equipment, Equipment>> {
  return await api.post('/equipments/', data)
}

export async function updateEquipment(
  data: Optionalize<Equipment>
): Promise<AxiosResponse<Equipment, Optionalize<Equipment>>> {
  return await api.patch(`/equipments/${data.equipment_id}/`, data)
}

export async function deleteEquipment(
  data: Optionalize<Equipment>
): Promise<AxiosResponse<Equipment, Optionalize<Equipment>>> {
  return await api.patch(`/equipments/${data.equipment_id}/`, data)
}
