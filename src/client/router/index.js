import Vue from 'vue'
import Router from 'vue-router'

// import { read } from '../common/js/storage'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Common',
    component: (resolve) => {
      require(['../views/Common.vue'], resolve)
    },
    redirect: '/project',
    children: [{
      path: '/project',
      component: (resolve) => {
        require(['../views/project/Project.vue'], resolve)
      }
    }, {
      path: '/analyze',
      component: (resolve) => {
        require(['../views/analyze/Analyze.vue'], resolve)
      }
    }, {
      path: '/settings',
      component: (resolve) => {
        require(['../views/settings/Settings.vue'], resolve)
      }
    }]
  },
  {
    path: '/login',
    name: 'Login',
    component: (resolve) => {
      require(['../views/auth/Login.vue'], resolve)
    }
  }
]
var router = new Router({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  return next()
  // const username = read('username')
  // if (!username) {
  //   if (to.name === 'Login') return next()
  //   return next('/login')
  // } else {
  //   if (to.name === 'Login') return next(false)
  //   return next()
  // }
})

export default router
