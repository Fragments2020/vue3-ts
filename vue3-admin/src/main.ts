import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import { permissionDirective } from '@/directives/permission'

import 'element-plus/dist/index.css' // Element Plus 样式
import '@/styles/index.css' // 项目全局样式
import '@/router/guard' // 路由守卫（登录鉴权 + 动态路由注册）

const app = createApp(App)

app.use(createPinia())
app.use(router)
// locale 设置为中文，让分页、日期等组件显示中文
app.use(ElementPlus, { locale: zhCn })

// 全量注册 Element Plus 图标，模板中可直接用 <el-icon><User /></el-icon>
// 生产项目建议按需引入以减小体积
for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, component)
}

// 注册按钮级权限指令：v-permission="['admin']"
app.directive('permission', permissionDirective)

app.mount('#app')
