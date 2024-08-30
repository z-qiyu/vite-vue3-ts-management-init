import type { Material } from '@/apis/material/types'
import type { PK } from '@/apis'

export interface MaterialInOutRecord {
  id: PK // 假设这个模型有自增的主键字段
  material: Material | PK // 关联的材料，这里假设 Material 是一个已定义的类型
  quantity: number // 变动的数量，正值表示入库，负值表示出库
  in_out_time: string // 记录材料出入库的时间
  operator: string // 执行此次出入库操作的人员
  remaining_amount: number // 操作后的剩余数量
}
