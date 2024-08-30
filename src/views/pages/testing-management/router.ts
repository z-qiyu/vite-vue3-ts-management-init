import type { RouteRaw } from '@/router/types'
import { PermissionEnum } from '@/stores'

export const TestPlanDetail: RouteRaw[] = [
  {
    path: '/test-plan-detail/:id',
    name: 'test-plan-detail',
    component: () => import('@/views/pages/testing-management/test-plan-detail.vue'),
    meta: {
      title: '试验方案详情',
      permission: [PermissionEnum.SUPERADMIN,PermissionEnum.ADMIN,]
    },
    props: true
  },
  {
    path: '/test-data/:id',
    name: 'test-data',
    component: () => import('@/views/pages/testing-management/test-data.vue'),
    meta: {
      title: '试验方案数据',
      permission: [PermissionEnum.SUPERADMIN,PermissionEnum.ADMIN,PermissionEnum.STAFF]
    },
    props: true
  },
  {
    path: '/test-data-preview/:id',
    name: 'test-data-preview',
    component: () => import('@/views/pages/testing-management/test-data-preview.vue'),
    meta: {
      title: '试验方案详情预览',
      permission: [PermissionEnum.SUPERADMIN,PermissionEnum.ADMIN,]
    },
    props: true
  }
]

export default {
  path: 'testing-management',
  name: 'testing-management',
  meta: {
    title: '试验管理',
    no_permission:[PermissionEnum.VISITOR]
  },
  children: [
    {
      path: 'research-progress',
      name: 'research-progress',
      component: () => import('@/views/pages/testing-management/research-progress.vue'),
      meta: {
        title: '研究进度v1',
        permission: [PermissionEnum.SUPERADMIN,PermissionEnum.STAFF,PermissionEnum.ADMIN]
      }
    },
    {
      path: 'research-progress-v2',
      name: 'research-progress-v2',
      component: () => import('@/views/pages/testing-management/research-progress-v2.vue'),
      meta: {
        title: '研究进度v2',
        permission: [PermissionEnum.SUPERADMIN,PermissionEnum.STAFF,PermissionEnum.ADMIN]
      }
    },
    {
      path: 'test-plan',
      name: 'test-plan',
      component: () => import('@/views/pages/testing-management/test-plan.vue'),
      meta: {
        title: '试验方案查看',
        permission: [PermissionEnum.SUPERADMIN,PermissionEnum.ADMIN,]
      }
    },
    {
      path: 'test-plan-submission',
      name: 'test-plan-submission',
      component: () => import('@/views/pages/testing-management/test-plan-submission.vue'),
      meta: {
        title: '试验方案提交',
        permission: [PermissionEnum.SUPERADMIN,PermissionEnum.ADMIN,]
      }
    },
    {
      path: 'test-data-analysis',
      name: 'test-data-analysis',
      component: () => import('@/views/pages/testing-management/test-data-analysis.vue'),
      meta: {
        title: '试验数据分析',
        permission: [PermissionEnum.SUPERADMIN,PermissionEnum.STAFF,PermissionEnum.ADMIN]
      }
    },
    {
      path: 'report-sorting',
      name: 'report-sorting',
      component: () => import('@/views/pages/testing-management/report-sorting.vue'),
      meta: {
        title: '报告整理',
        permission: [PermissionEnum.SUPERADMIN,PermissionEnum.ADMIN]
      }
    },
    {
      path: 'experiment-plan',
      name: 'experiment-plan',
      component: () => import('@/views/pages/testing-management/experiment-plan.vue'),
      meta: {
        title: '研究计划',
        permission: [PermissionEnum.SUPERADMIN,PermissionEnum.ADMIN]
      }
    }
  ]
}
