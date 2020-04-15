
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'logs', component: () => import('pages/Logs.vue') }
    ]
  },
  {
    path: '/enter',
    component: () => import('pages/Entrance.vue'),
    meta: { noAuthRequired: true }
  },
  {
    path: '/signup',
    component: () => import('pages/Signup.vue'),
    meta: { noAuthRequired: true }
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue'),
    meta: { noAuthRequired: true }
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
