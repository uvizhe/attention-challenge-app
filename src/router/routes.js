import { authenticated } from '../js/remotedb'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: 'about',
        component: () => import('pages/About.vue'),
        meta: { pageHeader: 'pageHeaderAbout' }
      },
      {
        path: 'settings',
        component: () => import('pages/Settings.vue'),
        meta: { pageHeader: 'pageHeaderSettings' }
      },
      {
        path: 'addusers',
        component: () => import('pages/AddUsers.vue'),
        meta: { pageHeader: 'pageHeaderAddUsers' }
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
    component: () => import('pages/Signup.vue'),
    beforeEnter: async (to, from, next) => {
      // This guard prevents user from accessing signup page after signup
      if (await authenticated()) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue'),
    beforeEnter: async (to, from, next) => {
      // This guard prevents user from accessing login page after login
      if (await authenticated()) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/recover',
    component: () => import('pages/Recover.vue')
  },
  {
    path: '/recover-info',
    component: () => import('pages/RecoverInfo.vue')
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
