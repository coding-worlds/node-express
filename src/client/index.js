import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store'
import axios from 'axios'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
// import './assets/style/style.less'

Vue.use(iView)
Vue.config.debug = true
Vue.config.productionTip = false

// monment
import moment from 'moment'
Vue.prototype.$moment = Vue.moment = moment

// axios
Vue.prototype.$http = Vue.http = axios
axios.defaults.baseURL = '/api'

new Vue({
  el: '#app',
  router: router,
  store: store,
  template: '<App/>',
  components: { App }
})
