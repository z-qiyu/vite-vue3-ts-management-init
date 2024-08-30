import type { PK } from '@/apis'

export interface ExperimentPlan {
  id: PK
  title: string
  level: 1 | 2 | 3 // Using union type for the choice field
  content: string
  weight: number
}
