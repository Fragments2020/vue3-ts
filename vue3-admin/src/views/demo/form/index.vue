<script setup lang="ts">
/**
 * 表单示例：常见表单控件 + 校验 + 提交反馈
 */
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

defineOptions({ name: 'DemoForm' })

const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive({
  name: '',
  region: '',
  date: '',
  time: '',
  type: [] as string[],
  resource: '线上',
  desc: ''
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  type: [{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }]
}

async function handleSubmit() {
  try {
    await formRef.value!.validate()
  } catch {
    return
  }
  submitting.value = true
  // 模拟提交请求
  setTimeout(() => {
    submitting.value = false
    ElMessage.success('提交成功（数据已打印到控制台）')
    console.log('表单数据：', { ...form })
  }, 500)
}

function handleReset() {
  formRef.value?.resetFields()
}
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" style="max-width: 640px">
      <template #header>活动创建表单</template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入活动名称" />
        </el-form-item>

        <el-form-item label="活动区域" prop="region">
          <el-select v-model="form.region" placeholder="请选择" style="width: 100%">
            <el-option label="上海" value="shanghai" />
            <el-option label="北京" value="beijing" />
            <el-option label="深圳" value="shenzhen" />
          </el-select>
        </el-form-item>

        <el-form-item label="活动日期" prop="date">
          <el-date-picker v-model="form.date" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>

        <el-form-item label="活动时间">
          <el-time-picker v-model="form.time" placeholder="选择时间" style="width: 100%" />
        </el-form-item>

        <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="form.type">
            <el-checkbox value="online">线上</el-checkbox>
            <el-checkbox value="offline">线下</el-checkbox>
            <el-checkbox value="free">免费</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="活动形式">
          <el-radio-group v-model="form.resource">
            <el-radio value="线上">线上</el-radio>
            <el-radio value="线下">线下</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="活动描述">
          <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="补充说明（选填）" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">立即创建</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
