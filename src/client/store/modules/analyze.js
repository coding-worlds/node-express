// import { assign } from 'lodash'
import { merge } from 'lodash'
import { getAnalyzeApi } from '../../http/analyze.api.js'

const state = {
    analyzeList: {},
    stateLists: [],
    personLists: []
}

const mutations = {
    SET_ANALYZE_LIST(state, payload) {
        state.analyzeList = payload
    },
    SET_STATE_LIST(state, payload) {
        state.stateLists = payload
    },
    SET_PERSON_LIST(state, payload) {
        state.personLists = payload
    }
}
const actions = {
    // 获取数据分析列表
    getAnalyList({ commit, dispatch }, payload) {
        return new Promise((resolve, reject) => {
            getAnalyzeApi(payload).then(suc => {
                commit('SET_ANALYZE_LIST', suc.data)
                resolve(suc.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

const getters = {
    analyzeLists(state) {
        return state.analyzeList
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}