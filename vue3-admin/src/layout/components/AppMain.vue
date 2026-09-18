<script setup lang="ts">
/**
 * 主内容区：
 * - transition 提供页面切换动画
 * - keep-alive 缓存已访问页面（include 里的组件名 = 路由 name = 页面组件 name）
 *   这样切换页签时，表单内容、表格页码等状态不会丢失
 */
import { computed } from 'vue'
import { useTagsViewStore } from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()
const cachedViews = computed(() => tagsViewStore.cachedViews)
</script>

<template>
  <main class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="$route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </main>
</template>

<style scoped>
.app-main {
  flex: 1;
  overflow-y: auto;
  background-color: var(--main-bg);
}
</style>
