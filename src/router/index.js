import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    meta: { title: '用户管理', icon: 'el-icon-user' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/users/list/index'),
        meta: { title: '列表', icon: 'el-icon-notebook-2' }
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/users/add/index'),
        meta: { title: '添加', icon: 'el-icon-plus' }
      },
      {
        path: 'show/:id',
        name: 'show',
        hidden: true,
        component: () => import('@/views/users/show/index'),
        meta: { title: '详情', icon: 'el-icon-tickets' }
      },
      {
        path: 'alter/:id',
        name: 'alter',
        hidden: true,
        component: () => import('@/views/users/alter/index'),
        meta: { title: '修改', icon: 'el-icon-setting' }
      }
    ]
  },
  {
    path: '/bill',
    component: Layout,
    redirect: '/bill/list',
    meta: { title: '订单管理', icon: 'el-icon-user' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/bills/list/index'),
        meta: { title: '列表', icon: 'el-icon-notebook-2' }
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/bills/add/index'),
        meta: { title: '添加', icon: 'el-icon-plus' }
      },
      {
        path: 'show',
        hidden: true,
        name: 'show',
        component: () => import('@/views/bills/show/index'),
        meta: { title: '详情', icon: 'el-icon-tickets' }
      },
      {
        path: 'alter',
        hidden: true,
        name: 'alter',
        component: () => import('@/views/bills/alter/index'),
        meta: { title: '修改', icon: 'el-icon-setting' }
      }
    ]
  },
  {
    path: '/good',
    component: Layout,
    redirect: '/good/list',
    meta: { title: '商品管理', icon: 'el-icon-user' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/goods/list/index'),
        meta: { title: '列表', icon: 'el-icon-notebook-2' }
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/goods/add/index'),
        meta: { title: '添加', icon: 'el-icon-plus' }
      },
      {
        path: 'show',
        hidden: true,
        name: 'show',
        component: () => import('@/views/goods/show/index'),
        meta: { title: '详情', icon: 'el-icon-tickets' }
      },
      {
        path: 'alter',
        hidden: true,
        name: 'alter',
        component: () => import('@/views/goods/alter/index'),
        meta: { title: '修改', icon: 'el-icon-setting' }
      },
      {
        path: 'type',
        redirect: '/good/type/list',
        component: () => import('@/views/goods/types/index'),
        meta: { title: '商品类型管理', icon: 'el-icon-user' },
        children: [
          {
            path: 'list',
            name: 'list',
            component: () => import('@/views/goods/types/list'),
            meta: { title: '列表', icon: 'el-icon-notebook-2' }
          },
          {
            path: 'add',
            name: 'add',
            component: () => import('@/views/goods/types/add'),
            meta: { title: '添加', icon: 'el-icon-plus' }
          },
          {
            path: 'show',
            hidden: true,
            name: 'show',
            component: () => import('@/views/goods/types/show'),
            meta: { title: '详情', icon: 'el-icon-tickets' }
          },
          {
            path: 'alter',
            hidden: true,
            name: 'alter',
            component: () => import('@/views/goods/types/alter'),
            meta: { title: '修改', icon: 'el-icon-setting' }
          }
        ]
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
