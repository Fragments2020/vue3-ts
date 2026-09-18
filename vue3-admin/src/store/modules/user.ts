/**
 * 用户状态：token、用户信息、角色
 */
import { defineStore } from 'pinia'
import { loginApi, getUserInfoApi } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import type { LoginForm, UserInfo } from '@/api/mock'

interface UserState {
  token: string
  name: string
  roles: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: getToken(), // 刷新页面时从 localStorage 恢复
    name: '',
    roles: []
  }),
  actions: {
    /** 登录：拿到 token 并持久化 */
    async login(form: LoginForm) {
      const { token } = await loginApi(form)
      this.token = token
      setToken(token)
    },
    /** 获取用户信息（含角色），路由守卫在登录后调用 */
    async getInfo(): Promise<UserInfo> {
      const info = await getUserInfoApi(this.token)
      this.name = info.name
      this.roles = info.roles
      return info
    },
    /** 退出登录：清空状态与本地 token */
    logout() {
      this.$reset()
      removeToken()
    }
  }
})
