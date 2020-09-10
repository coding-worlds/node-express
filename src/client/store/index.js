import Vue from 'vue'
import Vuex from 'vuex'
// import config from './modules/global-config'
import login from './modules/login'
import project from './modules/project'
import analyze from './modules/analyze'
Vue.use(Vuex)

const store = new Vuex.Store({
    // strict: process.env.NODE_ENV !== 'production',
    modules: {
        login,
        project,
        analyze
    },
    getters: {},
    mutations: {}
})

export default store