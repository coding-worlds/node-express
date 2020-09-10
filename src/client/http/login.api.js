import { post, get } from './api'

// 用户登入
export const loginUser = ({ username, password }) => {
  const url = '/login'
  const body = {
    username: username,
    password: password
  }
  return post(url, body)
}

