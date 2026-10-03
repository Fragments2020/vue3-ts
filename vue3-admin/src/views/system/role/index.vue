<script setup lang="ts">
/**
 * 角色管理：维护角色及其权限点
 * 真实项目中，角色-权限关系保存在后端，登录后由接口返回，前端据此生成路由和按钮
 */
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { getRoleListApi, addRoleApi, updateRoleApi, deleteRoleApi } from '@/api/system'
import { permissionOptions, type RoleItem } from '@/api/mock'

defineOptions({ name: 'SystemRole' })

const tableData = ref<RoleItem[]>([])
const loading = ref(false)

async function getList() {
  loading.value = true
  try {
    tableData.value = await getRoleListApi()
  } finally {
    loading.value = false
  }
}

/* ---------- 新增 / 编辑弹窗 ---------- */
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()

const form = reactive({
  id: 0,
  name: '',
  key: '',
  description: '',
  permissions: [] as string[]
})

function openDialog(row?: RoleItem) {
  if (row) {
    dialogTitle.value = '编辑角色'
    Object.assign(form, row)
  } else {
    dialogTitle.value = '新增角色'
    Object.assign(form, { id: 0, name: '', key: '', description: '', permissions: [] })
  }
  dialogVisible.value = true
}

async function handleSubmit() {
  try {
    await formRef.value!.validate()
  } catch {
    return
  }
  if (form.id) {
    await updateRoleApi({ ...form })
    ElMessage.success('编辑成功')
  } else {
    const { id, ...data } = form
    await addRoleApi(data)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  getList()
}

async function handleDelete(row: RoleItem) {
  await ElMessageBox.confirm(`确定删除角色「${row.name}」吗？`, '警告', { type: 'warning' })
  await deleteRoleApi(row.id)
  ElMessage.success('删除成功')
  getList()
}

/** 根据权限点 key 找中文名，表格里展示用 */
function permissionLabel(key: string) {
  return permissionOptions.find((p) => p.key === key)?.label || key
}

onMounted(getList)
</script>

<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-button type="primary" icon="Plus" @click="openDialog()">新增角色</el-button>

      <el-table v-loading="loading" :data="tableData" border style="margin-top: 16px">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="角色名称" width="140" />
        <el-table-column prop="key" label="角色标识" width="120">
          <template #default="{ row }">
            <el-tag>{{ row.key }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="180" />
        <el-table-column label="权限点" min-width="240">
          <template #default="{ row }">
            <el-tag
              v-for="p in row.permissions"
              :key="p"
              size="small"
              type="success"
              style="margin: 2px 4px 2px 0"
            >
              {{ permissionLabel(p) }}
            </el-tag>
            <span v-if="!row.permissions.length" style="color: #909399">无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button link type="danger" :disabled="row.key === 'admin'" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="{
          name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
          key: [{ required: true, message: '请输入角色标识', trigger: 'blur' }]
        }"
        label-width="90px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="如：运营专员" />
        </el-form-item>
        <el-form-item label="角色标识" prop="key">
          <el-input v-model="form.key" :disabled="!!form.id" placeholder="如：operator（路由权限判断用）" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="权限点">
          <el-checkbox-group v-model="form.permissions">
            <el-checkbox v-for="p in permissionOptions" :key="p.key" :value="p.key">
              {{ p.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
