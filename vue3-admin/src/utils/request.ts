/**
 * Axios 封装（真实项目中使用）
 *
 * 说明：本学习项目没有后端，所有数据来自 src/api/mock.ts 本地模拟。
 * 这个文件是真实项目的标准写法，接后端时把 api 里的 mock 调用换成 request 即可，例如：
 *
 *   export function loginApi(data: LoginForm) {
 *     return request({ url: '/user/login', method: 'post', data })
 *   }
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api', // 接口前缀，配合 vite.config.ts 中的 proxy 代理到后端
  timeout: 10000 // 超时时间
})

// 请求拦截器：每次请求自动带上 token
request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：统一处理返回结构和错误提示
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 约定后端返回格式 { code, data, message }，code 为 0 表示成功
    if (res.code !== 0) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message))
    }
    return res.data
  },
  (error) => {
    // 401 表示登录过期，跳回登录页
    if (error.response?.status === 401) {
      localStorage.clear()
      location.href = '/login'
    }
    ElMessage.error(error.message || '网络异常')
    return Promise.reject(error)
  }
)

export default request
