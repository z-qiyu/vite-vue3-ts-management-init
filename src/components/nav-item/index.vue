<script setup lang="ts">
import type { NavItemProps } from '@/components/nav-item/types'
import { defineComponent } from 'vue'
import { PermissionEnum, useUserStore } from '@/stores'

const props = defineProps<NavItemProps>()
const {showNav} = useUserStore()

</script>

<template>

  <template  v-if="showNav(item.meta.permission,item.meta.no_permission)">
    <el-sub-menu :index="base_path + '/' + item.path" v-if="Array.isArray(item.children)">
    <template #title>
      <el-icon v-if="item.meta.icon"><component :is="item.meta.icon" /></el-icon>
      <span>{{ item.meta.title }}</span>
    </template>
    <Index v-for="child in item.children" :base_path="base_path + item.path" :item="child" />
    </el-sub-menu>
    <el-menu-item v-else :route="item" :index="base_path + '/' + item.path">
      <el-icon v-if="item.meta.icon"><component :is="item.meta.icon" /></el-icon>
      <span>{{ item.meta.title }}</span>
    </el-menu-item>
  </template>

</template>

<style scoped lang="scss"></style>
