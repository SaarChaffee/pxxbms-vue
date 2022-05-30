import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/login',
    method: 'post',
    params
  })
}

export function getInfo(token) {
  return request({
    url: '/user/login',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function list(param) {
  return request({
    url: '/user/list',
    method: 'get',
    params: { ...param }
  })
}

export function toAdd() {
  return request({
    url: '/user/toAdd',
    method: 'get'
  })
}

export function exist(userCode) {
  return request({
    url: '/user/exist',
    method: 'get',
    params: { userCode }
  })
}

export function add(params) {
  return request({
    url: '/user/add',
    method: 'post',
    params: { ...params }
  })
}
