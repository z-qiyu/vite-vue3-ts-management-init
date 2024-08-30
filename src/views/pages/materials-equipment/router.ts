import { PermissionEnum } from '@/stores'

export default {
  path: 'materials-equipment',
  name: 'materials-equipment',
  meta: {
    title: '材料和设备',
    no_permission:[PermissionEnum.VISITOR]
  },
  children: [
    {
      path: 'system-materials',
      name: 'system-materials',
      component: () => import('@/views/pages/materials-equipment/system-materials.vue'),
      meta: {
        title: '材料',
        permission: [PermissionEnum.SUPERADMIN,PermissionEnum.ADMIN,PermissionEnum.STAFF]
      }
    },
    {
      path: 'in-and-out-of-storage-management',
      name: 'in-and-out-of-storage-management',
      component: () =>
        import('@/views/pages/materials-equipment/in-and-out-of-storage-management.vue'),
      meta: {
        title: '材料出入库',
        permission: [PermissionEnum.SUPERADMIN,PermissionEnum.ADMIN,PermissionEnum.STAFF]
      }
    },
    {
      path: 'express-collection-record',
      name: 'express-collection-record',
      component: () => import('@/views/pages/materials-equipment/express-collection-record.vue'),
      meta: {
        title: '快递领取记录',
        permission: [PermissionEnum.SUPERADMIN,PermissionEnum.ADMIN,PermissionEnum.STAFF]
      }
    },
    {
      path: 'equipment',
      name: 'equipment',
      component: () => import('@/views/pages/materials-equipment/equipment.vue'),
      meta: {
        title: '设备',
        permission: [PermissionEnum.SUPERADMIN,PermissionEnum.ADMIN,PermissionEnum.STAFF]
      }
    },
    {
      path: 'supplier',
      name: 'supplier',
      component: () => import('@/views/pages/materials-equipment/supplier.vue'),
      meta: {
        title: '供应商',
        permission: [PermissionEnum.SUPERADMIN,PermissionEnum.ADMIN]
      }
    },
    {
      path: 'increase',
      name: 'increase',
      component: () => import('@/views/pages/materials-equipment/increase.vue'),
      meta: {
        title: '增加',
        permission: [PermissionEnum.SUPERADMIN,PermissionEnum.ADMIN]
      }
    }
  ]
}
