<script setup lang="ts">
import type {
  ExperimentData,
  ExperimentDataGroup,
  ExperimentDataTable,
  ExperimentDataTableData,
  ExperimentDataTableDataCol
} from '@/apis/experimentData/types'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores'
import {
  createExperimentData,
  getExperimentData,
  updateExperimentData
} from '@/apis/experimentData'
import type { ExperimentScheme } from '@/apis/experimentScheme/types'
import { getExperimentScheme } from '@/apis/experimentScheme'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus/es/components/message-box/src/message-box.type'
import _ from 'lodash'
import type { AxiosError } from 'axios'

const user = useUserStore()
const props = defineProps<{ id: number }>()
const loading = ref(false)
const experiment_scheme = ref<ExperimentScheme>()

const getBackData: () => ExperimentDataTableData[] = () =>
  ['7天饱和', '7天未饱和', '14天饱和', '14天未饱和', '28天饱和', '28天未饱和'].map((i) => {
    return {
      label: i,
      col_count: 3,
      rows: {
        1: {
          1: {
            value: 1.0
          },
          2: {
            value: 2.0
          },
          3: {
            value: 3.0
          }
        }
      }
    }
  })

const experimentData = ref<ExperimentData>({
  data_entry: {
    group_count: 1,
    data: [
      {
        title: '保养前',
        tables: [
          {
            name: '重量',
            groups: [
              {
                label: '数据',
                col_count: 18,
                rows: {
                  1: (function () {
                    const n = 18 // 这里定义了最大的数字
                    const obj: Record<number, { value: number }> = {}

                    for (let i = 1; i <= n; i++) {
                      obj[i] = {
                        value: 1
                      }
                    }
                    return obj
                  })()
                }
              }
            ]
          }
        ]
      },
      {
        title: '保养后',
        tables: [
          {
            name: '重量',
            groups: getBackData()
          }
        ]
      }
    ]
  },
  entry_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  entry_person: user.userInfo.id,
  experiment_scheme: Number(props.id),
  id: Number(props.id)
})

onMounted(() => {
  loading.value = true
  getExperimentData(props.id)
    .then((res) => {
      experimentData.value = res.data
      experimentData.value.experiment_scheme = Number(props.id)
      experimentData.value.entry_person = user.userInfo.id
    })
    .finally(() => {
      getExperimentScheme(props.id)
        .then((res) => {
          experiment_scheme.value = res.data
        })
        .finally(() => {
          loading.value = false
        })
    })
})

function average(numbers: { value: number }[]) {
  const sum = numbers.reduce((acc, val) => {
    return acc + val.value
  }, 0)
  return sum ? sum / numbers.length : 0
}

function variance(numbers: { value: number }[]) {
  const avg = average(numbers)
  const squareDiffs = numbers.map((num) => ({ value: Math.pow(num.value - avg, 2) }))
  return average(squareDiffs)
}

function getColspan(table: ExperimentDataTable): number {
  let res = 0
  table.groups.map((i) => {
    res += i.col_count + 2
  })
  return res
}

function changeGroupCount(e: number) {
  experimentData.value.data_entry.group_count = e
}
</script>

<template>
  <div class="c">
    <el-card>
      <el-row>
        <el-button type="primary" @click="$router.go(-1)">返回</el-button>
      </el-row>
      <el-form disabled style="margin-top: 5px">
        <el-form-item label="实验名称">
          <el-input :model-value="experiment_scheme?.experiment_name" />
        </el-form-item>
        <el-form-item label="实验组数">
          <el-input-number
            :min="0"
            @input="(e: number) => changeGroupCount(e)"
            :model-value="experimentData.data_entry.group_count"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="实验启动时间">
          <el-date-picker
            v-model="experimentData.entry_date"
            type="datetime"
            placeholder="选择日期时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <div
    class="c"
    :key="group.title"
    v-for="(group, container_idx) in experimentData.data_entry.data"
  >
    <div class="h">
      <el-text style="align-self: unset" size="large" type="success">{{ group.title }}</el-text>
    </div>
    <div class="t">
      <table border="1" v-for="(table, table_idx) in group.tables">
        <thead>
          <tr>
            <th>序号</th>
            <th>说明</th>
            <th class="form-td" :colspan="getColspan(table)">
              <el-text>{{ table.name }}</el-text>
            </th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th
              class="form-td"
              :key="idx"
              v-for="(head, idx) in table.groups"
              :colspan="head.col_count + 2"
            >
              <el-text>{{ head.label }}</el-text>
            </th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <template v-for="thead_group in table.groups">
              <th v-for="(head_idx, k) in thead_group.col_count">
                {{ k + 1 }}
              </th>
              <th>平均值</th>
              <th>标准差</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row_index in experimentData.data_entry.group_count">
            <td style="text-align: center">{{ row_index }}</td>
            <td></td>
            <template v-for="(grp, group_idx) in table.groups">
              <td v-for="head_idx in grp.col_count">
                <el-text
                  :class="`${grp.rows[row_index][head_idx].type === 'important' ? 'important' : ''}`"
                  >{{ grp.rows[row_index][head_idx].value }}</el-text
                >
              </td>
              <td>{{ average(Object.values(grp.rows[row_index])).toFixed(2) }}</td>
              <td>{{ variance(Object.values(grp.rows[row_index])).toFixed(2) }}</td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
.important {
  input {
    color: #ff0000 !important;
  }
}
</style>

<style scoped lang="scss">
.h {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
}

.c {
  width: calc(100% - 20px);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
}

.form-td {
  > div {
    margin: 0 0 0 10px;
  }
}

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
      min-width: 80px; /* 设置最小宽度 */
      max-width: 80px; /* 设置最大宽度 */
      word-break: break-all; /* 如果内容过长，允许在单词内部换行 */
      overflow: hidden; /* 隐藏超出部分 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /* 单元格内不换行 */
      text-align: center;
    }
  }
}
</style>
