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

export function toUpd(id) {
  return request({
    url: '/user/toUpd/' + id,
    method: 'get'
  })
}

export function upd(params) {
  return request({
    url: '/user/upd',
    method: 'post',
    params: { ...params }
  })
}

export function toShow(id) {
  return request({
    url: '/user/list/' + id,
    method: 'get'
  })
}

export function delUser(id) {
  return request({
    url: '/user/delUser/' + id,
    method: 'get'
  })
}

export function getProfile(id) {
  return request({
    url: '/user/profile/' + id,
    method: 'get'
  })
}

export function judge(userId, oldPassword) {
  return request({
    url: '/user/profile/judge',
    method: 'post',
    data: { oldPassword, userId }
  })
}

export function updPasswd(userId, newPassword) {
  return request({
    url: '/user/profile/updatePasswd',
    method: 'post',
    data: { newPassword, userId }
  })
}
