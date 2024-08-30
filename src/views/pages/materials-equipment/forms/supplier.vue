<script setup lang="ts">
import { reactive, ref } from 'vue'
import { createMaterialInOutRecord } from '@/apis/materialInOutRecord'
import { ElMessage } from 'element-plus'
import { createSupplier } from '@/apis/supplier'

const supplierFormRef = ref(null)
const supplier = reactive({
  supplier_id: 0, // 可能需要从后端获取或自动生成
  company_name: '',
  contact_person: '',
  contact_position: '',
  contact_number: '',
  address: '',
  shipping_cost: 0
})

const rules = {
  company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  contact_person: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  contact_position: [{ required: true, message: '请输入联系人职位', trigger: 'blur' }],
  contact_number: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  shipping_cost: [{ required: true, message: '请输入发货成本', trigger: 'blur' }]
}

const submitForm = (formName: string) => {
  ;(supplierFormRef.value as any).validate((valid: boolean) => {
    if (valid) {
      createSupplier(supplier)
        .then((res) => {
          ElMessage.success('提交成功')
        })
        .catch((err) => {
          ElMessage.error('提交失败：' + err.token)
        })
    } else {
      console.log('验证失败')
      return false
    }
  })
}

const resetForm = (formName: string) => {
  ;(supplierFormRef.value as any).resetFields()
}
</script>

<template>
  <el-form :model="supplier" :rules="rules" ref="supplierFormRef" label-width="120px">
    <el-form-item label="供应商ID" prop="supplier_id">
      <el-input v-model.number="supplier.supplier_id" disabled></el-input>
    </el-form-item>
    <el-form-item label="公司名称" prop="company_name">
      <el-input v-model="supplier.company_name"></el-input>
    </el-form-item>
    <el-form-item label="联系人" prop="contact_person">
      <el-input v-model="supplier.contact_person"></el-input>
    </el-form-item>
    <el-form-item label="联系人职位" prop="contact_position">
      <el-input v-model="supplier.contact_position"></el-input>
    </el-form-item>
    <el-form-item label="联系电话" prop="contact_number">
      <el-input v-model="supplier.contact_number"></el-input>
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="supplier.address"></el-input>
    </el-form-item>
    <el-form-item label="发货成本" prop="shipping_cost">
      <el-input-number
        v-model.number="supplier.shipping_cost"
        :precision="2"
        :step="0.01"
      ></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('supplierFormRef')">提交</el-button>
      <el-button @click="resetForm('supplierFormRef')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
