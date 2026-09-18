<script setup lang="ts">
/**
 * 首页仪表盘：欢迎卡片 + 统计卡片 + ECharts 图表
 */
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts'
import { useUserStore } from '@/store/modules/user'

// name 与路由 name 保持一致，才能被 keep-alive 正确缓存
defineOptions({ name: 'Dashboard' })

const userStore = useUserStore()

/** 统计卡片数据（真实项目由接口返回） */
const cards = [
  { title: '总用户数', value: '12,846', icon: 'User', color: '#409eff' },
  { title: '今日订单', value: '1,286', icon: 'ShoppingCart', color: '#67c23a' },
  { title: '今日访问', value: '8,642', icon: 'View', color: '#e6a23c' },
  { title: '总收入', value: '¥92,480', icon: 'Money', color: '#f56c6c' }
]

/* ---------- ECharts：图表实例放在组件外不行，setup 中用普通变量保存 ---------- */
const lineChartRef = ref<HTMLElement>()
const barChartRef = ref<HTMLElement>()
let lineChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null

function initCharts() {
  // 折线图：一周访问趋势
  lineChart = echarts.init(lineChartRef.value!)
  lineChart.setOption({
    title: { text: '一周访问趋势' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
    yAxis: { type: 'value' },
    grid: { left: 40, right: 20, bottom: 30, top: 50 },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.2 },
        data: [820, 932, 901, 934, 1290, 1330, 1120]
      }
    ]
  })

  // 柱状图：各产品销售量
  barChart = echarts.init(barChartRef.value!)
  barChart.setOption({
    title: { text: '产品销售统计' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['产品A', '产品B', '产品C', '产品D', '产品E'] },
    yAxis: { type: 'value' },
    grid: { left: 40, right: 20, bottom: 30, top: 50 },
    series: [
      {
        name: '销量',
        type: 'bar',
        barWidth: 30,
        itemStyle: { color: '#409eff', borderRadius: [4, 4, 0, 0] },
        data: [320, 480, 260, 540, 390]
      }
    ]
  })
}

/** 窗口尺寸变化时重绘图表 */
function handleResize() {
  lineChart?.resize()
  barChart?.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  // 销毁图表实例，防止内存泄漏
  lineChart?.dispose()
  barChart?.dispose()
})
</script>

<template>
  <div class="app-container">
    <!-- 欢迎卡片 -->
    <el-card class="welcome-card" shadow="never">
      <div class="welcome">
        <el-avatar :size="56" class="welcome-avatar">{{ userStore.name.charAt(0) }}</el-avatar>
        <div>
          <h3>你好，{{ userStore.name }}！</h3>
          <p>欢迎使用 Vue3 后台管理系统，今天也要加油哦~</p>
        </div>
      </div>
    </el-card>

    <!-- 统计卡片 -->
    <div class="card-list">
      <el-card v-for="card in cards" :key="card.title" shadow="hover" class="stat-card">
        <div class="stat-inner">
          <el-icon :size="40" :color="card.color"><component :is="card.icon" /></el-icon>
          <div>
            <p class="stat-title">{{ card.title }}</p>
            <p class="stat-value">{{ card.value }}</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表 -->
    <div class="chart-list">
      <el-card shadow="never"><div ref="lineChartRef" class="chart" /></el-card>
      <el-card shadow="never"><div ref="barChartRef" class="chart" /></el-card>
    </div>
  </div>
</template>

<style scoped>
.welcome-card {
  margin-bottom: 16px;
}

.welcome {
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-avatar {
  background-color: var(--sidebar-active);
  font-size: 24px;
}

.welcome p {
  margin-top: 6px;
  color: #909399;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.stat-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-title {
  color: #909399;
  font-size: 13px;
}

.stat-value {
  margin-top: 6px;
  font-size: 24px;
  font-weight: 600;
}

.chart-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 16px;
}

.chart {
  height: 320px;
}
</style>
