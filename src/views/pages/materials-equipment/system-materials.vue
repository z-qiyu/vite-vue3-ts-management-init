<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { Material } from '@/apis/material/types'
import { getMaterials } from '@/apis/material'
import type { AxiosError } from 'axios'

const totalProducts = ref(0)
const itemsPerPage = ref(10)
const page = ref(1)
const data = ref<Material[]>([])
const loading = ref(false)
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
      <el-table-column prop="specification" label="规格"></el-table-column>
      <el-table-column prop="packaging_spec" label="包装规格"></el-table-column>
      <el-table-column prop="remaining_amount" label="剩余数量"></el-table-column>
      <el-table-column prop="supplier" label="供应商ID"></el-table-column>
      <el-table-column prop="purchaser" label="购买者"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="price" label="单价"></el-table-column>
      <el-table-column prop="shipping_cost" label="运输成本"></el-table-column>
      <el-table-column prop="warning_limit" label="警告阈值"></el-table-column>
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
</template>

<style scoped lang="scss"></style>
