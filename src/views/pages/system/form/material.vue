<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage, ElSelectV2 } from 'element-plus'
import { createMaterial, updateMaterial } from '@/apis/material'
import type { Supplier } from '@/apis/supplier/types'
import { getExperimentPlans } from '@/apis/experimentPlan'
import { getSuppliers } from '@/apis/supplier'
import type { Material } from '@/apis/material/types'

const props = defineProps<{
  modelValue:Material
}>()

const emits = defineEmits(['update:modelValue']);

const materialFormRef = ref(null)
const suppliers = ref<Supplier[]>([])
const supplierLoading = ref(false)

const rules = {
  name: [{ required: true, message: '请输入材料名称', trigger: 'blur' }],
  chemical_name: [{ required: true, message: '请输入化学名称', trigger: 'blur' }],
  specification: [{ required: true, message: '请输入规格', trigger: 'blur' }],
  packaging_spec: [{ required: true, message: '请输入包装规格', trigger: 'blur' }],
  remaining_amount: [{ required: true, message: '请输入剩余数量', trigger: 'change' }],
  supplier: [{ required: true, message: '请输入供应商ID', trigger: 'change' }],
  purchaser: [{ required: true, message: '请输入购买者', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  price: [{ required: true, message: '请输入单价', trigger: 'change' }],
  shipping_cost: [{ required: true, message: '请输入运输成本', trigger: 'change' }],
  warning_limit: [{ required: true, message: '请输入库存警告阈值', trigger: 'change' }]
}

const submitForm = (formName: string) => {
  ;(materialFormRef.value as any).validate((valid: boolean) => {
    if (valid) {
      updateMaterial(props.modelValue)
        .then((res) => {
          ElMessage.success('更新成功')
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

const resetForm = (formName: string) => {
  ;(materialFormRef.value as any).resetFields()
}
</script>

<template>
  <el-form :model="props.modelValue" :rules="rules" ref="materialFormRef" label-width="150px">
    <el-form-item label="材料ID" prop="material_id">
      <el-input v-model="props.modelValue.material_id" disabled></el-input>
    </el-form-item>
    <el-form-item label="材料名称" prop="name">
      <el-input v-model="props.modelValue.name"></el-input>
    </el-form-item>
    <el-form-item label="化学名称" prop="chemical_name">
      <el-input v-model="props.modelValue.chemical_name"></el-input>
    </el-form-item>
    <el-form-item label="CAS编号" prop="cas_number" v-if="props.modelValue.cas_number !== null">
      <el-input v-model="props.modelValue.cas_number"></el-input>
    </el-form-item>
    <el-form-item label="保密">
      <el-switch v-model="props.modelValue.is_confidential"></el-switch>
    </el-form-item>
    <el-form-item label="保密代码" prop="confidential_code" v-if="props.modelValue.is_confidential">
      <el-input v-model="props.modelValue.confidential_code"></el-input>
    </el-form-item>
    <el-form-item label="规格" prop="specification">
      <el-input v-model="props.modelValue.specification"></el-input>
    </el-form-item>
    <el-form-item label="包装规格" prop="packaging_spec">
      <el-input v-model="props.modelValue.packaging_spec"></el-input>
    </el-form-item>
    <el-form-item label="剩余数量" prop="remaining_amount">
      <el-input-number v-model="props.modelValue.remaining_amount"></el-input-number>
    </el-form-item>
    <el-form-item label="供应商" prop="supplier">
      <ElSelectV2
        v-model="props.modelValue.supplier"
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
      <el-input v-model="props.modelValue.purchaser"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input type="textarea" v-model="props.modelValue.description"></el-input>
    </el-form-item>
    <el-form-item label="单价" prop="price">
      <el-input-number v-model="props.modelValue.price"></el-input-number>
    </el-form-item>
    <el-form-item label="运输成本" prop="shipping_cost">
      <el-input-number v-model="props.modelValue.shipping_cost"></el-input-number>
    </el-form-item>
    <el-form-item label="库存警告阈值" prop="warning_limit">
      <el-input-number v-model="props.modelValue.warning_limit"></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('materialFormRef')">提交</el-button>
      <el-button @click="resetForm('materialFormRef')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
