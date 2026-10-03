<script setup lang="ts">
/**
 * 侧边栏：Logo + 菜单
 * 菜单数据来自 permission store（已按角色过滤），折叠状态来自 app store
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

/** 过滤掉 meta.hidden 的路由（登录页、404、个人中心等不进菜单） */
const menuRoutes = computed(() => permissionStore.routes.filter((r) => !r.meta?.hidden))
</script>

<template>
  <div class="sidebar-inner">
    <div class="logo">{{ appStore.collapsed ? 'Admin' : 'Vue3 后台管理' }}</div>
    <!--
      router 模式：菜单项的 index 就是路由路径，点击自动跳转
      default-active：根据当前路由高亮对应菜单
    -->
    <el-menu
      class="sidebar-menu"
      :default-active="route.path"
      :collapse="appStore.collapsed"
      :collapse-transition="false"
      router
      unique-opened
    >
      <SidebarItem v-for="r in menuRoutes" :key="r.path" :item="r" :base-path="r.path" />
    </el-menu>
  </div>
</template>

<style scoped>
.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.logo {
  flex-shrink: 0;
  height: var(--header-height);
  line-height: var(--header-height);
  text-align: center;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  background-color: #002140;
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
}
</style>
