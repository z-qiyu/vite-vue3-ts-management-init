<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title"><img class="logo" alt="logo" src="/logo.svg" /> 登录</h2>
      <el-form :model="loginForm" :rules="rules" ref="form" label-width="100px" class="login-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="form-links">
            <el-link href="/" class="return-home-link">返回首页</el-link>
            <el-text style="display: flex; flex-direction: row; align-items: center">
              没有账户？ <el-link href="/register" class="register-link">前往注册</el-link>
            </el-text>
          </div>
        </el-form-item>
        <el-form-item class="form-actions">
          <el-button type="primary" @click="submitForm" class="submit-button">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import type { FormInstance } from 'element-plus'

const loginForm = ref({
  username: '',
  password: ''
})

const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const router = useRouter()
const userStore = useUserStore()
const form = ref<FormInstance>()

// Function to handle form submission
const submitForm = async () => {
  try {
    // Validate the form
    if (form.value) await form.value.validate()

    // Call the login API
    const response = userStore.login(loginForm.value.username, loginForm.value.password)
    // Redirect to the home page or any other page
    router.push({ name: 'index' })
  } catch (error) {
    // Handle login errors (e.g., display error messages)
    console.error('Login failed', error)
    // Display error message to the user if needed
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/var';

.logo {
  width: 36px;
  height: 36px;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(to right, #f5f5f5, #e0e0e0);
}

.login-card {
  width: 100%;
  max-width: 500px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.login-title {
  text-align: center;
  color: $primary-color;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 7px;
  justify-content: center;
}

.login-form {
  .el-form-item {
    margin-bottom: 24px;
  }

  .el-input {
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition:
      box-shadow 0.3s,
      border-color 0.3s;
  }

  .el-input:hover,
  .el-input:focus {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    border-color: $primary-color;
  }
}

.form-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  width: 100%;

  .return-home-link {
    color: $primary-color;
    text-decoration: underline;
  }

  .register-link {
    color: $primary-color;
    font-weight: 500;
  }
}

.form-actions {
  display: flex;
  justify-content: center;

  .el-button {
    border-radius: 6px;
    width: 100%;
    max-width: 200px;
  }

  .submit-button {
    background-color: $primary-color;
    border: none;

    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }
}
</style>
