import { authenticated } from '../js/database'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'addusers', component: () => import('pages/AddUsers.vue') },
      { path: 'settings', component: () => import('pages/Settings.vue') },
      { path: 'logs', component: () => import('pages/Logs.vue') }
    ],
    beforeEnter: async (to, from, next) => {
      if (!await authenticated()) {
        next('/enter')
      } else {
        next()
      }
    }
  },
  {
    path: '/enter',
    component: () => import('pages/Entrance.vue')
  },
  {
    path: '/signup',
    component: () => import('pages/Signup.vue')
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue')
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
