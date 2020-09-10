// import { assign } from 'lodash'
import {
    merge
} from 'lodash'
import { createProjectApi, getProjectListApi, updateProjectApi, deleteProjectApi } from '../../http/project.api.js'

const state = {
        projectList: [],
        selectProject: {},
        selectPID: ''
    }
    // let userInitPromise = null

const mutations = {
    SET_PROJECT_LIST(state, payload) {
        state.projectList = payload
    },
    SET_SELECT_PROJECT(state, payload) {
        state.selectProject = payload
        state.selectPID = payload.pid
    },
    ADD_PROJECT(state, payload) {
        state.projectList.push(payload)
    },
    DELETE_PROJECT(state, payload) {
        state.projectList.map((item, index) => {
            if (item.pid === payload) {
                state.projectList.splice(index, 1)
                return
            }
        })
    },
    UPDATE_PROJECT(state, payload) {},
}
const actions = {
    // 创建一个新项目
    CreateProject({ commit, dispatch }, payload) {
        return new Promise((resolve, reject) => {
            createProjectApi(payload).then(suc => {
                commit('ADD_PROJECT', suc.data)
                resolve(suc.data)
            }).catch(err => {
                console.log('createProjectApi:' + err)
            })
        })
    },
    // 获取项目列表
    GetProjectList({ commit, dispatch }, payload) {
        return new Promise((resolve, reject) => {
            getProjectListApi().then(suc => {
                commit('SET_PROJECT_LIST', suc.data)
                resolve(suc.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 修改项目信息
    UpdateProject({ commit, dispatch }, payload) {
        return new Promise((resolve, reject) => {
            updateProjectApi(payload).then(suc => {
                commit('UPDATE_PROJECT', payload)
                resolve(suc.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    DeleteProject({ commit, dispatch }, payload) {
        console.log(payload)
        return new Promise((resolve, reject) => {
            deleteProjectApi(payload).then(suc => {
                commit('DELETE_PROJECT', payload)
                commit('SET_SELECT_PROJECT', '')
                resolve(suc.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
}

const getters = {}

export default {
    state,
    mutations,
    actions,
    getters
}