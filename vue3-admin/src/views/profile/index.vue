<script setup lang="ts">
/**
 * 个人中心：展示当前登录用户信息（数据来自 user store）
 */
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'Profile' })

const userStore = useUserStore()
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" style="max-width: 640px">
      <template #header>个人中心</template>
      <div class="profile-header">
        <el-avatar :size="72" class="avatar">{{ userStore.name.charAt(0) }}</el-avatar>
        <h3>{{ userStore.name }}</h3>
      </div>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="姓名">{{ userStore.name }}</el-descriptions-item>
        <el-descriptions-item label="角色">
          <el-tag v-for="role in userStore.roles" :key="role" style="margin-right: 8px">
            {{ role === 'admin' ? '超级管理员' : '编辑' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Token">{{ userStore.token }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.avatar {
  background-color: var(--sidebar-active);
  font-size: 28px;
}
</style>
