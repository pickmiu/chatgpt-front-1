import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { ChatLayout } from '@/views/chat/layout'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'homepage',
    component: () => import('@/views/homepage/homepage.vue'),
  },

  {
    path: '/chatbox',
    name: 'chatbox',
    component: ChatLayout,
    redirect: '/chat',
    children: [
      {
        path: '/chat/:uuid?',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },

  {
    path: '/setting',
    name: 'setting',
    component: ChatLayout,
    redirect: '/chat/1/setting',
    children: [
      {
        path: '/chat/:uuid?/:component?',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },

  {
    path: '/pay/item',
    name: 'itemBaseInfo',
    component: () => import('@/views/pay/itemBaseInfo.vue'),
  },

  {
    path: '/pay/address',
    name: 'receiveAddress',
    component: () => import('@/views/pay/receiveAddress.vue'),
  },

  {
    path: '/pay/confirm/:orderId?/:identify?',
    name: 'orderPayConfirm',
    component: () => import('@/views/pay/orderPayConfirm.vue'),
  },

  {
    path: '/pay/result/:orderId?/:identify?',
    name: 'result',
    component: () => import('@/views/pay/result.vue'),
  },

  {
    path: '/trial',
    name: 'trial',
    component: () => import('@/views/pay/trial.vue'),
  },

  {
    path: '/openInOtherBrowser',
    name: 'openInOtherBrowser',
    component: () => import('@/views/pay/openInOtherBrowser.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
