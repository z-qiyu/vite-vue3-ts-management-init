<script setup lang="ts">
import type { Material } from '@/apis/material/types'
import { reactive, ref } from 'vue'
import { createMaterial, getMaterial, getMaterials } from '@/apis/material'
import { ElMessage, ElSelectV2 } from 'element-plus'
import { createMaterialInOutRecord } from '@/apis/materialInOutRecord'
import { getSuppliers } from '@/apis/supplier'
import type { MaterialInOutRecord } from '@/apis/materialInOutRecord/types'
import dayjs from 'dayjs'

const materialInOutRecordFormRef = ref(null)
const materialLoading = ref(false)
const materials = ref<Material[]>([])

const materialInOutRecord = reactive<MaterialInOutRecord>({
  id: 0,
  material: null, // 初始化为空对象，等待选择
  quantity: 0,
  in_out_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  operator: '',
  remaining_amount: 0
})

const rules = {
  material: [{ required: true, message: '请选择材料', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'change' }],
  in_out_time: [{ required: true, message: '请选择操作时间', trigger: 'change' }],
  operator: [{ required: true, message: '请输入操作员', trigger: 'blur' }],
  remaining_amount: [{ required: true, message: '请输入剩余数量', trigger: 'change' }]
}

const submitForm = (formName: string) => {
  ;(materialInOutRecordFormRef.value as any).validate((valid: boolean) => {
    if (valid) {
      createMaterialInOutRecord(materialInOutRecord)
        .then((res) => {
          ElMessage.success('提交成功')
        })
        .catch((err) => {
          ElMessage.error('提交失败：' + err.token)
        })
    } else {
      console.log('error submit!!')
      return false
    }
  })
}
const remoteMaterialsMethod = (query: string) => {
  if (query !== '') {
    materialLoading.value = true
    getMaterials({
      page_size: 1000,
      keyword: query
    })
      .then((res) => {
        materials.value = res.data
      })
      .finally(() => {
        materialLoading.value = false
      })
  } else {
    materials.value = []
  }
}
const resetForm = (formName: string) => {
  ;(materialInOutRecordFormRef.value as any).resetFields()
}
</script>

<template>
  <el-form
    :model="materialInOutRecord"
    :rules="rules"
    ref="materialInOutRecordFormRef"
    label-width="120px"
  >
    <el-form-item label="材料" prop="material">
      <ElSelectV2
        v-model="materialInOutRecord.material"
        filterable
        remote
        :options="materials"
        placeholder="请选择材料"
        :props="{
          label: 'name',
          value: 'material_id'
        }"
        :remote-method="remoteMaterialsMethod"
        :loading="materialLoading"
        style="width: 240px; margin-right: 16px; vertical-align: middle"
      >
        <template #default="{ item }">
          <div class="flex items-center">
            <el-tag type="primary" style="margin-right: 8px" size="small"
              >{{ item.material_id }}:{{ item.name }}</el-tag
            >
            <span>{{ item.name }}</span>
          </div>
        </template>
        <template #label="{ label, value }">
          <span>{{ label }}: </span>
          <span style="font-weight: bold">{{ value }}</span>
        </template>
      </ElSelectV2>
    </el-form-item>
    <el-form-item label="数量" prop="quantity">
      <el-input-number
        v-model="materialInOutRecord.quantity"
        :min="0"
        :max="10000"
        label="数量"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="操作时间" prop="in_out_time">
      <el-date-picker
        v-model="materialInOutRecord.in_out_time"
        type="datetime"
        placeholder="选择日期时间"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="操作员" prop="operator">
      <el-input v-model="materialInOutRecord.operator"></el-input>
    </el-form-item>
    <el-form-item label="剩余数量" prop="remainingAmount">
      <el-input-number
        v-model="materialInOutRecord.remaining_amount"
        :min="0"
        :max="10000"
        label="剩余数量"
      ></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('materialInOutRecordFormRef')">提交</el-button>
      <el-button @click="resetForm('materialInOutRecordFormRef')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
