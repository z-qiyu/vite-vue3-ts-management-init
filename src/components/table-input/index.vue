<script setup lang="ts">
import type { TableInputEmits, TableInputProps } from '@/components/table-input/types'
import { computed, ref, watch } from 'vue'

const props = withDefaults(defineProps<TableInputProps>(), {
  readonly(props) {
    return false
  }
})

const emits = defineEmits<TableInputEmits>()

const initRows = () => {
  console.log(props.modelValue)
  if (Object.keys(props.modelValue).length > 0) {
    return Object.keys(props.modelValue[Object.keys(props.modelValue)[0]])
  }
  return [] as string[]
}

const rows = ref<string[]>(initRows())

watch(
  () => props.cols,
  () => {
    console.log(props.cols)
  },
  {
    deep: true
  }
)

const addHeader = () => {
  let k = '方案-' + (rows.value.length + 1)
  if (rows.value.findIndex((i) => k === i) > -1) {
    k = '方案-' + Date.now()
  }
  rows.value.push(k)
  const newData = { ...props.modelValue }
  for (let item_key in newData) {
    newData[item_key][k] = '请输入'
  }
  emits('update:modelValue', newData)
}

const delHeader = (k: string) => {
  const idx = rows.value.findIndex((i) => i === k)
  rows.value.splice(idx, 1)
  const newData = { ...props.modelValue }
  for (let item_key in newData) {
    delete newData[item_key][k]
  }
  emits('update:modelValue', newData)
}

const changeItem = (e: string, item_key: string, row_key: string) => {
  const newData = { ...props.modelValue }
  newData[item_key][row_key] = e
  emits('update:modelValue', newData)
}

const changeRowHeader = (e: string, row_key: string) => {
  const index = rows.value.findIndex((i) => i === row_key)
  rows.value[index] = e
  const newData = { ...props.modelValue }
  for (let colKey in newData) {
    newData[colKey][e] = newData[colKey][row_key]
    delete newData[colKey][row_key]
  }
  console.log(newData)
  emits('update:modelValue', newData)
}
</script>

<template>
  <div style="max-height: 400px">
    <table>
      <thead>
        <tr>
          <th></th>
          <th v-for="(i, k) in modelValue">{{ k }}</th>
          <th v-if="!readonly">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(c, row_key) in rows" :key="row_key">
          <th>
            <el-input
              :readonly="readonly"
              size="small"
              style="width: 100px"
              :modelValue="c"
              @input="(e: string) => changeRowHeader(e, c)"
            />
          </th>
          <td v-for="(r, key) in modelValue" :key="key">
            <el-input
              :readonly="readonly"
              :modelValue="r[c]"
              @input="(e: string) => changeItem(e, key, c)"
            />
          </td>
          <td v-if="!readonly">
            <el-button
              :disabled="readonly"
              @click="delHeader(c)"
              circle
              type="danger"
              icon="Minus"
            ></el-button>
          </td>
        </tr>
      </tbody>
    </table>
    <el-row v-if="!readonly" class="r">
      <el-button @click="addHeader" circle type="primary" icon="Plus"></el-button>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;

  th,
  td {
    text-align: left;
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;

    &:first-child {
      width: 150px;
    }

    &.header {
      background-color: #f8f9fa;
      font-weight: bold;
      border-bottom: 2px solid #dee2e6;
    }
  }

  th {
    background-color: #f8f9fa;
    font-weight: bold;
    border-bottom: 2px solid #dee2e6;
  }

  tr:nth-child(even) {
    background-color: #f9fafb;
  }

  .el-input {
    width: 100%;

    input {
      border-radius: 4px;
      padding: 0.375rem 0.75rem;
      line-height: 1.5;
    }
  }

  .el-button {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.25rem;
  }

  .el-icon {
    font-size: 1rem;
  }

  .r {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }
}
</style>
