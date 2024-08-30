<template>
  <div>
    <el-button type="primary" @click="openCreateDialog">添加用户</el-button>
    <el-table :data="data" style="width: 100%">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="email" label="电子邮件"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="first_name" label="姓名"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="openUpdateDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Create Form Dialog -->
    <el-dialog title="添加用户" v-model="createDialogVisible">
      <el-form :model="newUser" ref="createForm">
        <el-form-item label="用户名">
          <el-input v-model="newUser.username"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件">
          <el-input v-model="newUser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="newUser.phone"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="newUser.first_name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="newUser.password"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-radio-group v-model="newUserRole">
            <el-radio :label="0">游客</el-radio>
            <el-radio :label="1">员工</el-radio>
            <el-radio :label="2">管理员</el-radio>
            <el-radio :label="3">超级管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="create">提交</el-button>
          <el-button @click="createDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- Update Form Dialog -->
    <el-dialog title="编辑用户" v-model="updateDialogVisible">
      <el-form :model="currentUser" ref="updateForm">
        <el-form-item label="用户名">
          <el-input v-model="currentUser.username"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件">
          <el-input v-model="currentUser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="currentUser.phone"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="currentUser.first_name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="currentUser.password"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-radio-group v-model="currentUserRole">
            <el-radio :label="0">游客</el-radio>
            <el-radio :label="1">员工</el-radio>
            <el-radio :label="2">管理员</el-radio>
            <el-radio :label="3">超级管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="update">提交</el-button>
          <el-button @click="updateDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { User } from '@/apis/users/types'
import type { Material } from '@/apis/material/types'
import type { AxiosError } from 'axios'
import { createUser, deleteUser, getUsers, updateUser } from '@/apis/users'

const roleMapping = {
  0: { is_superuser: false, is_admin: false, is_staff: false }, // 游客
  1: { is_superuser: false, is_admin: false, is_staff: true }, // 员工
  2: { is_superuser: false, is_admin: true, is_staff: true }, // 管理员
  3: { is_superuser: true, is_admin: true, is_staff: true } // 超级管理员
}
const newUserRole = ref<0 | 1 | 2 | 3>(0)
const currentUserRole = ref<0 | 1 | 2 | 3>(0)

const newUser = ref<User>({
  id: null,
  first_name: '',
  last_name: '',
  password: '',
  username: '',
  email: '',
  phone: ''
})

// 当前编辑的用户
const currentUser = ref<User>({
  id: null,
  date_joined: '',
  first_name: '',
  is_active: false,
  is_admin: false,
  is_staff: false,
  is_superuser: false,
  last_name: '',
  password: '',
  username: '',
  email: '',
  phone: ''
})
watch(
  () => [newUserRole.value, currentUserRole.value],
  () => {
    Object.assign(newUser.value, roleMapping[newUserRole.value])
    Object.assign(currentUser.value, roleMapping[currentUserRole.value])
  },
  {
    deep: true,
    immediate: true
  }
)
// 对话框的可见性
const createDialogVisible = ref(false)
const updateDialogVisible = ref(false)

const totalProducts = ref(0)
const itemsPerPage = ref(10)
const page = ref(1)
const data = ref<User[]>([])

// Handle page size change
function handleSizeChange(size: number) {
  itemsPerPage.value = size
  fetchData()
}
// Handle current page change
function handleCurrentChange(pageNumber: number) {
  page.value = pageNumber
  fetchData()
}

async function fetchData() {
  try {
    const response = await getUsers({
      page: page.value,
      page_size: itemsPerPage.value
    })
    data.value = response.data
    totalProducts.value = Number(response.headers['x-total-count'])
  } catch (error: AxiosError | unknown) {
    ElMessage.error('获取数据失败：' + error?.toString())
  }
}

// 打开创建对话框
const openCreateDialog = () => {
  createDialogVisible.value = true
}

// 打开更新对话框
const openUpdateDialog = (user: User) => {
  currentUser.value = { ...user }
  currentUserRole.value = 0
  if (user.is_staff) {
    currentUserRole.value = 1
  }
  if (user.is_admin) {
    currentUserRole.value = 2
  }
  if (user.is_superuser) {
    currentUserRole.value = 3
  }
  updateDialogVisible.value = true
}

// 创建用户
const create = () => {
  createUser(newUser.value)
    .then((res) => {
      ElMessage.success('更新成功')
      createDialogVisible.value = false
      fetchData()
    })
    .catch((err) => {
      ElMessage.error('删除失败: ' + err.toString())
    })
}

// 更新用户
const update = () => {
  updateUser(currentUser.value)
    .then((res) => {
      ElMessage.success('更新成功')
      updateDialogVisible.value = false
      fetchData()
    })
    .catch((err) => {
      ElMessage.error('删除失败: ' + err.toString())
    })
}

// 删除用户
const del = (id: number) => {
  deleteUser(id)
    .then((res) => {
      ElMessage.success('删除成功')
      fetchData()
    })
    .catch((err) => {
      ElMessage.error('删除失败: ' + err.toString())
    })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* 添加你的样式 */
</style>
