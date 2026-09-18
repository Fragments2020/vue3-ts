/**
 * 用户相关接口（登录 / 获取用户信息）
 * 当前使用本地 mock；接后端时改成 request({ url, method, data }) 即可
 */
import { mockLogin, mockGetUserInfo, type LoginForm } from './mock'

export function loginApi(data: LoginForm) {
  return mockLogin(data)
  // 真实项目写法：
  // return request({ url: '/user/login', method: 'post', data })
}

export function getUserInfoApi(token: string) {
  return mockGetUserInfo(token)
  // 真实项目写法（token 通过请求拦截器自动携带）：
  // return request({ url: '/user/info', method: 'get' })
}
