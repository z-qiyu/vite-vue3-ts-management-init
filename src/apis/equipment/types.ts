import type { Supplier } from '@/apis/supplier/types'
import type { PK } from '@/apis'

export interface Equipment {
  equipment_id: PK // 设备的唯一标识符
  name: string // 设备的名称
  specification: string // 设备的规格描述
  quantity: number // 实验室中该设备的数量
  supplier: Supplier | PK | null // 设备的供应商
  purchaser: string // 购买此设备的人员
  description: string // 设备的详细描述
}
