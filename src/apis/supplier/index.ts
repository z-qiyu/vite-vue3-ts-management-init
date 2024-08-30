import api from '@/apis/instance'
import type { GetParams, Optionalize } from '@/apis'
import type { AxiosResponse } from 'axios'
import type { Supplier } from '@/apis/supplier/types'

export async function getSuppliers(
  params: GetParams<Supplier>
): Promise<AxiosResponse<Supplier[], null>> {
  return await api.get('/suppliers/', {
    params
  })
}

export async function getSupplier(id: number): Promise<AxiosResponse<Supplier, null>> {
  return await api.get(`/suppliers/${id}/`)
}

export async function createSupplier(data: Supplier): Promise<AxiosResponse<Supplier, Supplier>> {
  return await api.post('/suppliers/', data)
}

export async function updateSupplier(
  data: Optionalize<Supplier>
): Promise<AxiosResponse<Supplier, Optionalize<Supplier>>> {
  return await api.patch(`/suppliers/${data.supplier_id}/`, data)
}

export async function deleteSupplier(
  data: Optionalize<Supplier>
): Promise<AxiosResponse<Supplier, Optionalize<Supplier>>> {
  return await api.patch(`/suppliers/${data.supplier_id}/`, data)
}
