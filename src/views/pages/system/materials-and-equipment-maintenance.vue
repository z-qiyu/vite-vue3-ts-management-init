<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { Material } from '@/apis/material/types'
import { deleteMaterial, getMaterials } from '@/apis/material'
import type { AxiosError } from 'axios'
import UpdateMaterial from './form/material.vue'
import {
  deleteExperimentSchemeHasExperimentProcesses,
  updateExperimentSchemeHasExperimentProcesses
} from '@/apis/experimentScheme'
import type { ExperimentProcess } from '@/apis/experimentScheme/types'

const totalProducts = ref(0)
const itemsPerPage = ref(10)
const page = ref(1)
const data = ref<Material[]>([])
const loading = ref(false)
const search = ref({
  search: ''
})

const material = ref<Material>({
  material_id: 0,
  name: '',
  chemical_name: '',
  cas_number: null,
  is_confidential: false,
  confidential_code: null,
  specification: '',
  packaging_spec: '',
  remaining_amount: 0,
  supplier: null,
  purchaser: '',
  description: '',
  price: 0,
  shipping_cost: 0,
  warning_limit: 0
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
    const response = await getMaterials({
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

const show = ref(false)
const submitForm = () => {
  updateExperimentSchemeHasExperimentProcesses(experimentProcess.value).then(()=>{
    fetchData()
  })
}
const edit = (row:Material) => {
  material.value = row
  show.value = true
}

const del = (row:Material) => {
  deleteMaterial(row).then(()=>{
    fetchData()
  })
}
</script>

<template>
  <div v-loading="loading">
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

    <el-table :data="data" border style="width: 100%">
      <el-table-column prop="material_id" label="材料ID" width="120">
        <template #default="{ row }">
          <el-text :type="row.warning_limit >= row.remaining_amount ? 'danger' : 'primary'">{{
            row.material_id
          }}</el-text>
          <el-tag
            style="margin-left: 4px"
            v-if="row.warning_limit >= row.remaining_amount"
            type="danger"
            >库存警告</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="chemical_name" label="化学名称"></el-table-column>
      <el-table-column prop="cas_number" label="CAS编号"></el-table-column>
      <el-table-column prop="is_confidential" label="保密">
        <template v-slot="scope">
          {{ scope.row.is_confidential ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="confidential_code" label="保密代码"></el-table-column>
      <el-table-column prop="price" label="单价"></el-table-column>
      <el-table-column prop="warning_limit" label="警告阈值"></el-table-column>
      <el-table-column label="操作">
        <template #default="{row}">
          <el-button size="small" type="primary" @click="edit(row)">修改</el-button>
          <el-button size="small" type="danger" @click="del(row)">删除</el-button>
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
  </div>
  <el-dialog v-model="show">
    <UpdateMaterial v-model="material" />
  </el-dialog>
</template>

<style scoped lang="scss"></style>
