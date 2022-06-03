import request from '@/utils/request'

export function list(param) {
  return request({
    url: '/good/list',
    method: 'get',
    params: { ...param }
  })
}

export function toAdd() {
  return request({
    url: '/good/toAdd',
    method: 'get'
  })
}

export function exist(goodCode) {
  return request({
    url: '/good/exist',
    method: 'get',
    params: { goodCode }
  })
}

export function add(params) {
  return request({
    url: '/good/add',
    method: 'post',
    params: { ...params }
  })
}

export function toUpd(id) {
  return request({
    url: '/good/toUpd/' + id,
    method: 'get'
  })
}

export function upd(params) {
  return request({
    url: '/good/upd',
    method: 'post',
    params: { ...params }
  })
}

export function toShow(id) {
  return request({
    url: '/good/list/' + id,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/good/del/' + id,
    method: 'get'
  })
}
