<script setup lang="ts">
/**
 * 登录页
 * 测试账号：admin / 123456（管理员，全部权限）、editor / 123456（编辑，部分权限）
 */
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

// keep-alive 按组件 name 缓存，登录页不在 Layout 内不会被缓存，写上 name 是好习惯
defineOptions({ name: 'LoginPage' })

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: '123456'
})

/** 表单校验规则 */
const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
  ]
}

async function handleLogin() {
  // 校验失败会抛异常，Element 已自动在表单项下显示错误，直接 return
  try {
    await formRef.value!.validate()
  } catch {
    return
  }
  loading.value = true
  try {
    await userStore.login(loginForm)
    ElMessage.success('登录成功')
    // 登录前想访问的页面存在 redirect 参数里，登录后跳回去
    const redirect = (route.query.redirect as string) || '/'
    router.push(decodeURIComponent(redirect))
  } catch (err: any) {
    ElMessage.error(err.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <el-card class="login-card">
      <h2 class="title">Vue3 后台管理系统</h2>
      <el-form ref="formRef" :model="loginForm" :rules="rules" size="large" @keyup.enter="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" show-password placeholder="密码">
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-button class="login-btn" type="primary" :loading="loading" @click="handleLogin">
          登 录
        </el-button>
      </el-form>

      <el-divider content-position="center">测试账号</el-divider>
      <div class="tips">
        <p>admin / 123456 —— 管理员（全部权限）</p>
        <p>editor / 123456 —— 编辑（部分权限）</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #1f2d3d 0%, #2b5876 50%, #4e4376 100%);
}

.login-card {
  width: 400px;
  border-radius: 8px;
}

.title {
  margin-bottom: 24px;
  text-align: center;
  font-size: 22px;
}

.login-btn {
  width: 100%;
}

.tips {
  font-size: 13px;
  color: #909399;
  text-align: center;
  line-height: 1.8;
}
</style>
