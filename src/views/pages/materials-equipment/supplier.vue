<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { AxiosError } from 'axios'
import type { Supplier } from '@/apis/supplier/types'
import { getSupplier, getSuppliers } from '@/apis/supplier'

const totalProducts = ref(0)
const itemsPerPage = ref(10)
const page = ref(1)
const data = ref<Supplier[]>([])
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
    const response = await getSuppliers({
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
    <el-table :data="data" style="width: 100%">
      <el-table-column prop="supplier_id" label="供应商ID"></el-table-column>
      <el-table-column prop="company_name" label="公司名称"></el-table-column>
      <el-table-column prop="contact_person" label="联系人"></el-table-column>
      <el-table-column prop="contact_position" label="联系人职位"></el-table-column>
      <el-table-column prop="contact_number" label="联系电话"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="shipping_cost" label="发货成本"></el-table-column>
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
