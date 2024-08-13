import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import type { RouteRaw } from '@/router/types'

export const nav:RouteRaw[] = [
  {
    path: '',
    name: 'home',
    component: () => import('@/views/pages/home.vue'),
    meta:{
      title: '实验管理系统'
    }
  },
  {
    path: 'immediate-arrangement',
    name: 'immediate-arrangement',
    meta:{
      title: '近期安排'
    },
    children: [
      {
        path: 'work',
        name: 'work',
        component: () => import('@/views/pages/immediate-arrangement/work.vue'),
        meta:{
          title: '近期计划工作'
        }
      },
      {
        path: 'summarize',
        name: 'summarize',
        component: () => import('@/views/pages/immediate-arrangement/summarize.vue'),
        meta:{
          title: '每日工作总结'
        }
      },
      {
        path: 'done',
        name: 'done',
        component: () => import('@/views/pages/immediate-arrangement/done.vue'),
        meta:{
          title: '近期完成工作'
        }
      },
      {
        path: 'system-change',
        name: 'system-change',
        component: () => import('@/views/pages/immediate-arrangement/system-change.vue'),
        meta:{
          title: '近期系统变化'
        }
      },
    ]
  },
]

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/base.vue'),
    children: nav
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const user = useUserStore()
  const publicPages = ['/login', '/register', '/']
  const isAuthenticated = user.isLoggedIn

  if (publicPages.includes(to.path) || isAuthenticated) {
    next()
  } else {
    ElMessage.error('请登录')
    next({ name: 'login' })
  }
})

export default router
