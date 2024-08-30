<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Equipment } from '@/apis/equipment/types'
import type { Supplier } from '@/apis/supplier/types'
import { ElMessage, ElSelectV2 } from 'element-plus'
import { createEquipment } from '@/apis/equipment'
import { getSuppliers } from '@/apis/supplier'

const equipmentFormRef = ref(null)
const suppliers = ref<Supplier[]>([])
const supplierLoading = ref(false)
const equipment = reactive<Equipment>({
  equipment_id: 0,
  name: '',
  specification: '',
  quantity: 0,
  supplier: null,
  purchaser: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  specification: [{ required: true, message: '请输入规格描述', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'change' }],
  supplier: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  purchaser: [{ required: true, message: '请输入购买者', trigger: 'blur' }]
}

const remoteSuppliersMethod = (query: string) => {
  if (query !== '') {
    supplierLoading.value = true
    getSuppliers({
      page_size: 1000,
      keyword: query
    })
      .then((res) => {
        suppliers.value = res.data
      })
      .finally(() => {
        supplierLoading.value = false
      })
  } else {
    suppliers.value = []
  }
}

const submitForm = (formName: string) => {
  ;(equipmentFormRef.value as any).validate((valid: boolean) => {
    if (valid) {
      createEquipment(equipment)
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

const resetForm = (formName: string) => {
  ;(equipmentFormRef.value as any).resetFields()
}
</script>

<template>
  <el-form :model="equipment" :rules="rules" ref="equipmentFormRef" label-width="120px">
    <el-form-item label="设备ID" prop="equipment_id">
      <el-input v-model="equipment.equipment_id" disabled></el-input>
    </el-form-item>
    <el-form-item label="设备名称" prop="name">
      <el-input v-model="equipment.name"></el-input>
    </el-form-item>
    <el-form-item label="规格描述" prop="specification">
      <el-input v-model="equipment.specification"></el-input>
    </el-form-item>
    <el-form-item label="数量" prop="quantity">
      <el-input-number v-model="equipment.quantity"></el-input-number>
    </el-form-item>
    <el-form-item label="供应商" prop="supplier">
      <ElSelectV2
        v-model="equipment.supplier"
        filterable
        remote
        :options="suppliers"
        placeholder="请选择供应商"
        :props="{
          label: 'company_name',
          value: 'supplier_id'
        }"
        :remote-method="remoteSuppliersMethod"
        :loading="supplierLoading"
        style="width: 240px; margin-right: 16px; vertical-align: middle"
      >
        <template #default="{ item }">
          <div class="flex items-center">
            <el-tag type="primary" style="margin-right: 8px" size="small"
              >{{ item.supplier_id }}:{{ item.company_name }}</el-tag
            >
            <span>{{ item.company_name }}</span>
          </div>
        </template>
        <template #label="{ label, value }">
          <span>{{ label }}: </span>
          <span style="font-weight: bold">{{ value }}</span>
        </template>
      </ElSelectV2>
    </el-form-item>
    <el-form-item label="购买者" prop="purchaser">
      <el-input v-model="equipment.purchaser"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input type="textarea" v-model="equipment.description"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('equipmentFormRef')">提交</el-button>
      <el-button @click="resetForm('equipmentFormRef')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
