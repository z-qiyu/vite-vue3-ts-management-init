<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { AxiosError } from 'axios'
import { getExperimentSchemes } from '@/apis/experimentScheme'
import { formatDate } from '@vueuse/shared'
import type { ExperimentReport, ExperimentReportJson } from '@/apis/experimentReport/types'
import { getExperimentReports, updateExperimentReport } from '@/apis/experimentReport'
import CreateReportForm from '@/views/pages/testing-management/form/create-report-form.vue'
import type { PK } from '@/apis'

const totalProducts = ref(0)
const itemsPerPage = ref(10)
const page = ref(0)
const data = ref<ExperimentReport[]>([])
const loading = ref(false)
const show = ref(false)
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
  if(totalProducts.value !== 0 && totalProducts.value === data.value.length){
    ElMessage.error("没有更多数据了")
    return
  }
  try {
    page.value += 1
    loading.value = true
    const response = await getExperimentReports({
      page: page.value,
      page_size: itemsPerPage.value,
      keyword: search.value.search
    })
    data.value = response.data
    totalProducts.value = Number(response.headers['x-total-count'])
  } catch (error: AxiosError | unknown) {
    page.value -= 1
    ElMessage.error('获取数据失败：' + error?.toString())
  }
  loading.value = false
}

onMounted(() => {
  fetchData()
})

const addRow = (row:ExperimentReport) => {
  if(!Array.isArray(row.content.data)){
    row.content.data = [{
      content:"",
      report:"",
      rate:""
    }]
  }else{
    row.content.data.push({
      content:"",
      report:"",
      rate:""
    })
  }
}

const editIndex = ref<{
  index:number | null,
  row:ExperimentReport | null
}>({
  index:null,
  row:null
})
const editRow = (row:ExperimentReport,index:number) => {
  editIndex.value.index = index
  editIndex.value.row = row
}
const delRow = (row:ExperimentReport,index:number) => {
  row.content.data.splice(index,1)
}

const saveRow = (row:ExperimentReport) => {
  updateExperimentReport(row).then(res=>{
    ElMessage.success('保存成功')
  }).catch((e:AxiosError)=>{
    console.log(e.message)
  })
}
</script>

<template>
  <el-card>
   <el-collapse >
      <el-collapse-item v-for="item in data" :key="item.id" :title="item.title">
        <el-card>
          <el-table :data="item?.content?.data || []">
            <el-table-column label="内容" prop="content">
              <template #default="{row,$index}">
                <el-input v-if="editIndex.row?.id === item.id && $index === editIndex.index" v-model="row.content" />
                <span v-else>{{row.content}}</span>
              </template>
            </el-table-column>
            <el-table-column label="主要结论" prop="report">
              <template #default="{row,$index}">
                <el-input v-if="editIndex.row?.id === item.id && $index === editIndex.index" v-model="row.report" />
                <span v-else>{{row.report}}</span>
              </template>
            </el-table-column>
            <el-table-column label="评价" prop="rate">
              <el-table-column label="主要结论" prop="report">
              <template #default="{row,$index}">
                <el-input v-if="editIndex.row?.id === item.id && $index === editIndex.index" v-model="row.rate" />
                <span v-else>{{row.rate}}</span>
              </template>
            </el-table-column>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{row,$index}">
                <el-button type="danger" @click="delRow(item,$index)" size="small">删除</el-button>
                <el-button type="warning" @click="editRow(item,$index)" size="small">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
          <template #footer>
            <el-button type="primary" @click="addRow(item)">新建行</el-button>
            <el-button type="success" @click="saveRow(item)">保存</el-button>
          </template>
        </el-card>
      </el-collapse-item>
   </el-collapse>
    <el-empty v-if="data.length === 0"></el-empty>
    <template #footer>
      <el-button @click="fetchData">加载更多</el-button>
      <el-button type="success" @click="show = true">新建报告</el-button>
    </template>
  </el-card>
  <el-dialog v-model="show">
    <create-report-form></create-report-form>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
