<script setup lang="ts">
/**
 * 面包屑：根据当前路由的 matched 数组自动生成
 * 例如 /system/user → 系统管理 / 用户管理
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

/** route.matched 包含从父到子的所有匹配路由，过滤出有标题的 */
const breadcrumbs = computed(() => route.matched.filter((item) => item.meta?.title))
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
      <!-- 最后一级是当前页，不可点击 -->
      <span v-if="index === breadcrumbs.length - 1" class="current">{{ item.meta.title }}</span>
      <router-link v-else :to="item.path">{{ item.meta.title }}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
.current {
  color: #303133;
  font-weight: 600;
}
</style>
