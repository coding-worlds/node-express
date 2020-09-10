import { get, post, put, remove } from './api'

export const downloadFile = () => {
  const url = '/file/downloadFile'
  const query = {}
  return get(url, query)
}
export const fileDetail = () => {
  const url = '/file/fileDetail'
  const query = {
  }
  return get(url, query)
}
// 创建项目
export const createProjectApi = (obj) => {
  const url = '/project/create'
  const body = {
    title: obj.title,
    description: obj.description
  }
  return post(url, body)
}
// 获取项目列表
export const getProjectListApi = () => {
  const url = '/project/list'
  const query = {
  }
  return get(url, query)
}
// 获取单个项目信息
export const getProjectApi = (id) => {
  const url = '/project/' + id
  const query = {
  }
  return get(url, query)
}
// 修改项目信息
export const updateProjectApi = (obj) => {
  const url = '/project/' + obj.pid
  const body = {
    title: obj.title,
    description: obj.description
  }
  return put(url, body)
}
// 删除项目
export const deleteProjectApi = (id) => {
  const url = '/project/' + id
  const body = {
  }
  return remove(url, body)
}
// 上传项目
export const uploadProjectApi = (fromData, pid) => {
  const url = '/file/upload/' + pid
  const body = fromData
  return post(url, body)
}
