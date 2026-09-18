/**
 * 本地模拟数据 + 模拟接口
 * -----------------------
 * 学习项目没有真实后端，这里用内存数据 + setTimeout 模拟异步请求。
 * 接口的入参/返回结构都按照真实 RESTful 接口设计，接后端时只需把
 * api/*.ts 中的函数体换成 request() 调用，页面代码无需改动。
 */

/** 模拟网络延迟，并深拷贝数据防止页面直接改动"数据库" */
function delay<T>(data: T, ms = 200): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), ms)
  })
}

/* ==================== 登录账号库 ==================== */

export interface LoginForm {
  username: string
  password: string
}

export interface UserInfo {
  name: string
  roles: string[] // 角色标识，路由和按钮权限都靠它判断
}

/** 模拟账号表：admin 拥有全部权限，editor 是普通角色 */
const accountDB: Record<string, { password: string } & UserInfo> = {
  admin: { password: '123456', name: '超级管理员', roles: ['admin'] },
  editor: { password: '123456', name: '编辑小王', roles: ['editor'] }
}

/** 登录：校验账号密码，成功返回 token */
export function mockLogin(form: LoginForm) {
  const account = accountDB[form.username]
  if (!account || account.password !== form.password) {
    return Promise.reject(new Error('用户名或密码错误'))
  }
  // token 中带上用户名，方便后面"解析"出是谁登录的
  return delay({ token: `token-${form.username}-${Date.now()}` })
}

/** 根据 token 获取用户信息（路由守卫中调用） */
export function mockGetUserInfo(token: string) {
  const username = token.split('-')[1] // 从 token-xxx-时间戳 中取出用户名
  const account = accountDB[username]
  if (!account) {
    return Promise.reject(new Error('token 无效，请重新登录'))
  }
  const { password, ...info } = account // 密码不能返回给前端
  return delay<UserInfo>(info)
}

/* ==================== 用户管理数据 ==================== */

export interface SystemUser {
  id: number
  username: string
  nickname: string
  role: string // admin / editor / visitor
  status: 0 | 1 // 1 启用，0 禁用
  email: string
  createTime: string
}

export interface UserQuery {
  page: number
  size: number
  username?: string
  role?: string
}

const nicknames = ['张伟', '李娜', '王强', '赵敏', '陈杰', '杨柳', '周涛', '吴芳', '郑爽', '冯磊']
/** 用循环生成 20 条假数据 */
const userList: SystemUser[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  username: `user${i + 1}`,
  nickname: nicknames[i % nicknames.length],
  role: i === 0 ? 'admin' : i % 3 === 0 ? 'visitor' : 'editor',
  status: i % 5 === 4 ? 0 : 1,
  email: `user${i + 1}@example.com`,
  createTime: `2026-0${(i % 9) + 1}-1${i % 9} 10:00:00`
}))
let userIdSeed = userList.length

/** 分页查询用户列表 */
export function mockGetUserList(query: UserQuery) {
  let list = userList
  if (query.username) {
    list = list.filter((u) => u.username.includes(query.username!) || u.nickname.includes(query.username!))
  }
  if (query.role) {
    list = list.filter((u) => u.role === query.role)
  }
  const total = list.length
  const start = (query.page - 1) * query.size
  return delay({ list: list.slice(start, start + query.size), total })
}

/** 新增用户 */
export function mockAddUser(data: Omit<SystemUser, 'id' | 'createTime'>) {
  userList.unshift({ ...data, id: ++userIdSeed, createTime: new Date().toLocaleString() })
  return delay(null)
}

/** 编辑用户 */
export function mockUpdateUser(data: SystemUser) {
  const index = userList.findIndex((u) => u.id === data.id)
  if (index > -1) userList[index] = { ...data }
  return delay(null)
}

/** 删除用户 */
export function mockDeleteUser(id: number) {
  const index = userList.findIndex((u) => u.id === id)
  if (index > -1) userList.splice(index, 1)
  return delay(null)
}

/* ==================== 角色管理数据 ==================== */

export interface RoleItem {
  id: number
  name: string
  key: string // 角色标识，对应路由 meta.roles 中的值
  description: string
  permissions: string[] // 权限点标识
}

/** 系统中可分配的权限点（角色管理页勾选演示用） */
export const permissionOptions = [
  { key: 'user:add', label: '新增用户' },
  { key: 'user:edit', label: '编辑用户' },
  { key: 'user:delete', label: '删除用户' },
  { key: 'role:add', label: '新增角色' },
  { key: 'role:edit', label: '编辑角色' },
  { key: 'role:delete', label: '删除角色' }
]

const roleList: RoleItem[] = [
  { id: 1, name: '超级管理员', key: 'admin', description: '拥有系统全部权限', permissions: permissionOptions.map((p) => p.key) },
  { id: 2, name: '编辑', key: 'editor', description: '可查看和编辑内容，无系统管理权限', permissions: ['user:add', 'user:edit'] },
  { id: 3, name: '访客', key: 'visitor', description: '仅可查看', permissions: [] }
]
let roleIdSeed = roleList.length

export function mockGetRoleList() {
  return delay(roleList)
}

export function mockAddRole(data: Omit<RoleItem, 'id'>) {
  roleList.push({ ...data, id: ++roleIdSeed })
  return delay(null)
}

export function mockUpdateRole(data: RoleItem) {
  const index = roleList.findIndex((r) => r.id === data.id)
  if (index > -1) roleList[index] = { ...data }
  return delay(null)
}

export function mockDeleteRole(id: number) {
  const index = roleList.findIndex((r) => r.id === id)
  if (index > -1) roleList.splice(index, 1)
  return delay(null)
}
