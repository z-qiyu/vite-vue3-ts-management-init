<template>
  <el-form :model="experimentScheme" :rules="rules" ref="formRef" label-width="120px">
    <el-form-item label="实验类型" prop="experiment_type">
      <el-input v-model="experimentScheme.experiment_type" placeholder="请输入实验类型" />
    </el-form-item>
    <el-form-item label="试验名称" prop="experiment_name">
      <el-input v-model="experimentScheme.experiment_name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="实验目的" prop="purpose">
      <el-input v-model="experimentScheme.purpose" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="试验归属" prop="experiment_plan">
      <ElSelectV2
        v-model="selectedExperimentPlan"
        filterable
        remote
        :options="experimentPlans"
        placeholder="请选择试验归属"
        :props="{
          label: 'title',
          value: 'id'
        }"
        :remote-method="remoteExperimentPlansMethod"
        :loading="experimentPlansLoading"
        style="width: 240px; margin-right: 16px; vertical-align: middle"
      >
        <template #default="{ item }">
          <div class="flex items-center">
            <el-tag type="primary" style="margin-right: 8px" size="small"
              >{{ item.id }}:{{ item.title }}</el-tag
            >
            <span>{{ item.title }}</span>
          </div>
        </template>
        <template #label="{ label, value }">
          <span>{{ label }}: </span>
          <span style="font-weight: bold">{{ value }}</span>
        </template>
      </ElSelectV2>
    </el-form-item>
    <el-form-item label="编制人" prop="creator">
      <!-- 假设 creator 是一个外键字段 -->
      <ElSelectV2
        v-model="selectedCreator"
        filterable
        remote
        :options="users"
        placeholder="请选择编制人"
        :props="{
          label: 'username',
          value: 'id'
        }"
        :remote-method="remoteCreatorsMethod"
        :loading="creatorsLoading"
        style="width: 240px; margin-right: 16px; vertical-align: middle"
      >
        <template #default="{ item }">
          <div class="flex items-center">
            <el-tag type="primary" style="margin-right: 8px" size="small"
              >{{ item.phone }}-{{ item.first_name }}</el-tag
            >
            <span>{{ item.username }}</span>
          </div>
        </template>
        <template #label="{ label, value, name }">
          <span style="font-weight: bold">{{ label }}</span>
        </template>
      </ElSelectV2>
    </el-form-item>
    <el-form-item label="提交时间" prop="submission_date">
      <el-date-picker
        v-model="experimentScheme.submission_date"
        type="date"
        placeholder="选择日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="重要等级" prop="importance_level">
      <el-select v-model="experimentScheme.importance_level" placeholder="请选择重要等级">
        <el-option
          v-for="level in typeChoices"
          :key="level.value"
          :label="level.label"
          :value="level.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="试验编号" prop="experiment_number">
      <el-input v-model="experimentScheme.experiment_number" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="试验方案" prop="scheme_content">
      <el-input type="textarea" v-model="experimentScheme.scheme_content"></el-input>
    </el-form-item>
    <el-form-item label="实验材料" prop="materials">
      <ElSelectV2
        v-model="selectedMaterials"
        filterable
        remote
        :options="materials"
        placeholder="请选择实验材料"
        :props="{
          label: 'name',
          value: 'material_id'
        }"
        :remote-method="remoteMethod"
        :loading="loading"
        style="width: 240px; margin-right: 16px; vertical-align: middle"
        multiple
      >
        <template #default="{ item }">
          <div class="flex items-center">
            <el-tag type="primary" style="margin-right: 8px" size="small"
              >{{ item.material_id }}:{{ item.chemical_name }}</el-tag
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
    <el-form-item label="实验用量" prop="dosage">
      <TableInput v-model="experimentScheme.dosage" :cols="cols" />
    </el-form-item>
    <el-form-item label="测试指标" prop="test_index">
      <el-input v-model="experimentScheme.test_index"></el-input>
    </el-form-item>
    <el-form-item label="自动报告" prop="auto_report">
      <el-switch v-model="experimentScheme.auto_report"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElSelectV2 } from 'element-plus'
import type { ExperimentScheme } from '@/apis/experimentScheme/types'
import type { ExperimentPlan } from '@/apis/experimentPlan/types'
import type { User } from '@/apis/users/types'
import type { Material } from '@/apis/material/types'
import TableInput from '@/components/table-input/index.vue'
import type { Optionalize, PK } from '@/apis'
import { getMaterials } from '@/apis/material'
import { getExperimentPlans } from '@/apis/experimentPlan'
import { getUsers } from '@/apis/users'
import { useUserStore } from '@/stores'
import { createExperimentScheme } from '@/apis/experimentScheme'

const formRef = ref()
const user = useUserStore()
const experimentScheme = reactive<ExperimentScheme>({
  process_status_list: [],
  id: null,
  experiment_type: '',
  experiment_name: '',
  purpose: '',
  experiment_plan: null,
  creator: user.userInfo.id,
  submission_date: '',
  importance_level: null,
  experiment_number: '',
  scheme_content: '',
  materials: [] as Optionalize<Material>[],
  dosage: {},
  test_index: '',
  auto_report: false
})

const cols = computed<{ label: string }[]>(() => {
  return experimentScheme.materials.map((i) => {
    return {
      label: (i as Material).chemical_name!
    }
  })
})

watch(
  () => experimentScheme.materials,
  () => {
    const newData: typeof experimentScheme.dosage = experimentScheme.dosage
    experimentScheme.materials.map((i) => {
      if (!experimentScheme.dosage[(i as Material).chemical_name!]) {
        newData[(i as Material).chemical_name!] = {}
      } else {
        newData[(i as Material).chemical_name!] =
          experimentScheme.dosage[(i as Material).chemical_name!]
      }
    })
    for (let k in experimentScheme.dosage) {
      if (experimentScheme.materials.findIndex((i) => (i as Material).chemical_name === k) === -1) {
        delete newData[k]
      }
    }
    experimentScheme.dosage = newData
  },
  {
    deep: true
  }
)

// 假设这些数据是从后端获取的
const typeChoices = [
  { value: '重要', label: '重要' },
  { value: '特别重要', label: '特别重要' },
  { value: '一般', label: '一般' }
]

const experimentPlans = ref<ExperimentPlan[]>([])
const users = ref<User[]>([user.userInfo])
const materials = ref<Material[]>([])
const selectedMaterials = ref<number[]>([])
const selectedExperimentPlan = ref<PK>(null)
const selectedCreator = ref<number>(user.userInfo.id!)
const loading = ref(false)
const experimentPlansLoading = ref(false)
const creatorsLoading = ref(false)

watch(
  () => selectedMaterials,
  () => {
    experimentScheme.materials = selectedMaterials.value.map((i) => {
      let idx = materials.value.findIndex((m) => m.material_id === i)
      if (idx === -1) {
        idx = experimentScheme.materials.findIndex((m) => m === i)
      }
      return materials.value[idx]
    })
  },
  {
    deep: true
  }
)

watch(
  () => selectedCreator.value,
  () => {
    experimentScheme.creator = selectedCreator.value
  }
)

watch(
  () => selectedExperimentPlan.value,
  () => {
    experimentScheme.experiment_plan = selectedExperimentPlan.value
  }
)

const rules = reactive({
  experiment_type: [{ required: true, message: '请选择实验类型', trigger: 'change' }],
  experiment_name: [{ required: true, message: '请输入试验名称', trigger: 'blur' }],
  purpose: [{ required: true, message: '请输入实验目的', trigger: 'blur' }],
  experiment_plan: [{ required: true, message: '请选择试验归属', trigger: 'change' }],
  creator: [{ required: true, message: '请选择编制人', trigger: 'change' }],
  submission_date: [{ required: true, message: '请选择提交时间', trigger: 'change' }],
  importance_level: [{ required: true, message: '请选择重要等级', trigger: 'change' }],
  experiment_number: [{ required: true, message: '请输入试验编号', trigger: 'blur' }],
  scheme_content: [{ required: true, message: '请输入试验方案', trigger: 'blur' }],
  materials: [{ required: true, message: '请选择实验材料', trigger: 'change' }]
})

const remoteMethod = (query: string) => {
  if (query !== '') {
    loading.value = true
    getMaterials({
      page_size: 1000,
      keyword: query
    })
      .then((res) => {
        materials.value = res.data
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    materials.value = []
  }
}

const remoteExperimentPlansMethod = (query: string) => {
  if (query !== '') {
    experimentPlansLoading.value = true
    getExperimentPlans({
      page_size: 1000,
      keyword: query
    })
      .then((res) => {
        experimentPlans.value = res.data
      })
      .finally(() => {
        experimentPlansLoading.value = false
      })
  } else {
    experimentPlans.value = []
  }
}

const remoteCreatorsMethod = (query: string) => {
  if (query !== '') {
    creatorsLoading.value = true
    getUsers({
      page_size: 1000,
      keyword: query
    })
      .then((res) => {
        users.value = res.data
      })
      .finally(() => {
        creatorsLoading.value = false
      })
  } else {
    users.value = []
  }
}

const load = ref(false)
const submitForm = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      load.value = true
      createExperimentScheme(experimentScheme)
        .then((res) => {
          ElMessage.success('新建成功')
        })
        .catch((err) => {
          ElMessage.success('新建失败:' + err.toString())
        })
        .finally(() => {
          load.value = false
        })
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
}
</script>
