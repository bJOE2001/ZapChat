const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('pages/RegisterPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    component: () => import('layouts/ChatLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'inbox',
        component: () => import('pages/InboxPage.vue')
      },
      {
        path: 'c/:id',
        name: 'conversation',
        component: () => import('pages/ConversationPage.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/ProfilePage.vue')
      },
      {
        path: 'stories',
        name: 'stories',
        component: () => import('pages/StoriesPage.vue')
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: () => import('pages/NotificationsPage.vue')
      }
    ]
  },
  {
    path: '/demo',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('pages/IndexPage.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
