import { PermissionEnum } from '@/stores'

export default {
  path: 'immediate-arrangement',
  name: 'immediate-arrangement',
  meta: {
    title: '近期安排',
  },
  children: [
    {
      path: 'work',
      name: 'work',
      component: () => import('@/views/pages/immediate-arrangement/work.vue'),
      meta: {
        title: '近期计划工作'
      }
    },
    {
      path: 'summarize',
      name: 'summarize',
      component: () => import('@/views/pages/immediate-arrangement/summarize.vue'),
      meta: {
        title: '每日工作总结'
      }
    },
    {
      path: 'done',
      name: 'done',
      component: () => import('@/views/pages/immediate-arrangement/done.vue'),
      meta: {
        title: '近期完成工作'
      }
    },
    {
      path: 'system-change',
      name: 'system-change',
      component: () => import('@/views/pages/immediate-arrangement/system-change.vue'),
      meta: {
        title: '近期系统变化'
      }
    }
  ]
}
