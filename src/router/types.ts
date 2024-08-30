import type { RouteRecordRaw } from 'vue-router'
import { PermissionEnum } from '@/stores'

type Meta = {
  title: string
  permission?: PermissionEnum[]
  no_permission?: PermissionEnum[]
}

export type RouteRaw = {
  meta: Meta
  children?: RouteRaw[]
} & RouteRecordRaw
