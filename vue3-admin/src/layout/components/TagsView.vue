<script setup lang="ts">
/**
 * 页签栏（多标签页）：
 * - 路由变化时自动添加页签
 * - 点击页签切换页面，可关闭（首页固定不可关）
 * - 配合 AppMain 的 keep-alive 实现页面缓存（切换页签不丢失表单/滚动位置）
 */
import { watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useTagsViewStore, type TagView } from '@/store/modules/tagsView'
import { usePermissionStore } from '@/store/modules/permission'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()

/** 把当前路由加入页签栏 */
function addTag() {
  if (!route.meta?.title) return // 登录页等无 title 的路由不生成页签
  tagsViewStore.addView({
    path: route.path,
    title: route.meta.title,
    name: route.name as string,
    affix: route.meta.affix
  })
}

/** 初始化固定页签：遍历路由表找出 meta.affix 的（如首页），刷新后也能常驻 */
function initAffixTags(routes: RouteRecordRaw[], basePath = '') {
  routes.forEach((r) => {
    // 注意处理 basePath 为 '/' 的情况，避免拼出 '//dashboard' 这样的路径
    const fullPath = r.path.startsWith('/') ? r.path : `${basePath}/${r.path}`.replace(/\/+/g, '/')
    if (r.meta?.affix && r.meta?.title) {
      tagsViewStore.addView({ path: fullPath, title: r.meta.title, name: r.name as string, affix: true })
    }
    if (r.children) initAffixTags(r.children, fullPath)
  })
}

/** 关闭单个页签；若关闭的是当前页，则跳到最后一个剩余页签 */
function closeTag(tag: TagView) {
  tagsViewStore.delView(tag.path)
  if (route.path === tag.path) {
    const views = tagsViewStore.visitedViews
    router.push(views[views.length - 1]?.path || '/')
  }
}

/** 右上角下拉：关闭其他 / 关闭全部 */
function handleCommand(command: string) {
  if (command === 'others') {
    tagsViewStore.delOthersViews(route.path)
  } else {
    tagsViewStore.delAllViews()
    router.push('/')
  }
}

onMounted(() => initAffixTags(permissionStore.routes))
// 路由变化时添加页签，immediate 保证首次进入就执行
watch(() => route.path, addTag, { immediate: true })
</script>

<template>
  <div class="tags-view">
    <el-scrollbar class="tags-scroll">
      <router-link
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.path"
        :to="tag.path"
        class="tag-item"
        :class="{ active: route.path === tag.path }"
      >
        {{ tag.title }}
        <el-icon v-if="!tag.affix" class="tag-close" @click.prevent.stop="closeTag(tag)">
          <Close />
        </el-icon>
      </router-link>
    </el-scrollbar>

    <el-dropdown trigger="click" @command="handleCommand">
      <span class="tags-more"><el-icon><ArrowDownBold /></el-icon></span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="others">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped>
.tags-view {
  display: flex;
  align-items: center;
  height: var(--tags-height);
  padding: 0 12px;
  border-top: 1px solid #f0f0f0;
}

.tags-scroll {
  flex: 1;
  white-space: nowrap;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 26px;
  line-height: 26px;
  padding: 0 10px;
  margin-right: 6px;
  font-size: 12px;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  transition: all 0.2s;
}

.tag-item.active {
  color: #fff;
  background-color: var(--sidebar-active);
  border-color: var(--sidebar-active);
}

.tag-close {
  font-size: 12px;
  border-radius: 50%;
}

.tag-close:hover {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.3);
}

.tags-more {
  display: flex;
  align-items: center;
  padding: 4px;
  cursor: pointer;
  outline: none;
}
</style>
