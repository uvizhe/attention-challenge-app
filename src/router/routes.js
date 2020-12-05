import { authenticated, getConfig } from '../js/localdb'

const routes = [
  {
    path: '/',
    component: () => import('layouts/Blank.vue'),
    children: [
      { path: '', component: () => import('pages/Entrance.vue') },
      {
        path: '/signup',
        component: () => import('pages/Signup.vue')
      },
      {
        path: '/login',
        component: () => import('pages/Login.vue')
      },
      {
        path: '/tryout',
        component: () => import('pages/Tryout.vue')
      },
      {
        path: '/recover',
        component: () => import('pages/Recover.vue')
      },
      {
        path: '/recover-info/:status',
        component: () => import('pages/RecoverInfo.vue'),
        props: true
      }
    ],
    beforeEnter: async (to, from, next) => {
      if (authenticated()) { // user has auth-token
        // authorize user on a server
        next({ path: '/waiting/auth', replace: true })
      } else if (getConfig('tryout')) { // unfinished tryout process
        // attempt to finish tryout process
        next({ path: '/waiting/tryout', replace: true })
      } else {
        next()
      }
    }
  },
  {
    path: '/waiting/:action',
    component: () => import('pages/Waiting.vue'),
    props: true
  },
  {
    path: '/app',
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
    ]
  }
]

// Always leave this as last one
routes.push({
  path: '*',
  component: () => import('pages/Waiting.vue')
})

export default routes
