import type { PK } from '@/apis'

export interface Supplier {
  supplier_id: PK // 供应商的唯一标识符
  company_name: string // 供应商的公司名称
  contact_person: string // 供应商的主要联系人
  contact_position: string // 联系人在公司的职位
  contact_number: string // 联系人的电话号码
  address: string // 供应商的地址
  shipping_cost: number // 从供应商处发货的平均成本
}
