import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import router from '../router'
import { Notice } from 'iview'
import { read, clearMulti } from '../storage/index'
import {
  STORE_KEY_USERNAME,
  STORE_KEY_ACCESS_TOKEN,
  STORE_KEY_REALNAME,
  STORE_KEY_ID,
  STORE_KEY_SESSION,
  STORE_KEY_ORGID
} from '../storage/constants'
// Vue.http.options.emulateJSON = true
// Vue.http.options.root = '/api'

const requestMap = {}

// response interceptor
axios.interceptors.request.use(request => {
  let key
  // abort the same post request
  if (/POST|PUT|DELETE/.test(request.method)) {
    key = `${request.method}${request.url}${JSON.stringify(request.body)}`
    // abort the existed request
    if (key && requestMap[key]) {
      key = null
      setTimeout(() => {
        request.abort()
      })
    } else {
      requestMap[key] = request
    }
  }

  // if (store.getters.loggedIn) {
  // if logged in, add the token to the header
  request.headers.common.Authorization = `Bearer ${store.getters.accessToken}`
  // }
  return request
})

axios.interceptors.response.use(response => {
  // delete current request in the map
  const request = response.request
  let key
  if (/POST|PUT|DELETE/.test(request.method)) {
    key = `${request.method}${request.url}${JSON.stringify(request.body)}`
    delete requestMap[key]
  }
  // don't handler for login page
  if (store.state.route.path === '/skip') {
    return response
  }
  // other errors
  if (!response.ok) {
    // Notice.error({
    //   title: Vue.t('http.error.others'),
    //   desc: response.data
    // })
  }
  return response
}, (err) => {
  if (err.response.status === 307) {
    if (read('user.username') === 'admin') {
      clearMulti([STORE_KEY_USERNAME,
        STORE_KEY_ACCESS_TOKEN,
        STORE_KEY_REALNAME,
        STORE_KEY_ID,
        STORE_KEY_SESSION,
        STORE_KEY_ORGID])
      window.location.reload()
    } else {
      window.location.href = err.response.data + '/#/login'
    }
  }
  if (err.response.status === 401) {
    Notice.error({
      title: Vue.t('http.error.E401')
    })
    store.dispatch('logout').then(() => {
      const location = window.location
      const path = store.state.route.fullpath || (location.pathname + location.search)
      router.push({
        path: '/skip',
        query: { redirect: path }
      })
    })
    return err.response
  }
  if (err.response.status === 403) {
    Notice.error({
      title: Vue.t('http.error.E403')
    })
    return err.response
  }
  if (err.response.status === 404) {
    // Notice.error({
    //   // title: Vue.t('http.error.E404')
    // })
    return err.response
  }
  if (err.response.status === 500) {
    // Notice.error({
    //   title: Vue.t('http.error.E500')
    // })
    return err.response
  }
})
