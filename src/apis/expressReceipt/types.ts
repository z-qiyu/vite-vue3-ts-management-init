import type { PK } from '@/apis'

export type ExpressReceipt = {
  express_id: PK
  name: string
  tracking_number: string
  express_label_photo: string // 假定照片路径已转换为 base64 或其他前端可直接使用的格式
  purchaser: string
  storage_time: string // DateTimeField 在前端可以存储为字符串
  receiver: string
  location: string
}
