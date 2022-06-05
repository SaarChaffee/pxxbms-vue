import request from '@/utils/request'

export function list() {
  return request({
    url: '/goodtype/list',
    method: 'get'
  })
}

export function exist(typeCode) {
  return request({
    url: '/goodtype/exist',
    method: 'get',
    params: { typeCode }
  })
}

export function add(data) {
  return request({
    url: '/goodtype/add',
    method: 'post',
    params: { ...data }
  })
}

export function toUpd(id) {
  return request({
    url: '/goodtype/toUpd/' + id,
    method: 'get'
  })
}

export function upd(data) {
  return request({
    url: '/goodtype/upd',
    method: 'post',
    params: { ...data }
  })
}

export function toShow(id) {
  return request({
    url: '/goodtype/list/' + id,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/goodtype/del/' + id,
    method: 'get'
  })
}
