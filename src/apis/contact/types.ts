import type { Supplier } from '@/apis/supplier/types'
import type { PK } from '@/apis'

export type Contact = {
  contact_id: PK | null
  name: string
  phone_number: string
  position: string
  responsibility: string
  company: Supplier | PK | null // 这里假定 Supplier 是一个包含至少 id 和 name 属性的对象
}
