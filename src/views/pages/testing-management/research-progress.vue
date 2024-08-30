<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getExperimentSchemesProcess } from '@/apis/experimentScheme'
import type { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import dayjs, { Dayjs } from 'dayjs'
import api from '@/apis/instance'
import type { ExperimentSchemeProcess } from '@/apis/experimentScheme/types'

const totalProducts = ref(0)
const itemsPerPage = ref(10)
const page = ref(1)
const data = ref<ExperimentSchemeProcess[]>([])
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
    const response = await getExperimentSchemesProcess({
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

function getDayjs(date: { day: number; month: number; year: number }): Dayjs {
  return dayjs(`${date.year}-${date.month}-${date.day}`)
}

function findCoefficients() {
  let a, b, c
  a = 7 / 6
  b = 7 - 3 * a
  c = -a - b
  return [a, b, c]
}

function calculateOutput(input: number): number {
  const coefficients = findCoefficients()
  const a = coefficients[0]
  const b = coefficients[1]
  const c = coefficients[2]
  return a * input * input + b * input + c
}

function changeStatus(r) {
  api.post('experiment-schemes-process/', {
    id: r.id,
    process_status_list: r.process_status_list
  })
}
</script>

<template>
  <div class="t">
    <table border="1" style="border-collapse: collapse">
      <thead>
        <tr>
          <th rowspan="2">试验编号</th>
          <th rowspan="2">试验名称</th>
          <th rowspan="2">组号</th>
          <th colspan="1">-1d</th>
          <th colspan="1">0d</th>
          <th colspan="2">7d</th>
          <th colspan="2">14d</th>
          <th colspan="2">28d</th>
        </tr>
        <tr>
          <th>闷土</th>
          <th>制样</th>
          <th>泡水</th>
          <th>测试</th>
          <th>泡水</th>
          <th>测试</th>
          <th>泡水</th>
          <th>测试</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data">
          <td>{{ row.experiment_number }}</td>
          <td>{{ row.experiment_name }}</td>
          <td v-if="row.experiment_data.data_entry">
            共{{ row.experiment_data.data_entry.group_count }}组
          </td>
          <td v-else>实验数据（空）</td>
          <template v-for="i in 4">
            <td
              v-if="row.experiment_data.data_entry"
              :class="`question-${row.process_status_list[`${1 + 2 * (i - 1)}`].question} date-${row.process_status_list[`${1 + 2 * (i - 1)}`].date}`"
              class="data-td"
            >
              <el-popover placement="right" :width="100" trigger="click">
                <template #reference>
                  {{
                    getDayjs(row.experiment_data.entry_date_schema)
                      .add(calculateOutput(i), 'day')
                      .subtract(1, 'day')
                      .format('YYYY/MM/DD')
                  }}
                </template>
                <el-select
                  v-model="row.process_status_list[`${1 + 2 * (i - 1)}`].question"
                  placeholder="Select"
                  size="small"
                  default-first-option
                  @change="changeStatus(row)"
                >
                  <el-option class="question-1" label="没有问题" value="1" />
                  <el-option class="question-2" label="有问题" value="2" />
                  <el-option class="question-3" label="手动确认过日期" value="3" />
                </el-select>
                <el-select
                  v-model="row.process_status_list[`${1 + 2 * (i - 1)}`].date"
                  placeholder="Select"
                  size="small"
                  default-first-option
                  @change="changeStatus(row)"
                >
                  <el-option class="date-1" label="已经过去了" value="1" />
                  <el-option class="date-2" label="今天要做的" value="2" />
                </el-select>
              </el-popover>
            </td>
            <td class="data-td null" v-else>实验数据（空）</td>
            <td
              v-if="row.experiment_data.data_entry"
              :class="`question-${row.process_status_list[`${2 + 2 * (i - 1)}`].question} date-${row.process_status_list[`${2 + 2 * (i - 1)}`].date}`"
              class="data-td"
            >
              <el-popover placement="right" :width="100" trigger="click">
                <template #reference>
                  {{
                    getDayjs(row.experiment_data.entry_date_schema)
                      .add(calculateOutput(i), 'day')
                      .format('YYYY/MM/DD')
                  }}
                </template>
                <el-select
                  v-model="row.process_status_list[`${2 + 2 * (i - 1)}`].question"
                  placeholder="Select"
                  size="small"
                  default-first-option
                  @change="changeStatus(row)"
                >
                  <el-option class="question-1" label="没有问题" value="1" />
                  <el-option class="question-2" label="有问题" value="2" />
                  <el-option class="question-3" label="手动确认过日期" value="3" />
                </el-select>
                <el-select
                  v-model="row.process_status_list[`${2 + 2 * (i - 1)}`].date"
                  placeholder="Select"
                  size="small"
                  default-first-option
                  @change="changeStatus(row)"
                >
                  <el-option class="date-1" label="已经过去了" value="1" />
                  <el-option class="date-2" label="今天要做的" value="2" />
                </el-select>
              </el-popover>
            </td>
            <td class="data-td null" v-else>实验数据（空）</td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.t {
  width: 100%;
  overflow-x: auto; /* 允许x轴滚动 */
  white-space: nowrap; /* 防止内容换行 */
  display: flex;
  flex-direction: column;
  gap: 10px;

  table {
    width: auto; /* 允许表格宽度自适应内容 */
    border-collapse: collapse;

    td,
    th {
      min-width: 100px; /* 设置最小宽度 */
      max-width: 120px; /* 设置最大宽度 */
      word-break: break-all; /* 如果内容过长，允许在单词内部换行 */
      overflow: hidden; /* 隐藏超出部分 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /* 单元格内不换行 */
      text-align: center;
    }

    .question-1 {
      font-weight: 100;
    }

    .question-2 {
      color: #ff0000;
    }

    .question-3 {
      font-weight: bold;
    }

    .date-1 {
      background: #00c154;
    }

    .date-2 {
      background: #a9ff7d;
    }

    .null {
      color: #ff0000;
    }
  }
}
</style>
