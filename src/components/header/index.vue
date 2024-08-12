<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <header class="navbar">
    <div class="top">
      <div class="logo">
        <img src="/logo.svg" />
        <el-text class="name">二手乐 卖家工作台</el-text>
      </div>
      <nav>
        <ul class="nav-left">
          <router-link to="/"><el-button type="primary">前往二手平台</el-button></router-link>
        </ul>
        <div class="nav-right">
          <el-button link tag="a" href="/register" plain type="danger">退出登录</el-button>
        </div>
      </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import '../../assets/var';

.navbar {
  width: 100%;
  padding: 10px;

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
  flex-direction: row;
  align-items: center;
  gap: 10px;

  img {
    width: 36px;
    height: 36px;
  }
  .name {
    font-family: Lexend;
    font-size: 28px;
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
