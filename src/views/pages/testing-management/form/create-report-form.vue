<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" placeholder="请输入标题"></el-input>
    </el-form-item>
    <el-form-item label="关联实验方案" prop="experiment_schemes">
      <ElSelectV2
        v-model="selectedExperimentSchemes"
        filterable
        remote
        :options="experimentSchemes"
        placeholder="请选择实验材料"
        :props="{
          label: 'experiment_name',
          value: 'id'
        }"
        :remote-method="remoteMethod"
        :loading="loading"
        style="width: 240px; margin-right: 16px; vertical-align: middle"
        multiple
      >
        <template #default="{ item }">
          <div class="flex items-center">
            <el-tag type="primary" style="margin-right: 8px" size="small"
              >{{ item.experiment_number }}:{{ item.experiment_name }}</el-tag
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
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox, ElSelectV2 } from 'element-plus'
import type { ExperimentReport } from '@/apis/experimentReport/types'
import { createExperimentReport } from '@/apis/experimentReport'
import type { ExperimentScheme } from '@/apis/experimentScheme/types'
import { getMaterials } from '@/apis/material'
import { getExperimentSchemes } from '@/apis/experimentScheme'

const loading = ref(false)
const experimentSchemes = ref<ExperimentScheme[]>([])
const selectedExperimentSchemes = ref<ExperimentScheme>([])
// 初始化 form 数据
const form = reactive<ExperimentReport>({
  title: '',
  content: {},
  experiment_schemes: [],
});

const remoteMethod = (query: string) => {
  if (query !== '') {
    loading.value = true
    getExperimentSchemes({
      page_size: 1000,
      keyword: query
    })
      .then((res) => {
        experimentSchemes.value = res.data
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    experimentSchemes.value = []
  }
}
// 初始化规则
const rules = reactive({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
  ],
  experiment_schemes: [
    { required: true, message: '请选择实验方案', trigger: 'change' },
  ],
});

watch(
  () => selectedExperimentSchemes.value,
  () => {
    form.experiment_schemes = selectedExperimentSchemes.value.map((i) => {
      let idx = experimentSchemes.value.findIndex((m) => m.id === i)
      if (idx === -1) {
        idx = form.experiment_schemes.findIndex((m) => m === i)
      }
      return experimentSchemes.value[idx]
    })
  },
  {
    deep: true
  }
)
// 提交表单
const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      createExperimentReport({
        ...form,
        experiment_schemes:form.experiment_schemes.map(i=>i.id)
      }).then(res=>{
        ElMessage({
          message: '提交成功',
          type: 'success',
        });
      })
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
};

// 表单引用
const formRef = ref<HTMLDivElement | null>(null);
</script>