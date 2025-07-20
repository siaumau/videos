import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: () => import('../views/WelcomeView.vue')
        },
        {
          path: '/modules/:module',
          name: 'module-detail',
          component: () => import('../views/ModuleDetailView.vue')
        }
      ]
    }
  ]
})

// 路由守衛
router.beforeEach((to, from, next) => {
  const userInfo = localStorage.getItem('userInfo')
  
  if (to.meta.requiresAuth && !userInfo) {
    next('/login')
  } else if (to.path === '/login' && userInfo) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
