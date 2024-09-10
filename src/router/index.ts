import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router'

import { useAuthStore } from '../stores/authStore'
import middlewarePipeline from './middlewarePipeline'
import Dashboard2 from '../layouts/v2/Dashboard.vue'
import requireAuth from './middleware/requireAuth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: { name: 'realtime' },
  },
  {
    path: '/v2/auth/login',
    name: 'login',
    component: () => import('../pages/v2/auth/Login.vue'),
  },
  {
    path: '/v2/otp',
    name: 'otp',
    component: () => import('../pages/v2/auth/OTP.vue'),
  },
  {
    path: '/report/:startDate/:endDate/',
    component: () => import('../components/v2/dialog/ReportPrint.vue'),
  },
  {
    path: '/search/traffic/:id/:date/:printMode?',
    component: () => import('../components/v2/dialog/ModalPopup.vue'),
  },
  {
    path: '/search/license-plate/:plate',
    component: () => import('../components/v2/HistoryModalPopup.vue'),
  },
  {
    path: '/traffic-report/:id/:date',
    component: () => import('../components/v2/report/PrintReport.vue'),
  },
  {
    name: 'v2',
    path: '/v2/dashboard',
    component: Dashboard2,
    children: [
      {
        name: 'realtime',
        path: 'realtime',
        component: () => import('../pages/v2/admin/Realtime.vue'),
        meta: {
          middleware: [requireAuth],
        },
      },
      {
        name: 'image-detected',
        path: 'image-detected',
        component: () => import('../pages/v2/admin/ImageDetected.vue'),
        meta: {
          middleware: [requireAuth],
        },
      },
      {
        name: 'dashboard',
        path: 'dashboard-v2',
        component: () => import('../pages/v2/admin/DashboardOfImageService.vue'),
        meta: {
          middleware: [requireAuth],
        },
      },
      {
        name: 'image-processing-dashboard',
        path: 'image-processing-dashboard',
        component: () => import('../pages/v2/admin/ImageProcessingDashboard.vue'),
        meta: {
          middleware: [requireAuth],
        },
      },
      {
        name: 'search',
        path: 'search',
        component: () => import('../pages/v2/admin/Search.vue'),
        meta: {
          middleware: [requireAuth],
        },
      },
      {
        name: 'report',
        path: 'report',
        component: () => import('../pages/v2/admin/Report.vue'),
        meta: {
          middleware: [requireAuth],
        },
      },
      {
        name: 'service-status',
        path: 'service-status',
        component: () => import('../pages/v2/admin/ServiceStatus.vue'),
        meta: {
          middleware: [requireAuth],
        },
      },
      {
        name: 'station-setup',
        path: 'station-setup',
        component: () => import('../pages/v2/admin/StationSetup.vue'),
        meta: {
          middleware: [requireAuth],
        },
      },
      {
        name: 'data-detail',
        path: '/data-detail/:id/:date/:printMode?',
        component: () => import('../pages/v2/admin/DataDetail.vue'),
        meta: {
          middleware: [requireAuth],
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  //  mode: process.env.VUE_APP_ROUTER_MODE_HISTORY === 'true' ? 'history' : 'hash',
  routes,
})

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore()

  if (!to.meta.middleware) {
    return next()
  }
  const middleware = to.meta.middleware as any

  const context = {
    to,
    from,
    next,
    authStore,
  }

  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
  })
})

export default router
