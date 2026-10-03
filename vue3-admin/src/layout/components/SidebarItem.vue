<script setup lang="ts">
/**
 * 递归菜单项（支持两级菜单）：
 * - 只有一个可见子路由 → 父级不显示为目录，直接渲染该子路由为菜单项（如"首页"）
 * - 有多个可见子路由 → 渲染为可展开/收起的子菜单（如"系统管理"）
 * - 没有子路由 → 渲染为普通菜单项（递归时的叶子节点）
 */
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const props = defineProps<{
  item: RouteRecordRaw
  basePath: string // 父级传下来的路径前缀
}>()

/** 过滤出需要在菜单中显示的子路由 */
const visibleChildren = computed(() => (props.item.children || []).filter((c) => !c.meta?.hidden))

/** 唯一的可见子路由（用于"只有一个孩子就不显示父级目录"的场景） */
const onlyChild = computed<RouteRecordRaw | null>(() =>
  visibleChildren.value.length === 1 ? visibleChildren.value[0] : null
)

/** 把相对路径拼接成完整路径，如 base='/system' + 'user' → '/system/user' */
function resolvePath(routePath: string): string {
  if (!routePath) return props.basePath
  if (routePath.startsWith('/')) return routePath
  return (props.basePath === '/' ? '' : props.basePath) + '/' + routePath
}
</script>

<template>
  <!-- 情况一：只有一个可见子路由，直接渲染成菜单项 -->
  <el-menu-item v-if="onlyChild" :index="resolvePath(onlyChild.path)">
    <el-icon v-if="onlyChild.meta?.icon"><component :is="onlyChild.meta.icon" /></el-icon>
    <template #title>{{ onlyChild.meta?.title }}</template>
  </el-menu-item>

  <!-- 情况二：多个可见子路由，渲染成子菜单并递归 -->
  <el-sub-menu v-else-if="visibleChildren.length > 0" :index="resolvePath(item.path)">
    <template #title>
      <el-icon v-if="item.meta?.icon"><component :is="item.meta.icon" /></el-icon>
      <span>{{ item.meta?.title }}</span>
    </template>
    <SidebarItem
      v-for="child in visibleChildren"
      :key="child.path"
      :item="child"
      :base-path="resolvePath(item.path)"
    />
  </el-sub-menu>

  <!-- 情况三：没有子路由（叶子节点），渲染成普通菜单项 -->
  <el-menu-item v-else :index="resolvePath(item.path)">
    <el-icon v-if="item.meta?.icon"><component :is="item.meta.icon" /></el-icon>
    <template #title>{{ item.meta?.title }}</template>
  </el-menu-item>
</template>
