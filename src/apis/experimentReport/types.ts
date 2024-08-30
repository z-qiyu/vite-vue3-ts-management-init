import type { ExperimentScheme } from '@/apis/experimentScheme/types'
import type { PK } from '@/apis'

export type ExperimentReportRow = {
  content: string
  report: string
  rate: string
  experiment_scheme: ExperimentScheme
}

export type ExperimentReportJson = {
  data: ExperimentReportRow[]
}

export type ExperimentReport = {
  id:PK
  title: string
  content: ExperimentReportJson
  created_at:string
  updated_at:string
  experiment_schemes: PK[]
}
