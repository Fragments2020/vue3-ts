<script setup lang="ts">
/**
 * 404 页面：访问不存在的路由（或无权限的路由）时显示
 */
defineOptions({ name: 'Error404' })
</script>

<template>
  <div class="error-page">
    <div class="code">404</div>
    <p class="desc">抱歉，你访问的页面不存在或没有权限</p>
    <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
  </div>
</template>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 16px;
}

.code {
  font-size: 120px;
  font-weight: 700;
  color: #409eff;
  line-height: 1;
}

.desc {
  color: #909399;
}
</style>
