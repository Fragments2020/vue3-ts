/**
 * 权限状态：根据用户角色动态生成可访问路由
 *
 * 核心思路：
 * 1. constantRoutes  —— 不需要权限的路由（登录页、首页等），一开始就注册
 * 2. asyncRoutes     —— 需要权限的路由，登录获取角色后过滤，再 addRoute 动态注册
 */
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes, asyncRoutes } from '@/router'

/** 判断当前角色是否有权访问该路由（路由 meta 上没写 roles 表示所有人可访问） */
function hasPermission(roles: string[], route: RouteRecordRaw): boolean {
  const needRoles = route.meta?.roles as string[] | undefined
  if (!needRoles || needRoles.length === 0) return true
  return roles.some((role) => needRoles.includes(role))
}

/** 递归过滤路由表，返回当前角色可见的路由 */
export function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tmp = { ...route }
    // 先递归过滤子路由
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children, roles)
    }
    // 父级本身有权限 且（没有子路由 或 过滤后仍有子路由）才保留
    // —— 避免出现"点开是空的"菜单目录
    if (hasPermission(roles, tmp) && (!route.children || tmp.children!.length > 0)) {
      result.push(tmp)
    }
  })
  return result
}

interface PermissionState {
  routes: RouteRecordRaw[] // 完整可访问路由（侧边栏菜单渲染用）
  addRoutes: RouteRecordRaw[] // 动态添加的路由
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [],
    addRoutes: []
  }),
  actions: {
    /** 根据角色生成路由表，返回需要动态注册的部分 */
    generateRoutes(roles: string[]): RouteRecordRaw[] {
      // admin 拥有全部权限，直接放行；其他角色按 roles 过滤
      const accessedRoutes = roles.includes('admin')
        ? asyncRoutes
        : filterAsyncRoutes(asyncRoutes, roles)
      this.addRoutes = accessedRoutes
      this.routes = constantRoutes.concat(accessedRoutes)
      return accessedRoutes
    }
  }
})
