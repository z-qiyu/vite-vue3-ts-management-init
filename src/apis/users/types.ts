import type { PK } from '@/apis'

export type User = {
  id: PK
  password: string
  last_login?: string | null // Nullable datetime field
  is_superuser?: boolean
  phone: string
  username: string
  first_name: string
  last_name: string
  email: string
  is_staff?: boolean
  is_admin?: boolean
  is_active?: boolean
  date_joined?: string
}
