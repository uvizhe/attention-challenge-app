import { authenticated } from '../js/database'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: 'help',
        component: () => import('pages/Help.vue'),
        meta: { pageHeader: 'Help' }
      },
      {
        path: 'settings',
        component: () => import('pages/Settings.vue'),
        meta: { pageHeader: 'Settings' }
      },
      {
        path: 'addusers',
        component: () => import('pages/AddUsers.vue'),
        meta: { pageHeader: 'Add users to the chart' }
      }
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
