import { login, getInfo, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    id: '',
    avatar: '',
    role: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    if (result.code === 20000) {
      commit('SET_TOKEN', result.datas.token)
      setToken(result.datas.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // get user info
  async getInfo({ commit, state }) {
    const result = await getInfo(state.token)
    if (result.code === 20000) {
      const { datas } = result
      if (!datas) {
        return Promise.reject(new Error('验证失败，请重新登录'))
      } else {
        const { user } = datas
        const avatar = 'https://storage.googleapis.com/wcorp_public/waifulab/preview/0f3f1ce56b69ffccf0c80fd8f60225851651819750.png'
        commit('SET_NAME', user.userCode)
        commit('SET_AVATAR', avatar)
        commit('SET_ID', user.id)
        commit('SET_ROLE', user.userRole)
      }
      return datas
    }
  },

  // user logout
  async logout({ commit, state }) {
    const result = await logout()
    if (result.code === 20000) {
      removeToken()
      resetRouter()
      commit('RESET_STATE')
    }
    // return new Promise((resolve, reject) => {
    //   logout(state.token)
    //     .then(() => {
    //       removeToken() // must remove  token  first
    //       resetRouter()
    //       commit('RESET_STATE')
    //       resolve()
    //     })
    //     .catch((error) => {
    //       reject(error)
    //     })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
