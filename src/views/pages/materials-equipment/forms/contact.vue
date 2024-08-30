<script setup lang="ts">
import { type ElForm, ElMessage, ElSelectV2 } from 'element-plus'
import { ref, reactive } from 'vue'
import type { Supplier } from '@/apis/supplier/types'
import { createContact } from '@/apis/contact'
import type { Contact } from '@/apis/contact/types'
import type { PK } from '@/apis'
import { getSuppliers } from '@/apis/supplier'

const contactFormRef = ref<InstanceType<typeof ElForm>>()
const suppliers = ref<Supplier[]>([])
const supplierLoading = ref(false)
const contact = reactive<Contact>({
  contact_id: null,
  name: '',
  phone_number: '',
  position: '',
  responsibility: '',
  company: null
})

const validatePhone = (rule: any, value: string, callback: any) => {
  if (!/^\d{11}$/.test(value)) {
    callback(new Error('请输入有效的手机号码'))
  } else {
    callback()
  }
}

const rules = ref({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone_number: [{ validator: validatePhone, trigger: 'blur' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  responsibility: [{ required: true, message: '请输入负责事务', trigger: 'blur' }],
  company: [{ required: true, message: '请选择公司', trigger: 'change' }]
})

const submitForm = () => {
  ;(contactFormRef.value as any)?.validate((valid: boolean) => {
    if (valid) {
      createContact(contact)
        .then((res) => {
          ElMessage.success('提交成功')
        })
        .catch((err) => {
          ElMessage.error('提交失败：' + err.token)
        })
    } else {
      console.log('error submit!!')
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

const resetForm = () => {
  ;(contactFormRef.value as any)?.resetFields()
}
</script>

<template>
  <el-form :model="contact" :rules="rules" ref="contactFormRef">
    <el-form-item label="联系人ID" prop="contact_id">
      <el-input v-model="contact.contact_id" disabled></el-input>
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="contact.name"></el-input>
    </el-form-item>
    <el-form-item label="电话号码" prop="phone_number">
      <el-input v-model="contact.phone_number"></el-input>
    </el-form-item>
    <el-form-item label="职位" prop="position">
      <el-input v-model="contact.position"></el-input>
    </el-form-item>
    <el-form-item label="负责事务" prop="responsibility">
      <el-input v-model="contact.responsibility"></el-input>
    </el-form-item>
    <el-form-item label="公司">
      <ElSelectV2
        v-model="contact.company"
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
    <el-form-item>
      <el-button type="primary" @click="submitForm()">提交</el-button>
      <el-button @click="resetForm()">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
