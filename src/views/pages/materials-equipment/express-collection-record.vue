<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { AxiosError } from 'axios'
import type { ExpressReceipt } from '@/apis/expressReceipt/types'
import { getExpressReceipts } from '@/apis/expressReceipt'
import { media_url } from '@/apis'

const totalProducts = ref(0)
const itemsPerPage = ref(10)
const page = ref(1)
const data = ref<ExpressReceipt[]>([])
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
    const response = await getExpressReceipts({
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
      <el-table-column prop="express_id" label="快递ID" width="80"> </el-table-column>
      <el-table-column prop="name" label="快递描述"> </el-table-column>
      <el-table-column prop="tracking_number" label="跟踪号"> </el-table-column>
      <el-table-column prop="express_label_photo" width="100px" label="标签照片">
        <template #default="scope">
          <el-image
            :preview-src-list="[media_url + scope.row.express_label_photo]"
            :src="media_url + scope.row.express_label_photo"
            alt="Express Label"
            style="width: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="purchaser" label="购买者"> </el-table-column>
      <el-table-column prop="storage_time" label="入库时间" width="180">
        <template v-slot="scope">
          {{ scope.row.storage_time }}
        </template>
      </el-table-column>
      <el-table-column prop="receiver" label="接收者"> </el-table-column>
      <el-table-column prop="location" label="位置"> </el-table-column>
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
