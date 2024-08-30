import type { PK } from '@/apis'
import type { ExperimentScheme } from '@/apis/experimentScheme/types'
import type { User } from '@/apis/users/types'

export type Worker = {
  id: PK
  experiment_scheme: PK | ExperimentScheme
  done_work: string
  worker: User[]
  created_at: string
}
