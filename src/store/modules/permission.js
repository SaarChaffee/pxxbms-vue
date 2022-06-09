// store/permission.js
import { asyncRoutes, constantRoutes } from '@/router'

function hasPermission(route, role) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.some(r => r === role)
  } else {
    return true
  }
}
// 递归过滤异步路由表，筛选角色权限路由
function filterAsyncRoutes(routes, role) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(tmp, role)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, role)
      }
      res.push(tmp)
    }
  })
  return res
}

const permission = {
  state: {
    routers: constantRoutes,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRoutes.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, role) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRoutes(asyncRoutes, role)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission

