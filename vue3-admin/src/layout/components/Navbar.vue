<script setup lang="ts">
/**
 * 顶部导航栏：折叠按钮 + 面包屑 + 全屏 + 用户菜单
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import Breadcrumb from './Breadcrumb.vue'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

/* ---------- 全屏切换 ---------- */
const isFullscreen = ref(false)
function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
    isFullscreen.value = false
  } else {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  }
}

/* ---------- 用户下拉菜单 ---------- */
function handleCommand(command: string) {
  if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'logout') {
    logout()
  }
}

async function logout() {
  await ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' })
  userStore.logout()
  router.push('/login')
  // 刷新页面重置动态注册的路由，避免上一个账号的权限路由残留
  location.reload()
}
</script>

<template>
  <div class="navbar">
    <!-- 左侧：折叠按钮 + 面包屑 -->
    <div class="navbar-left">
      <el-icon class="fold-btn" @click="appStore.toggleSidebar()">
        <Expand v-if="appStore.collapsed" />
        <Fold v-else />
      </el-icon>
      <Breadcrumb />
    </div>

    <!-- 右侧：全屏 + 用户信息 -->
    <div class="navbar-right">
      <el-tooltip content="全屏" placement="bottom">
        <el-icon class="action-icon" @click="toggleFullscreen">
          <Aim v-if="isFullscreen" />
          <FullScreen v-else />
        </el-icon>
      </el-tooltip>

      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="28" class="avatar">{{ userStore.name.charAt(0) }}</el-avatar>
          <span class="username">{{ userStore.name }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 0 16px;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.fold-btn {
  font-size: 20px;
  cursor: pointer;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.action-icon {
  font-size: 18px;
  cursor: pointer;
  color: #606266;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  outline: none;
}

.avatar {
  background-color: var(--sidebar-active);
}

.username {
  font-size: 14px;
}
</style>
