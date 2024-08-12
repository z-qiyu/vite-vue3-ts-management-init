<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { onMounted, watch } from 'vue'
import { useUserStore } from '@/stores'

const user = useUserStore()
const router = useRouter()
watch(
  () => user.isLoggedIn,
  () => {
    if (!user.isLoggedIn) {
      router.go(0)
    }
  }
)

onMounted(() => {
  user.initializeFromToken()
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
