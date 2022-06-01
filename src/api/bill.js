import request from '@/utils/request'

export function list(param) {
  return request({
    url: '/bill/list',
    method: 'get',
    params: { ...param }
  })
}

export function toAdd() {
  return request({
    url: '/bill/toAdd',
    method: 'get'
  })
}

export function exist(billCode) {
  return request({
    url: '/bill/exist',
    method: 'get',
    params: { billCode }
  })
}

export function add(data) {
  return request({
    url: '/bill/add/' + data.currentId,
    method: 'post',
    data
  })
}

export function toUpd(id) {
  return request({
    url: '/bill/toUpd/' + id,
    method: 'get'
  })
}

export function upd(data) {
  return request({
    url: '/bill/upd/' + data.currentId,
    method: 'post',
    data
  })
}

export function toShow(id) {
  return request({
    url: '/bill/list/' + id,
    method: 'get'
  })
}

export function delBill(id) {
  return request({
    url: '/bill/del/' + id,
    method: 'get'
  })
}

export function getGoodList(id) {
  return request({
    url: '/bill/goods/' + id,
    method: 'get'
  })
}

export function delGoods(param) {
  return request({
    url: '/bill/delGoods',
    method: 'get',
    param: { ...param }
  })
}
