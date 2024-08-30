<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import logo from '@/assets/logo.svg'

const route = useRoute()
const now = new Date()
const user = useUserStore()
const formattedDate = now.toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
})
console.log(formattedDate)
const date = ref<string>(formattedDate)
</script>

<template>
  <header class="navbar">
    <div class="top">
      <div class="logo">
        <div class="t">
          <img :src="logo" />
          <el-text class="name">{{ route.meta.title }}</el-text>
        </div>
        <el-text class="span" type="primary">{{ date }}</el-text>
      </div>
      <nav>
        <ul class="nav-left"></ul>
        <div class="nav-right">
          <div style="display: flex; align-items: center; gap: 9px" v-if="user.isLoggedIn">
            <el-text type="primary">{{
              user.userInfo.first_name || user.userInfo.username
            }}</el-text>
            <el-link href="/login" plain type="danger">退出登录</el-link>
          </div>
          <el-button v-else link tag="a" href="/login" plain type="primary">前往登录</el-button>
        </div>
      </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import '../../assets/var';

.navbar {
  width: 100%;

  .top {
    background: #ffffffff;
    border-radius: 0px;
    border-width: 0px;
    border-color: #000000ff;
    border-style: solid;
    display: flex;
    align-items: center;
  }
}

nav {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: end;

  .t {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  > .span {
    font-size: 12px;
    align-self: unset;
  }

  img {
    width: 22px;
    height: 22px;
  }
  .name {
    font-family: Lexend;
    font-size: 20px;
    line-height: 42px;
    font-weight: 700;
    color: #000000ff;
  }
}

.nav-left {
  margin: 0;
  width: 400px;
  display: flex;
  align-items: center;
  letter-spacing: 4px;
  font-family: Manrope;
  line-height: 22px;
  font-weight: 400;
  opacity: 1;

  .item {
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    white-space: nowrap;
    border-bottom: 3px solid #00000000;

    a {
      text-decoration: none;
      font-family: Manrope;
      color: #565d6dff;
      font-size: 14px;
      line-height: 22px;
      font-weight: 400;
    }

    &.active {
      border-color: $primary-color !important;

      a {
        color: $primary-color !important;
      }
    }
  }
}
.nav-right {
  > * {
    text-decoration: none;
    width: 160px;
    padding: 0 12px;
    font-family: Manrope;
    font-size: 14px;
    line-height: 22px;
    font-weight: 400;
    letter-spacing: 3px;
  }
}
</style>
