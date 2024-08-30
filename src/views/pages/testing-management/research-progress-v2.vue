<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  createExperimentSchemeHasExperimentProcesses, deleteExperimentSchemeHasExperimentProcesses,
  getExperimentSchemeHasExperimentProcesses, updateExperimentSchemeHasExperimentProcesses
} from '@/apis/experimentScheme'
import type { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import type {
  ExperimentProcess,
  ExperimentSchemeHasExperimentProcess,
  ExperimentSchemeProcess
} from '@/apis/experimentScheme/types'

const totalProducts = ref(0)
const itemsPerPage = ref(10)
const page = ref(1)
const data = ref<ExperimentSchemeHasExperimentProcess[]>([])
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
    const response = await getExperimentSchemeHasExperimentProcesses({
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

const submit = (e:FormDataEvent) => {
  if(e.target){
    const formData = new FormData(e.target as HTMLFormElement)
    const data:ExperimentProcess = {
      completeness: Number(formData.get("completeness")),
      conclusion: formData.get("conclusion") as string,
      experiment_scheme: Number(formData.get("experiment_scheme")),
      weight: Number(formData.get("weight")),
      title: formData.get("title") as string,
      parent: Number(formData.get('parent'))
    }
    createExperimentSchemeHasExperimentProcesses(data).then(res=>{
      fetchData()
    })
  }
  return false
}

const count = (items:ExperimentProcess[]) => {
  let res = 0
  let res2 = 0
  items.map(i=>{
    res += i.weight
    res2 += i.completeness
  })
  return [res,res2]
}

const experimentProcess = ref<ExperimentProcess>({
  completeness: 0,
  conclusion: '',
  title: '',
  weight: 0,
  id:null,
})
const show = ref(false)

const submitForm = () => {
  updateExperimentSchemeHasExperimentProcesses(experimentProcess.value).then(()=>{
    fetchData()
  })
}
const edit = (row:ExperimentProcess) => {
  experimentProcess.value = row
  show.value = true
}

const del = (row:ExperimentProcess) => {
  deleteExperimentSchemeHasExperimentProcesses(row).then(()=>{
    fetchData()
  })
}

</script>

<template>
  <div class="tables">
    <el-card v-for="item in data" :key="item.id" :header="item.experiment_name">
      <el-table
        :data="item.experiment_process"
        :tree-props="{ children: 'children' }"
        row-key="id"
        border
        default-expand-all
      >
        <el-table-column width="250px" label="内容" prop="title"></el-table-column>
        <el-table-column label="主要结论" prop="conclusion"></el-table-column>
        <el-table-column width="120px" label="权重">
          <template #header>
            <el-text :type="count(item.experiment_process)[0] !== 100 ? 'danger' : 'primary'">权重 {{count(item.experiment_process)[0] - 100}}</el-text>
          </template>
          <template #default="{row}">
            <el-text>{{row.weight}}%</el-text>
          </template>
        </el-table-column>
        <el-table-column width="120px" label="完成度">
          <template #header>
            <el-text :type="count(item.experiment_process)[1] !== 100 ? 'danger' : 'primary'">完成度 {{count(item.experiment_process)[1] -100}}</el-text>
          </template>
          <template #default="{row}">
            <el-text>{{row.completeness}}%</el-text>
          </template>
        </el-table-column>
        <el-table-column width="200px" label="操作">
          <template #default="{row}">
            <el-button size="small" type="primary" @click="edit(row)">修改</el-button>
            <el-button size="small" type="danger" @click="del(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-collapse>
          <el-collapse-item title="新建">
            <el-form inline @submit.prevent="submit" label-width="120px" ref="experimentForm">
              <el-input type="hidden" name="experiment_scheme" :model-value="item.id"></el-input>
              <el-form-item label="标题">
                <input name="title"/>
              </el-form-item>
              <el-form-item label="父级进度">
                <select style="width: 200px" name="parent">
                  <option :value="null" >请选择父级进度</option>
                  <option v-for="process in item.add_experiment_process" :key="process.id!" :value="process.id">{{process.title}}</option>
                </select>
              </el-form-item>
              <el-form-item label="结论">
                <textarea name="conclusion"/>
              </el-form-item>
              <el-form-item label="权重" >
                <input type="number" name="weight" :min="0" :max="100"/>
              </el-form-item>
              <el-form-item label="完成度" >
                <input name="completeness" type="number" :min="0" :max="100" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" native-type="submit">提交</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </template>
    </el-card>
    <el-dialog v-model="show">
      <el-form
        :model="experimentProcess"
        label-width="120px"
      >
        <el-input type="hidden" v-model="experimentProcess.id"></el-input>
        <el-form-item label="标题" prop="title">
          <el-input v-model="experimentProcess.title"></el-input>
        </el-form-item>
        <el-form-item label="结论" prop="conclusion">
          <el-input type="textarea" v-model="experimentProcess.conclusion"></el-input>
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input-number v-model="experimentProcess.weight" :min="0" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="完整性" prop="completeness">
          <el-input-number v-model="experimentProcess.completeness" :min="0" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">

.tables{
  display: flex;
  flex-direction: column;
  gap: 10px;
}

</style>
