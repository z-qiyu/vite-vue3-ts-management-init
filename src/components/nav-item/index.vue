<script setup lang="ts">

import type { NavItemProps } from '@/components/nav-item/types'
import { defineComponent } from 'vue'

const props = defineProps<NavItemProps>()

</script>

<template>
  <el-sub-menu :index="base_path+item.path" v-if="Array.isArray(item.children)">
    <template #title>
      <el-icon v-if="item.meta.icon"><component :is="item.meta.icon" /></el-icon>
      <span>{{item.meta.title}}</span>
    </template>
    <Index v-for="child in item.children" :base_path="base_path+child.path" :item="child"/>
  </el-sub-menu>
  <el-menu-item :route="item" :index="base_path+item.path" v-else>
    <el-icon v-if="item.meta.icon"><component :is="item.meta.icon" /></el-icon>
    <span>{{item.meta.title}}</span>
  </el-menu-item>
</template>

<style scoped lang="scss">

</style>