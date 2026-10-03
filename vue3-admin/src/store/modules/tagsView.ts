/**
 * 页签栏（TagsView）状态：记录访问过的页面，支持关闭/缓存
 */
import { defineStore } from 'pinia'

export interface TagView {
  path: string
  title: string
  name?: string // 路由 name，keep-alive 缓存靠它匹配
  affix?: boolean // 是否固定（固定的页签不可关闭，如首页）
}

interface TagsViewState {
  visitedViews: TagView[]
}

export const useTagsViewStore = defineStore('tagsView', {
  state: (): TagsViewState => ({
    visitedViews: []
  }),
  getters: {
    /** 需要被 keep-alive 缓存的组件名列表 */
    cachedViews(): string[] {
      return this.visitedViews.filter((v) => v.name).map((v) => v.name!)
    }
  },
  actions: {
    /** 路由变化时调用，添加页签（已存在则跳过） */
    addView(view: TagView) {
      if (this.visitedViews.some((v) => v.path === view.path)) return
      this.visitedViews.push(view)
    },
    /** 关闭指定页签 */
    delView(path: string) {
      const index = this.visitedViews.findIndex((v) => v.path === path)
      if (index > -1) this.visitedViews.splice(index, 1)
    },
    /** 关闭其他页签（固定的保留） */
    delOthersViews(path: string) {
      this.visitedViews = this.visitedViews.filter((v) => v.path === path || v.affix)
    },
    /** 关闭全部页签（固定的保留） */
    delAllViews() {
      this.visitedViews = this.visitedViews.filter((v) => v.affix)
    }
  }
})
