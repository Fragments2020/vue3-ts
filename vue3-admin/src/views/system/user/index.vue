<script setup lang="ts">
/**
 * 用户管理：搜索 + 表格 + 分页 + 新增/编辑/删除（标准 CRUD 页面模板）
 * 操作列按钮使用 v-permission 做按钮级权限控制
 */
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  getUserListApi,
  addUserApi,
  updateUserApi,
  deleteUserApi
} from '@/api/system'
import type { SystemUser } from '@/api/mock'

defineOptions({ name: 'SystemUser' }) // 与路由 name 一致，供 keep-alive 缓存

/* ==================== 搜索与列表 ==================== */
const query = reactive({
  page: 1,
  size: 10,
  username: '',
  role: ''
})

const tableData = ref<SystemUser[]>([])
const total = ref(0)
const loading = ref(false)

async function getList() {
  loading.value = true
  try {
    const { list, total: t } = await getUserListApi(query)
    tableData.value = list
    total.value = t
  } finally {
    loading.value = false
  }
}

/** 查询：回到第一页再拉数据 */
function handleSearch() {
  query.page = 1
  getList()
}

function handleReset() {
  query.username = ''
  query.role = ''
  handleSearch()
}

/* ==================== 新增 / 编辑弹窗 ==================== */
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()

/** 表单数据：id 为 0 表示新增 */
const form = reactive({
  id: 0,
  username: '',
  nickname: '',
  role: 'editor',
  status: 1 as 0 | 1,
  email: ''
})

const formRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

function openDialog(row?: SystemUser) {
  if (row) {
    dialogTitle.value = '编辑用户'
    Object.assign(form, row) // 回显数据
  } else {
    dialogTitle.value = '新增用户'
    Object.assign(form, { id: 0, username: '', nickname: '', role: 'editor', status: 1, email: '' })
  }
  dialogVisible.value = true
}

async function handleSubmit() {
  try {
    await formRef.value!.validate()
  } catch {
    return // 校验失败，Element 会自动提示
  }
  if (form.id) {
    await updateUserApi({ ...form, createTime: '' } as SystemUser)
    ElMessage.success('编辑成功')
  } else {
    const { id, ...data } = form
    await addUserApi(data)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  getList()
}

/* ==================== 删除 ==================== */
async function handleDelete(row: SystemUser) {
  await ElMessageBox.confirm(`确定删除用户「${row.nickname}」吗？`, '警告', { type: 'warning' })
  await deleteUserApi(row.id)
  ElMessage.success('删除成功')
  // 删除后如果当前页只剩一条且不是第一页，回退一页避免空白页
  if (tableData.value.length === 1 && query.page > 1) query.page--
  getList()
}

onMounted(getList)

/* ---------- 辅助显示 ---------- */
const roleMap: Record<string, { label: string; type: 'danger' | 'primary' | 'info' }> = {
  admin: { label: '管理员', type: 'danger' },
  editor: { label: '编辑', type: 'primary' },
  visitor: { label: '访客', type: 'info' }
}
</script>

<template>
  <div class="app-container">
    <el-card shadow="never">
      <!-- 搜索区 -->
      <el-form inline @submit.prevent>
        <el-form-item label="用户名">
          <el-input v-model="query.username" placeholder="用户名/昵称" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="query.role" placeholder="全部" clearable style="width: 140px">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑" value="editor" />
            <el-option label="访客" value="visitor" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
          <el-button icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- v-permission：只有 admin 角色能看到"新增用户"按钮 -->
      <el-button v-permission="['admin']" type="primary" icon="Plus" @click="openDialog()">
        新增用户
      </el-button>

      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" border style="margin-top: 16px">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="roleMap[row.role]?.type">{{ roleMap[row.role]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="160" />
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button v-permission="['admin']" link type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button v-permission="['admin']" link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.size"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 16px; justify-content: flex-end"
        @change="getList"
      />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="!!form.id" placeholder="登录账号" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="用户昵称" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑" value="editor" />
            <el-option label="访客" value="visitor" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="example@mail.com" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
