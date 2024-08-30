import type { Material } from '@/apis/material/types'
import type { ExperimentPlan } from '@/apis/experimentPlan/types'
import type { User } from '@/apis/users/types'
import type { Optionalize, PK } from '@/apis'
import type { ExperimentData } from '@/apis/experimentData/types'

type Json = {
  [key in string]: {
    [key in string]: string // 处理方式
  }
}

type ProcessStatus = {
  [key in string]: {
    question: '1' | '2' | '3'
    date: '1' | '2'
  }
}

export interface ExperimentScheme {
  id: PK
  experiment_type: string // Union type for choices
  experiment_name: string
  purpose: string
  experiment_plan: ExperimentPlan | PK // Assuming foreign key returns an ID
  creator: User | PK // Same as above
  submission_date: string // Date will be serialized as string
  importance_level: '重要' | '特别重要' | '一般' | null
  experiment_number: string
  scheme_content: string
  materials: Array<Optionalize<Material> | PK> // Simplified representation of many-to-many relationship
  dosage: Json
  test_index: string
  auto_report: boolean
  start_date?: {
    day: number
    month: number
    year: number
    hour: number
    minute: number
    second: number
  }
  process_status_list: ProcessStatus[]
}

export type ExperimentSchemeProcess = {
  id: PK
  experiment_name: string
  experiment_number: string
  experiment_data: ExperimentData
  process_status_list: ProcessStatus[]
}

export type ExperimentProcess =  {
  id?: PK; // ID 可能是可选的，因为它是数据库自动生成的
  experiment_scheme?: ExperimentScheme | PK; // 关联的实验方案
  title: string; // 标题
  parent?: ExperimentProcess | PK; // 父级实验进度，可以为空
  conclusion: string; // 结论
  weight: number; // 权重
  completeness: number; // 完整性百分比
}

export type ExperimentSchemeHasExperimentProcess = {
  id: PK
  experiment_process: ExperimentProcess[]
  add_experiment_process: ExperimentProcess[]
  experiment_name: string
}
