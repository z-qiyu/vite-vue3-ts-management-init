<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2 class="register-title"><img class="logo" alt="logo" :src="logo" />注册</h2>
      <el-form :model="registerForm" :rules="rules" label-width="100px" class="register-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="registerForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            type="password"
            v-model="registerForm.confirmPassword"
            placeholder="请确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="form-links">
            <el-link href="/" class="return-home-link">返回首页</el-link>
            <el-text style="display: flex; flex-direction: row; align-items: center">
              已有账号？ <el-link href="/login" class="login-link">前往登录</el-link>
            </el-text>
          </div>
        </el-form-item>
        <el-form-item class="form-actions">
          <el-button type="primary" @click="submitForm" class="submit-button">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import logo from '@/assets/logo.svg'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElCard,
  ElLink,
  ElText,
  ElMessage,
  type FormRules
} from 'element-plus'
import { useRouter } from 'vue-router'
import { type RegisterRequest, registerUser } from '@/apis'
import type { InternalRuleItem } from 'async-validator/dist-types/interface'

const router = useRouter()

// Define the validation function first
const confirmValid = (
  rule: InternalRuleItem,
  value: string,
  callback: (error?: string | Error) => void
) => {
  if (value !== registerForm.value.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

// Define the form model and validation rules after the function
const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const rules = ref<FormRules<RegisterRequest>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: confirmValid, trigger: 'blur' }
  ]
})

// Submit the form
const submitForm = async () => {
  try {
    await registerUser(registerForm.value)
    ElMessage.success('注册成功')
    router.push({ name: 'login' })
  } catch (error) {
    console.error('注册失败', error)
    // Show error message
    ElMessage.error('注册失败，请检查输入')
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/var';

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(to right, #f5f5f5, #e0e0e0);
}

.logo {
  width: 36px;
  height: 36px;
}

.register-card {
  width: 100%;
  max-width: 500px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.register-title {
  text-align: center;
  color: $primary-color;
  margin-bottom: 30px;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 7px;
  justify-content: center;
  font-weight: 600;
}

.register-form {
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

  .login-link {
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
