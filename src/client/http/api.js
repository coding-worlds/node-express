import Vue from 'vue'
import _ from 'lodash'
export const get = (url, query, headers) => {
  return Vue.http.get(url, query, headers, {timeout: 2500}).then((resp) => {
    if (resp.status !== 200) {
      return Promise.reject(resp)
    }
    if (_.isString(resp.body)) {
      try {
        resp.body = JSON.parse(resp.body)
      } catch (err) {
        console.log('rpcCall exception')
        console.log(err)
        resp.body = err
        resp.body.result = { errno: -1 }
      }
    }
    return resp
  })
}
export const post = (url, body, config) => {
  return Vue.http.post(url, body, {config, timeout: 2500}).then((resp) => {
    if (resp.status !== 200 && resp.status !== 201) {
      return Promise.reject(resp)
    }
    if (_.isString(resp.body)) {
      try {
        resp.body = JSON.parse(resp.body)
      } catch (err) {
        console.log('rpcCall exception')
        console.log(err)
        resp.body = err
        resp.body.result = { errno: -1 }
      }
    }
    return resp
  })
}
export const remove = (url) => {
  return Vue.http.delete(url, {timeout: 2500}).then((resp) => {
    if (resp.status !== 200) {
      return Promise.reject(resp)
    }
    if (_.isString(resp.body)) {
      try {
        resp.body = JSON.parse(resp.body)
      } catch (err) {
        console.log('rpcCall exception')
        console.log(err)
        resp.body = err
        resp.body.result = { errno: -1 }
      }
    }
    return resp
  })
}
export const put = (url, body) => {
  return Vue.http.put(url, body, {timeout: 2500}).then((resp) => {
    if (resp.status !== 200) {
      return Promise.reject(resp)
    }
    if (_.isString(resp.body)) {
      try {
        resp.body = JSON.parse(resp.body)
      } catch (err) {
        console.log('rpcCall exception')
        console.log(err)
        resp.body = err
        resp.body.result = { errno: -1 }
      }
    }
    return resp
  })
}
