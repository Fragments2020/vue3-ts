<script setup lang="ts">
/**
 * 整体布局：左侧菜单 + 右侧（顶栏 + 页签栏 + 内容区）
 */
import { useAppStore } from '@/store/modules/app'
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'
import TagsView from './components/TagsView.vue'
import AppMain from './components/AppMain.vue'

const appStore = useAppStore()
</script>

<template>
  <div class="layout">
    <!-- 侧边栏：宽度随折叠状态变化 -->
    <aside
      class="sidebar"
      :style="{ width: appStore.collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }"
    >
      <Sidebar />
    </aside>

    <div class="main-wrapper">
      <header class="header">
        <Navbar />
        <TagsView />
      </header>
      <AppMain />
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100%;
}

.sidebar {
  flex-shrink: 0;
  height: 100%;
  background-color: var(--sidebar-bg);
  transition: width 0.28s; /* 折叠动画 */
  overflow-x: hidden;
}

.main-wrapper {
  flex: 1;
  min-width: 0; /* 防止表格等内容把布局撑破 */
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  flex-shrink: 0;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 9;
}
</style>
