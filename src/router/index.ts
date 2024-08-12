import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/base.vue'),
    children: []
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
  const publicPages = ['/login', '/register']
  const isAuthenticated = user.isLoggedIn

  if (publicPages.includes(to.path) || isAuthenticated) {
    next()
  } else {
    ElMessage.error('请登录')
    next({ name: 'login' })
  }
})

export default router
