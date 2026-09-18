/**
 * 路由守卫：登录鉴权 + 动态路由注册（权限控制的核心）
 *
 * 整体流程：
 * 未登录 → 访问任意页面 → 跳转登录页
 * 已登录 → 首次进入 → 拉取用户角色 → 按角色过滤出可访问路由 → addRoute 注册 → 放行
 */
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './index'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false }) // 顶部进度条不显示转圈

/** 免登录白名单 */
const whiteList = ['/login', '/404']

router.beforeEach(async (to) => {
  NProgress.start()
  document.title = to.meta.title ? `${to.meta.title} - Vue3 后台管理` : 'Vue3 后台管理'

  const hasToken = !!getToken()

  // —— 未登录：只放行白名单，其余跳登录页并记录目标地址 ——
  if (!hasToken) {
    if (whiteList.includes(to.path)) return true
    return `/login?redirect=${encodeURIComponent(to.fullPath)}`
  }

  // —— 已登录还访问登录页：直接回首页 ——
  if (to.path === '/login') return '/'

  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  // —— 已有角色信息（非刷新场景）：直接放行 ——
  if (userStore.roles.length > 0) return true

  // —— 刷新后角色丢失：重新拉取用户信息并动态注册路由 ——
  try {
    const { roles } = await userStore.getInfo()
    const accessRoutes = permissionStore.generateRoutes(roles)
    accessRoutes.forEach((route) => router.addRoute(route))
    // 用 replace + 完整地址重新触发一次导航，确保刚注册的路由能被匹配到
    return { ...to, replace: true }
  } catch {
    // token 失效等异常：清空后回登录页
    userStore.logout()
    return `/login?redirect=${encodeURIComponent(to.fullPath)}`
  }
})

router.afterEach(() => {
  NProgress.done()
})
