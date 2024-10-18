import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import Login from '@/views/Login/index.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: Layout,
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/Home/index.vue')
        },
        {
          path: '/organization',
          name: 'organization',
          component: () => import('@/views/Department/index.vue')
        },
        {
          path: '/role',
          name: 'role',
          component: () => import('@/views/Role/index.vue')
        },
        {
          path: '/staff',
          name: 'staff',
          component: () => import('@/views/Staff/index.vue')
        },
        {
          path: '/limit',
          name: 'limit',
          component: () => import('@/views/Limit/index.vue')
        },
        {
          path: '/attendance',
          name: 'attendance',
          component: () => import('@/views/Attendance/index.vue')
        },
        {
          path: '/examine',
          name: 'examine',
          component: () => import('@/views/Examine/index.vue')
        },
        {
          path: '/salary',
          name: 'salary',
          component: () => import('@/views/Salary/index.vue')
        },
        {
          path: '/security',
          name: 'security',
          component: () => import('@/views/Security/index.vue')
        },
        {
          path: '/staff/detail/:id?',
          component: () => import('@/views/Staff/staffPage.vue')
        },
        {
          path: '/approvals/leaveApproval/:id?',
          component: () => import('@/views/Examine/components/Leave.vue')
        },
        {
          path: '/approvals/overtimeApproval/:id?',
          component: () => import('@/views/Examine/components/Overtime.vue')
        },
        {
          path: '/approvals/quitApproval/:id?',
          component: () => import('@/views/Examine/components/Quit.vue')
        },
        {
          path: '/salarys/setting',
          component: () => import('@/views/Salary/components/SetSalary.vue')
        },
        {
          path: '/salarys/report',
          component: () => import('@/views/Salary/components/SalaryDetail.vue')
        },
        {
          path: '/security/securityList',
          component: () => import('@/views/Security/components/Month.vue')
        }
      ]
    },
    {
      path: '/login',
      component: Login
    },
    {
      // 404处理
      path: '/:pathMatch(.*)*',
      component: () => import('@/components/404Page.vue')
    }
  ]
})

export default router
