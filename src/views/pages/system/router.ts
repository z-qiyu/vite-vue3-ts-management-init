import { PermissionEnum } from '@/stores'

export default {
  path: 'system',
  name: 'system',
  meta: {
    title: '系统设置',
    no_permission:[PermissionEnum.VISITOR,PermissionEnum.STAFF]
  },
  children: [
    {
      path: 'users-and-rights-management',
      name: 'users-and-rights-management',
      component: () => import('@/views/pages/system/user-and-rights-management.vue'),
      meta: {
        title: '用户和权限管理',
        permission: [PermissionEnum.SUPERADMIN]
      }
    },
    {
      path: 'materials-and-equipment-maintenance',
      name: 'materials-and-equipment-maintenance',
      component: () => import('@/views/pages/system/materials-and-equipment-maintenance.vue'),
      meta: {
        title: '材料和设备维护',
        permission: [PermissionEnum.SUPERADMIN,PermissionEnum.ADMIN]
      }
    },
    {
      path: 'test-scheme-maintenance',
      name: 'test-scheme-maintenance',
      component: () => import('@/views/pages/system/test-scheme-maintenance.vue'),
      meta: {
        title: '试验方案维护',
        permission: [PermissionEnum.SUPERADMIN]
      }
    },
    {
      path: 'test-data-maintenance',
      name: 'test-data-maintenance',
      component: () => import('@/views/pages/system/test-data-maintenance.vue'),
      meta: {
        title: '试验数据维护',
        permission: [PermissionEnum.SUPERADMIN]
      }
    }
  ]
}
