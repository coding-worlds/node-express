import {get, post, put, remove } from './api'

// 获取项目列表
export const getAnalyzeApi = (obj) => {
    const url = '/analyze/analyze'
    const body = obj
    return post(url, body)
}