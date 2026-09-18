/**
 * 按钮级权限指令：v-permission="['admin']"
 *
 * 用法：当前用户角色不在传入列表中时，直接把该元素从页面移除。
 * <el-button v-permission="['admin']">删除</el-button>
 */
import type { Directive } from 'vue'
import { useUserStore } from '@/store/modules/user'

export const permissionDirective: Directive = (el, binding) => {
  const { roles } = useUserStore()
  const needRoles = (binding.value || []) as string[]

  // 没传值时不做限制；admin 超级管理员放行一切
  const hasPermission =
    needRoles.length === 0 || roles.includes('admin') || needRoles.some((r) => roles.includes(r))

  if (!hasPermission) {
    el.parentNode?.removeChild(el)
  }
}
