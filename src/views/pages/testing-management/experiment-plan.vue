<template>
  <el-form
    ref="form"
    :model="experimentPlan"
    :rules="rules"
    label-width="120px"
    @submit.prevent="onSubmit"
    v-loading="loading"
  >
    <el-form-item label="实验计划标题" prop="title">
      <el-input v-model="experimentPlan.title" placeholder="实验计划的标题"></el-input>
    </el-form-item>
    <el-form-item label="实验计划等级" prop="level">
      <el-select v-model="experimentPlan.level" placeholder="请选择实验计划等级">
        <el-option
          v-for="item in levelChoices"
          :key="item[0]"
          :label="item[1]"
          :value="item[0]"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="实验计划内容" prop="content">
      <el-input
        type="textarea"
        v-model="experimentPlan.content"
        placeholder="实验计划的内容"
      ></el-input>
    </el-form-item>
    <el-form-item label="实验计划权重" prop="weight">
      <el-input v-model.number="experimentPlan.weight" placeholder="实验计划的权重"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit">提交</el-button>
    </el-form-item>
  </el-form>
  <div class="header">
    <el-form inline>
      <el-form-item label="关键词">
        <el-input v-model="search.search" />
      </el-form-item>
      <el-form-item>
        <el-button @click="doneSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="data" style="width: 100%">
    <el-table-column prop="title" label="实验计划标题" width="180"></el-table-column>
    <el-table-column prop="level" label="实验计划等级" width="120">
      <template #default="{ row }">
        {{ levelText(row.level) }}
      </template>
    </el-table-column>
    <el-table-column prop="content" label="实验计划内容" show-overflow-tooltip></el-table-column>
    <el-table-column prop="weight" label="实验计划权重" width="120"></el-table-column>
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="{ row }">
        <el-button size="small" type="primary" @click="editPlan(row)">编辑</el-button>
        <el-button size="small" type="danger" @click="deletePlan(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="page"
    :page-size="itemsPerPage"
    :total="totalProducts"
    layout="total, sizes, prev, pager, next, jumper"
    style="margin-top: 20px"
  />
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref } from 'vue'
import type { ExperimentPlan } from '@/apis/experimentPlan/types'
import {
  createExperimentPlan,
  deleteExperimentPlan,
  getExperimentPlans
} from '@/apis/experimentPlan'
import { ElMessage } from 'element-plus'
import { levelText } from './utils'
import type { ExpressReceipt } from '@/apis/expressReceipt/types'
import { getExpressReceipts } from '@/apis/expressReceipt'
import type { AxiosError } from 'axios'

const loading = ref(false)
const data = ref<ExperimentPlan[]>([])
const experimentPlan = ref<ExperimentPlan>({
  id: null,
  title: '',
  level: 1,
  content: '',
  weight: 0
})

const levelChoices = [
  [1, 'Level 1'],
  [2, 'Level 2'],
  [3, 'Level 3']
]

const rules = {
  title: [{ required: true, message: '请输入实验计划标题', trigger: 'blur' }],
  level: [{ required: true, message: '请选择实验计划等级', trigger: 'change' }],
  content: [{ required: true, message: '请输入实验计划内容', trigger: 'blur' }],
  weight: [
    { required: true, message: '请输入实验计划权重', trigger: 'blur' },
    { type: 'number', message: '权重必须为数字', trigger: 'blur' }
  ]
}

const totalProducts = ref(0)
const itemsPerPage = ref(10)
const page = ref(1)
const search = ref({
  search: ''
})
function doneSearch() {
  page.value = 1
  fetchData()
}
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
    loading.value = true
    const response = await getExperimentPlans({
      page: page.value,
      page_size: itemsPerPage.value,
      keyword: search.value.search
    })
    data.value = response.data
    totalProducts.value = Number(response.headers['x-total-count'])
  } catch (error: AxiosError | unknown) {
    ElMessage.error('获取数据失败：' + error?.toString())
  }
  loading.value = false
}

onMounted(() => {
  fetchData()
})

const onSubmit = () => {
  loading.value = true
  createExperimentPlan(experimentPlan.value)
    .then((res) => {
      ElMessage.success('添加成功')
      fetchData()
    })
    .catch((err) => {
      ElMessage.error('添加失败: ' + err.toString())
    })
    .finally(() => {
      loading.value = false
    })
  console.log('实验计划数据：', experimentPlan.value)
}

const editPlan = (row: ExperimentPlan) => {
  console.log(`正在编辑计划：${row.title}`)
  // 在这里添加编辑计划的逻辑
}

const deletePlan = (row: ExperimentPlan) => {
  console.log(`正在删除计划：${row.title}`)
  deleteExperimentPlan(row.id!)
    .then((res) => {
      ElMessage.success('删除成功')
    })
    .catch((err) => {
      ElMessage.error('删除删除：' + err.toString())
    })
}
</script>
