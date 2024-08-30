import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import type { RouteRaw } from '@/router/types'
import {
  ImmediateArrangement,
  MaterialsEquipment,
  System,
  TestingManagement,
  TestPlanDetail
} from '@/views/pages/routers'

export const nav: RouteRaw[] = [
  {
    path: '',
    name: 'home',
    component: () => import('@/views/pages/home.vue'),
    meta: {
      title: '实验管理系统'
    }
  },

  ImmediateArrangement,
  MaterialsEquipment,
  TestingManagement,
  System
]

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/base.vue'),
    children: nav
  },
  ...TestPlanDetail,
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

router.beforeEach((to:RouteRaw, from, next) => {
  const users = useUserStore()
  const publicPages = ['/login', '/register', '/']
  const isAuthenticated = users.isLoggedIn
  if(!users.showNav(to.meta.permission,to.meta.no_permission)){
    ElMessage.error('没有权限')
    next({ name: 'home' })
  }
  if (publicPages.includes(to.path) || isAuthenticated) {
    next()
  } else {
    ElMessage.error('请登录')
    next({ name: 'login' })
  }
})

export default router
