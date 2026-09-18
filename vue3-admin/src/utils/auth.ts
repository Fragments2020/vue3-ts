/**
 * Token 存取工具
 * 统一封装 localStorage 操作，方便以后替换成 cookie 等方案
 */
const TOKEN_KEY = 'vue3_admin_token'

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
