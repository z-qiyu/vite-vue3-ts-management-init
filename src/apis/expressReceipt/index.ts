import api from '@/apis/instance'
import type { GetParams, Optionalize } from '@/apis'
import type { AxiosResponse } from 'axios'
import type { ExpressReceipt } from '@/apis/expressReceipt/types'

export async function getExpressReceipts(
  params: GetParams<ExpressReceipt>
): Promise<AxiosResponse<ExpressReceipt[], null>> {
  return await api.get('/express-receipts/', {
    params
  })
}

export async function getExpressReceipt(
  express_id: number
): Promise<AxiosResponse<ExpressReceipt, null>> {
  return await api.get(`/express-receipts/${express_id}/`)
}

export async function createExpressReceipt(
  data: ExpressReceipt
): Promise<AxiosResponse<ExpressReceipt, ExpressReceipt>> {
  return await api.post('/express-receipts/', data)
}

export async function updateExpressReceipt(
  data: Optionalize<ExpressReceipt>
): Promise<AxiosResponse<ExpressReceipt, Optionalize<ExpressReceipt>>> {
  return await api.patch(`/express-receipts/${data.express_id}/`, data)
}

export async function deleteExpressReceipt(
  data: Optionalize<ExpressReceipt>
): Promise<AxiosResponse<ExpressReceipt, Optionalize<ExpressReceipt>>> {
  return await api.patch(`/express-receipts/${data.express_id}/`, data)
}
