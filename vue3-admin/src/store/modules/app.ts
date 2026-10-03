/**
 * 应用全局 UI 状态：侧边栏折叠等
 */
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    collapsed: false // 侧边栏是否折叠
  }),
  actions: {
    toggleSidebar() {
      this.collapsed = !this.collapsed
    }
  }
})
