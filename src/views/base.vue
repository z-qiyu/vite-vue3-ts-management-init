<template>
  <el-container class="seller-dashboard">
    <el-header>
      <CHeader />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu unique-opened router :default-active="router.fullPath" @select="handleSelect">
          <template v-for="child in nav" >
            <NavItem v-if="showNav(child.meta.permission,child.meta.no_permission)" base_path="/" :item="child" />
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <el-container class="main">
          <router-view />
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import CHeader from '@/components/header/index.vue'
import NavItem from '@/components/nav-item/index.vue'
import { nav } from '@/router'
import { useUserStore } from '@/stores'

console.log(nav)
const router = useRoute()
const {showNav} = useUserStore()

// 当前选中的菜单项
const activeTab = ref('1')

// 根据菜单项动态加载组件
const currentComponent = computed(() => {})

// 处理菜单选择
function handleSelect(index: string) {
  activeTab.value = index
}
</script>

<style scoped>
.seller-dashboard {
  display: flex;
  width: 100%;
}

.el-menu {
  width: 200px;
}

.content {
  flex: 1;
  padding: 20px;
}

.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
