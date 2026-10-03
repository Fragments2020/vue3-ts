/**
 * 路由表
 *
 * meta 字段约定：
 * - title   : 菜单/页签/面包屑上显示的标题
 * - icon    : 菜单图标（Element Plus 图标组件名）
 * - roles   : 可访问的角色列表，不填表示所有登录用户可访问
 * - affix   : 是否固定在页签栏（不可关闭），一般用于首页
 * - hidden  : 为 true 时不在侧边栏菜单中显示（路由仍然有效）
 */
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

// 扩展 vue-router 的 RouteMeta 类型，获得 TS 提示
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    roles?: string[]
    affix?: boolean
    hidden?: boolean
  }
}

/** 无需登录/权限即可访问的路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled', affix: true }
      }
    ]
  }
]

/** 需要按角色动态挂载的路由 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'Setting', roles: ['admin'] }, // 仅 admin 可见
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'User', roles: ['admin'] }
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理', icon: 'Avatar', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/demo',
    component: Layout,
    redirect: '/demo/form',
    meta: { title: '功能示例', icon: 'Star' }, // 不写 roles，所有登录用户可见
    children: [
      {
        path: 'form',
        name: 'DemoForm',
        component: () => import('@/views/demo/form/index.vue'),
        meta: { title: '表单示例', icon: 'EditPen' }
      },
      {
        path: 'permission',
        name: 'DemoPermission',
        component: () => import('@/views/demo/permission/index.vue'),
        meta: { title: '权限演示', icon: 'Lock' }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    meta: { hidden: true }, // 个人中心从右上角头像进入，不出现在菜单
    children: [
      {
        path: '',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: { title: '个人中心' }
      }
    ]
  },
  // 404 兜底路由必须放在最后，登录后随动态路由一起注册
  { path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true } }
]

const router = createRouter({
  history: createWebHashHistory(), // hash 模式：部署简单，刷新不会 404
  routes: constantRoutes
})

export default router
