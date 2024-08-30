<template>
  <el-table :data="data" style="width: 100%">
    <el-table-column prop="id" label="ID" width="80"></el-table-column>
    <el-table-column prop="experiment_scheme" label="方案编制人" width="180">
      <template #default="{row}">
        {{row.experiment_scheme.creator.username}} {{row.experiment_scheme.creator.first_name}}
      </template>
    </el-table-column>
    <el-table-column prop="done_work" label="实验内容"></el-table-column>
    <el-table-column prop="worker" label="完成人">
      <template #default="{row}">
        <div style="display: flex;flex-direction: row;gap: 4px;flex-wrap: wrap">
          <el-tag v-for="or in row.worker">{{or.username}} {{or.first_name}}</el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="created_at" label="完成时间"></el-table-column>
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

    <el-card v-loading="loading" style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="实验方案" prop="experiment_scheme">
          <ElSelectV2
            v-model="form.experiment_scheme"
            filterable
            remote
            :options="schemes"
            placeholder="请选择实验方案"
            :props="{
              label: 'experiment_name',
              value: 'id'
            }"
            :remote-method="remoteMaterialsMethod"
            :loading="schemeLoading"
            style="width: 240px; margin-right: 16px; vertical-align: middle"
          >
            <template #default="{ item }">
              <div class="flex items-center">
                <el-tag type="primary" style="margin-right: 8px" size="small"
                  >{{ item.experiment_number }}:{{ item.experiment_name }}</el-tag
                >
                <span>{{ item.experiment_name }}</span>
              </div>
            </template>
            <template #label="{ label, value }">
              <span>{{ label }}: </span>
              <span style="font-weight: bold">{{ value }}</span>
            </template>
          </ElSelectV2>
        </el-form-item>
        <el-form-item label="完成内容" prop="done_work">
          <el-input v-model="form.done_work"></el-input>
        </el-form-item>
        <el-form-item label="完成人" prop="worker">
          <ElSelectV2
            v-model="workers"
            filterable
            remote
            multiple
            :options="users"
            placeholder="请选择完成人"
            :props="{
              label: 'username',
              value: 'id'
            }"
            :remote-method="remoteWorkerMethod"
            :loading="workerLoading"
            style="width: 240px; margin-right: 16px; vertical-align: middle"
          >
            <template #default="{ item }">
              <div class="flex items-center">
                <el-tag type="primary" style="margin-right: 8px" size="small"
                  >{{ item.username }}:{{ item.first_name }}</el-tag
                >
                <span>{{ item.first_name }}</span>
              </div>
            </template>
            <template #label="{ label, value }">
              <span>{{ label }}: </span>
              <span style="font-weight: bold">{{ value }}</span>
            </template>
          </ElSelectV2>
        </el-form-item>
        <el-form-item label="存储时间" prop="storage_time">
          <el-date-picker
            v-model="form.create_at"
            type="datetime"
            placeholder="选择日期时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { createWorker, getWorker, getWorkers } from '@/apis/worker'
import type { Equipment } from '@/apis/equipment/types.js'
import { getEquipments } from '@/apis/equipment/index.js'
import type { AxiosError } from 'axios'
import { ElMessage, ElSelectV2 } from 'element-plus'
import { getMaterials } from '@/apis/material'
import type { Material } from '@/apis/material/types'
import { createExperimentScheme, getExperimentScheme, getExperimentSchemes } from '@/apis/experimentScheme'
import type { ExperimentScheme } from '@/apis/experimentScheme/types'
import type { User } from '@/apis/users/types'
import { getUsers } from '@/apis/users' // 导入前面定义的getWorkers函数

const loading = ref(false)
const totalProducts = ref(0)
const itemsPerPage = ref(10)
const page = ref(1)
const data = ref<Worker[]>([])
const schemeLoading = ref(false)
const schemes = ref<ExperimentScheme[]>([])
const workers = ref<number[]>([])
const users = ref<User[]>([])
const workerLoading = ref(false)
const formRef = ref()
const search = ref({
  search: ''
})
const form = reactive<Worker>({
  experiment_scheme: '',
  done_work: '',
  worker:[]
});
watch(
  () => workers,
  () => {
    form.worker = workers.value.map((i) => {
      let idx = users.value.findIndex((m) => m.id === i)
      if (idx === -1) {
        idx = form.worker.findIndex((m) => m === i)
      }
      return users.value[idx]
    })
  },
  {
    deep: true
  }
)

const rules = reactive({
  experiment_scheme: [{ required: true, message: 'Please input the experiment scheme', trigger: 'blur' }],
  done_work: [{ required: true, message: 'Please input the done work', trigger: 'blur' }]
});
const remoteMaterialsMethod = (query: string) => {
  if (query !== '') {
    schemeLoading.value = true
    getExperimentSchemes({
      page_size: 1000,
      keyword: query
    })
      .then((res) => {
        schemes.value = res.data
      })
      .finally(() => {
        schemeLoading.value = false
      })
  } else {
    schemes.value = []
  }
}

const remoteWorkerMethod= (query: string) => {
  if (query !== '') {
    workerLoading.value = true
    getUsers({
      page_size: 1000,
      keyword: query
    })
      .then((res) => {
        users.value = res.data
      })
      .finally(() => {
        workerLoading.value = false
      })
  } else {
    users.value = []
  }
}
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
    const response = await getWorkers({
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

const submitForm = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      createWorker({
        ...form,
        worker: form.worker.map(i=>i.id)
      })
        .then((res) => {
          ElMessage.success('新建成功')
        })
        .catch((err) => {
          ElMessage.success('新建失败:' + err.toString())
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

</script>