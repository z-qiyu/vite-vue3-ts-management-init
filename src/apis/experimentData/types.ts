import type { ExperimentScheme } from '@/apis/experimentScheme/types'
import type { PK } from '@/apis'
import type { User } from '@/apis/users/types'

export type ExperimentDataTableDataCol = {
  [key in number]: {
    value: number
    type?: 'default' | 'important'
  } // 数据
}

export type ExperimentDataTableData = {
  label: string // 7天饱和 // 14d // 28d
  col_count: number // 列数量
  rows: {
    [key in number]: ExperimentDataTableDataCol
  }
}

export type ExperimentDataTable = {
  name: string // 重量 高度 压力
  groups: ExperimentDataTableData[]
}

export type ExperimentDataGroup = {
  title: string // 保养前，保养后
  tables: ExperimentDataTable[]
}

export type ExperimentDataJson = {
  group_count: number
  data: ExperimentDataGroup[]
}

export interface ExperimentData {
  id: PK
  experiment_scheme: ExperimentScheme | PK
  data_entry: ExperimentDataJson // Assuming you have a Json type definition
  entry_person: User | PK // Foreign key ID
  entry_date: string // DateTime will also be serialized as string
  entry_date_schema?: {
    day: number
    month: number
    year: number
    hour: number
    minute: number
    second: number
  }
}
