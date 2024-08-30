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

const changeGroupCount = async (n: number, oldVal: number) => {
  if (n < oldVal) {
    await ElMessageBox({
      title: '危险！',
      message: '默认删除最后一组，不可恢复！！！',
      callback(value: string, action: Action) {
        if (value === 'confirm') {
          const d = oldVal - n
          experimentData.value.data_entry.data.map((_, c_idx: number) => {
            _.tables.map((__, t_idx: number) => {
              __.groups.map((___, g_idx: number) => {
                for (let i = 0; i < d; i++) {
                  delete ___.rows[oldVal - i]
                }
              })
            })
          })
          experimentData.value.data_entry.group_count = n
        }
      }
    })
  } else if (n > oldVal) {
    experimentData.value.data_entry.data.map((_, c_idx: number) => {
      _.tables.map((__, t_idx: number) => {
        __.groups.map((___, g_idx: number) => {
          for (let r = 1; r <= n; r++) {
            const row = ___.rows[r]
            if (!row) {
              const newRow = {}
              for (let c = 1; c <= ___.col_count; c++) {
                newRow[c] = {
                  value: 1
                }
              }
              ___.rows[r] = newRow
            }
          }
        })
      })
    })
    experimentData.value.data_entry.group_count = n
  }
}

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

const save = async () => {
  loading.value = true
  updateExperimentData(experimentData.value)
    .then((res) => {
      ElMessage.success('保存成功')
    })
    .catch((err: AxiosError) => {
      console.log(err.response)
      if (err.response.status === 404) {
        loading.value = true
        createExperimentData(experimentData.value)
          .then((res) => {
            ElMessage.success('保存成功')
          })
          .catch((err: AxiosError) => {
            ElMessage.error('保存失败: ' + err.toString())
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        ElMessage.error('保存失败: ' + err.toString())
      }
    })
    .finally(() => {
      loading.value = false
    })
}

onUnmounted(() => {
  save()
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

const inputData = (
  e: number,
  container_idx: number,
  table_idx: number,
  group_idx: number,
  row_index: number,
  col_idx: number
) => {
  experimentData.value.data_entry.data[container_idx].tables[table_idx].groups[group_idx].rows[
    row_index
  ][col_idx].value = e
}

const importantData = (
  container_idx: number,
  table_idx: number,
  group_idx: number,
  row_index: number,
  col_idx: number
) => {
  const d =
    experimentData.value.data_entry.data[container_idx].tables[table_idx].groups[group_idx].rows[
      row_index
    ][col_idx]
  if (!d || d.type === 'default') {
    d.type = 'important'
  } else {
    d.type = 'default'
  }
}

function addGroupTable(idx: number, grp: ExperimentDataGroup) {
  const d = _.cloneDeep(grp.tables[0])
  experimentData.value.data_entry.data[idx].tables.push(d)
}

function delGroupTable(c_idx: number, t_index: number) {
  experimentData.value.data_entry.data[c_idx].tables.splice(t_index, 1)
}

watch(
  () => experimentData.value.data_entry,
  (value, oldValue, onCleanup) => {},
  {
    deep: true
  }
)

const newLabel = ref('新组')

const newContainer = () => {
  const d = _.cloneDeep(experimentData.value.data_entry.data[0])
  d.title = newLabel.value
  experimentData.value.data_entry.data.push(d)
}

const delGroup = (idx: number) => {
  experimentData.value.data_entry.data.splice(idx, 1)
}

const changeColCount = (
  val: number,
  oldVal: number,
  c_idx: number,
  g_idx: number,
  row_idx: number
) => {
  if (val > oldVal) {
    const c = experimentData.value.data_entry.data[c_idx].tables[g_idx].groups[row_idx]
    for (let i = 1; i <= val; i++) {
      if (!c.rows[i]) {
        c.rows[i] = {
          [i]: {
            value: i
          }
        }
      }
    }
  }
  experimentData.value.data_entry.data[c_idx].tables[g_idx].groups[row_idx].col_count = val
}

const addGroup = (c_idx: number, t_idx: number) => {
  const rows: { [key in number]: ExperimentDataTableDataCol } = {}
  for (let i = 1; i <= experimentData.value.data_entry.group_count; i++) {
    rows[i] = (function () {
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
  experimentData.value.data_entry.data[c_idx].tables[t_idx].groups.push({
    label:
      '第' + (experimentData.value.data_entry.data[c_idx].tables[t_idx].groups.length + 1) + '周',
    col_count: 3,
    rows
  })
}

const delTGroup = (c_idx: number, t_idx: number, g_idx: number) => {
  experimentData.value.data_entry.data[c_idx].tables[t_idx].groups.splice(g_idx, 1)
}
</script>

<template>
  <div class="c" style="flex-direction: row">
    <el-card>
      <el-row>
        <el-button type="primary" @click="$router.go(-1)">返回</el-button>
        <el-button
          type="success"
          @click="$router.push({ name: 'test-data-preview', params: { id: props.id } })"
          >预览</el-button
        >
      </el-row>
      <el-form style="margin-top: 5px">
        <el-form-item label="实验名称">
          <el-input disabled :model-value="experiment_scheme?.experiment_name" />
        </el-form-item>
        <el-form-item label="实验组数">
          <el-input-number
            :min="0"
            @input="(e: number) => changeGroupCount(e, experimentData.data_entry.group_count)"
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
        <el-form-item>
          <el-button @click="save" type="success">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card header="创建新的组">
      <el-form>
        <el-form-item label="标签">
          <el-input v-model="newLabel" />
        </el-form-item>
        <el-form-item>
          <el-button @click="newContainer" type="success">创建</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card header="注意事项">
      <el-form>
        <el-form-item label="1">
          <el-text type="danger" size="small">返回按钮自动保存</el-text>
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
      <el-button size="small" @click="addGroupTable(container_idx, group)" type="primary"
        >新建组内表格</el-button
      >
      <el-button
        v-if="experimentData.data_entry.data.length > 1"
        size="small"
        @click="delGroup(container_idx)"
        type="danger"
        >删除组</el-button
      >
    </div>
    <div class="t">
      <table border="1" v-for="(table, table_idx) in group.tables">
        <thead>
          <tr>
            <th>序号</th>
            <th>说明</th>
            <th class="form-td" :colspan="getColspan(table)">
              <el-form-item label="指标">
                <el-input style="width: 150px" v-model="table.name" />
                <el-button
                  style="margin-left: 10px"
                  size="small"
                  type="danger"
                  v-if="group.tables.length > 1"
                  @click="delGroupTable(container_idx, table_idx)"
                  >删除当前表格</el-button
                >
              </el-form-item>
            </th>
          </tr>
          <tr>
            <th></th>
            <th>
              <el-button
                @click="() => addGroup(container_idx, table_idx)"
                style="width: 100%"
                size="small"
                type="success"
                >添加（周）</el-button
              >
            </th>
            <th
              class="form-td"
              :key="idx"
              v-for="(head, idx) in table.groups"
              :colspan="head.col_count + 2"
            >
              <el-form style="display: flex; align-items: center; flex-wrap: wrap" inline>
                <el-form-item style="margin: 0" label="日期标签">
                  <el-input style="width: 100px" v-model="head.label" />
                </el-form-item>
                <el-form-item style="margin: 0" label="数据列数">
                  <el-input-number
                    style="width: 100px"
                    @input="
                      (e: number) =>
                        changeColCount(e, head.col_count, container_idx, table_idx, idx)
                    "
                    :controls="false"
                    :min="1"
                    :precision="0"
                    :model-value="head.col_count"
                  />
                </el-form-item>
                <el-form-item v-if="table.groups.length > 1">
                  <el-button
                    type="danger"
                    size="small"
                    @click="delTGroup(container_idx, table_idx, idx)"
                    >删除（周）</el-button
                  >
                </el-form-item>
              </el-form>
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
                <el-input-number
                  style="width: 100%"
                  :class="`${grp.rows[row_index][head_idx].type === 'important' ? 'important' : ''}`"
                  :controls="false"
                  :precision="0"
                  @input="
                    (e: number) =>
                      inputData(e, container_idx, table_idx, group_idx, row_index, head_idx)
                  "
                  @dblclick="
                    importantData(container_idx, table_idx, group_idx, row_index, head_idx)
                  "
                  :model-value="grp.rows[row_index][head_idx].value"
                />
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
