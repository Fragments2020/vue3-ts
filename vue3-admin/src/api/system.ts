/**
 * 系统管理相关接口（用户管理 / 角色管理）
 * 当前使用本地 mock；接后端时改成 request({ url, method, data }) 即可
 */
import {
  mockGetUserList,
  mockAddUser,
  mockUpdateUser,
  mockDeleteUser,
  mockGetRoleList,
  mockAddRole,
  mockUpdateRole,
  mockDeleteRole,
  type UserQuery,
  type SystemUser,
  type RoleItem
} from './mock'

/* ---------- 用户管理 ---------- */
export const getUserListApi = (query: UserQuery) => mockGetUserList(query)
export const addUserApi = (data: Omit<SystemUser, 'id' | 'createTime'>) => mockAddUser(data)
export const updateUserApi = (data: SystemUser) => mockUpdateUser(data)
export const deleteUserApi = (id: number) => mockDeleteUser(id)

/* ---------- 角色管理 ---------- */
export const getRoleListApi = () => mockGetRoleList()
export const addRoleApi = (data: Omit<RoleItem, 'id'>) => mockAddRole(data)
export const updateRoleApi = (data: RoleItem) => mockUpdateRole(data)
export const deleteRoleApi = (id: number) => mockDeleteRole(id)
