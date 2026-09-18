<script setup lang="ts">
/**
 * 权限演示页：展示本项目的两级权限控制
 * 1. 页面级：路由 meta.roles + 路由守卫动态注册（editor 看不到"系统管理"菜单）
 * 2. 按钮级：v-permission 指令，无权限直接移除 DOM
 */
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'DemoPermission' })

const router = useRouter()
const userStore = useUserStore()

/** 退出当前账号，去登录页换另一个角色体验 */
async function switchAccount() {
  userStore.logout()
  router.push('/login')
  location.reload()
}
</script>

<template>
  <div class="app-container">
    <el-card shadow="never">
      <template #header>权限演示</template>

      <el-alert type="info" :closable="false" style="margin-bottom: 16px">
        <p>当前账号角色：<el-tag v-for="r in userStore.roles" :key="r" style="margin: 0 4px">{{ r }}</el-tag></p>
        <p style="margin-top: 8px">
          试试退出后用另一个账号登录（admin / editor），观察侧边栏菜单和下方按钮的变化。
        </p>
      </el-alert>

      <h4>一、页面级权限（路由控制）</h4>
      <p class="desc">
        「系统管理」菜单的路由配置了 meta.roles: ['admin']，editor 角色登录后不会注册这些路由，
        菜单不显示，直接输入网址也会进入 404。
      </p>

      <h4>二、按钮级权限（v-permission 指令）</h4>
      <p class="desc">下面三个按钮分别限制了可见角色，无权限的按钮会被直接从页面移除：</p>
      <div class="btn-group">
        <el-button v-permission="['admin']" type="danger">仅 admin 可见</el-button>
        <el-button v-permission="['editor']" type="warning">仅 editor 可见</el-button>
        <el-button v-permission="['admin', 'editor']" type="primary">admin 和 editor 都可见</el-button>
      </div>

      <el-divider />
      <el-button @click="switchAccount">退出并切换账号</el-button>
    </el-card>
  </div>
</template>

<style scoped>
h4 {
  margin: 16px 0 8px;
}

.desc {
  color: #606266;
  line-height: 1.8;
  margin-bottom: 12px;
}

.btn-group {
  margin-bottom: 8px;
}
</style>
