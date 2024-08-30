<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { AxiosError } from 'axios'
import { getExperimentSchemes } from '@/apis/experimentScheme'
import type { ExperimentScheme } from '@/apis/experimentScheme/types'
import { formatDate } from '@vueuse/shared'

const totalProducts = ref(0)
const itemsPerPage = ref(10)
const page = ref(1)
const data = ref<ExperimentScheme[]>([])
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
    const response = await getExperimentSchemes({
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
  <div v-loading="loading" class="header">
    <el-form inline>
      <el-form-item label="关键词">
        <el-input v-model="search.search" />
      </el-form-item>
      <el-form-item>
        <el-button @click="doneSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table v-loading="loading" :data="data" style="width: 100%">
    <el-table-column prop="experiment_type" label="实验类型" width="120"></el-table-column>
    <el-table-column prop="experiment_name" label="实验名称" width="180"></el-table-column>
    <el-table-column prop="purpose" label="实验目的"></el-table-column>
    <el-table-column prop="submission_date" label="提交时间" width="150">
      <template v-slot="{ row }">
        {{ row.submission_date }}
      </template>
    </el-table-column>
    <el-table-column prop="importance_level" label="重要等级" width="120"></el-table-column>
    <el-table-column prop="test_index" label="测试指标" width="180"></el-table-column>
    <el-table-column label="详情" width="200">
      <template #default="{ row }">
        <el-button
          @click="$router.push({ name: 'test-plan-detail', params: { id: row.id } })"
          type="primary"
        >
          详情
        </el-button>
        <el-button
          @click="$router.push({ name: 'test-data', params: { id: row.id } })"
          type="primary"
        >
          实验数据
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-loading="loading"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="page"
    :page-size="itemsPerPage"
    :total="totalProducts"
    layout="total, sizes, prev, pager, next, jumper"
    style="margin-top: 20px"
  />
</template>

<style scoped lang="scss"></style>
