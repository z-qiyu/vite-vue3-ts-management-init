import type { PK } from '@/apis'
import type { Supplier } from '@/apis/supplier/types'

export interface Material {
  material_id: PK // 材料的唯一标识符
  name: string // 材料的名称
  chemical_name: string // 材料的化学名称
  cas_number?: string | null // 材料的CAS编号，可选
  is_confidential: boolean // 指示材料是否需要保密
  confidential_code?: string | null // 如果材料保密，则提供保密代码
  specification: string // 材料的规格
  packaging_spec: string // 材料的包装规格
  remaining_amount: number // 材料的剩余数量
  supplier: PK | Supplier // 这里假设我们只存储供应商ID，实际应用中可能需要一个完整的供应商对象
  purchaser: string // 购买材料的人
  description: string // 材料的详细描述
  price: number // 材料的单价
  shipping_cost: number // 运输成本
  warning_limit: number // 库存警告阈值
}
