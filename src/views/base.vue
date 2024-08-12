<template>
  <el-container class="seller-dashboard">
    <el-header>
      <CHeader />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu router :default-active="router.fullPath" @select="handleSelect">
          <el-menu-item :router="{ name: 'seller-product' }" index="/seller/product"
            >商品管理</el-menu-item
          >
          <el-menu-item :router="{ name: 'seller-order' }" index="/seller/order"
            >订单管理</el-menu-item
          >
          <el-menu-item :router="{ name: 'seller-buyer' }" index="/seller/buyer"
            >用户管理</el-menu-item
          >
          <el-menu-item :router="{ name: 'seller-evaluate' }" index="/seller/evaluate"
            >评价与反馈</el-menu-item
          >
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import CHeader from '@/components/header/index.vue'

const router = useRoute()

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
</style>
