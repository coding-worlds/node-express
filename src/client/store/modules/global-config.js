import Vue from 'vue'
import { lang, pageLimit } from '../../storage/stored'
import { save } from '../../storage'
import { STORE_KEY_CONFIG_LANG, STORE_KEY_CONFIG_PAGE_LIMIT } from '../../storage/constants'

const state = {
  lang: lang,
  // value see http://stackoverflow.com/questions/5580876/navigator-language-list-of-all-languages
  langs: [{
    label: '中文',
    value: 'zh-CN'
  }, {
    label: 'English',
    value: 'en'
  }],
  // tips
  tipWarningConfig: {
    show: true,
    dur: 3 // secs
  },
  tipErrorConfig: {
    show: true,
    dur: 3 // secs
  },
  tipSuccessConfig: {
    show: true,
    dur: 3 // secs
  },
  // pages
  pageLimitConfig: 10, // default rows
  pageLimitOptsConfig: [5, 10, 15, 20] // show rows selected options
}

const mutations = {
  UPDATE (state, config) {
    state.lang = config.lang || state.lang
    state.pageLimit = config.pageLimit || state.pageLimit
  },
  UPDATE_LANG (state, lang) {
    state.lang = lang || state.lang
  }
}

const actions = {
  changeLang ({ commit }, lang) {
    Vue.config.lang = lang
    commit('UPDATE_LANG', lang)
    save(STORE_KEY_CONFIG_LANG, lang)
  },
  updateGlobalConfig ({ commit, state, dispatch }, config) {
    if (config.lang !== state.lang) {
      Vue.config.lang = config.lang
      save(STORE_KEY_CONFIG_LANG, config.lang)
    }
    commit('UPDATE', config)
    save(STORE_KEY_CONFIG_LANG, state.lang)
    save(STORE_KEY_CONFIG_PAGE_LIMIT, state.pageLimit)
  }
}

const getters = {
  globalConfig (state) {
    return state
  },
  tipWarning(state) {
    return state.tipWarningConfig
  },
  tipError(state) {
    return state.tipErrorConfig
  },
  tipSuccess(state) {
    return state.tipSuccessConfig
  },
  pageLimit(state) {
    return state.pageLimitConfig
  },
  pageLimitOpts(state) {
    return state.pageLimitOptsConfig
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
