// import { assign } from 'lodash'
import {
  merge
} from 'lodash'
import { loginUser } from '../../http/login.api.js'
import { saveMulti } from '../../storage'
// import {
//   authSocket
// } from '../../socket'
import {
  STORE_KEY_USERNAME,
  STORE_KEY_TOKEN,
  STORE_KEY_ID
} from '../../storage/constants'

import {
  username,
  token, // eslint-disable-line
  userId
} from '../../storage/stored'
const state = {
  userId,
  username,
  token
}
// let userInitPromise = null

const mutations = {
  // 设置用户信息
  SET_USER_INFO(state, userInfo) {
    state.username = userInfo.username
    state.userId = userInfo.userId
    state.token = userInfo.token // eslint-disable-line
  },
  // after logout
  LOGOUT(state) {
    state.username = ''
    state.token = '' // eslint-disable-line
    state.userId = ''
  }
}
const actions = {
  // action - 登陆功能
  Login({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      const userInfo = {
        username: payload.username,
        password: payload.password
      }
      var loginFunc = loginUser
      loginFunc(userInfo).then(resp => {
        const data = resp.data
        console.log(resp)
        if (resp.status === 200) {
          console.log(merge)
          const userInfo = merge({}, {
            token: data.token, // eslint-disable-line
            userId: data._id,
            username: data.username
          })
          console.log('userInfo', userInfo)
          saveMulti([{
            key: STORE_KEY_USERNAME,
            value: userInfo.username
          }, {
            key: STORE_KEY_TOKEN,
            value: userInfo.token // eslint-disable-line
          }, {
            key: STORE_KEY_ID,
            value: userInfo.userId
          }])
          commit('SET_USER_INFO', userInfo)
        }
        resolve(data)
      }).catch(err => {
        reject(err)
        if (err.status === 403) {
          dispatch('logout', {
            id: err.data.logout.id,
            sessionid: err.data.logout.sessionid
          })
        }
      })
    })
  }
}

const getters = {
  userId(state) {
    return state.userId
  },
  token(state) {
    return state.token // eslint-disable-line
  },
  username(state) {
    return state.username
  },
  loggedIn(state) {
    return !!(state.username && state.token)
  },
  session(state) {
    return state.session
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}

