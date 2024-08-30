<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ExperimentScheme } from '@/apis/experimentScheme/types'
import { deleteExperimentScheme, getExperimentScheme } from '@/apis/experimentScheme'
import type { ExperimentPlan } from '@/apis/experimentPlan/types'
import type { User } from '@/apis/users/types'
import type { Material } from '@/apis/material/types'
import TableInput from '@/components/table-input/index.vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { levelText } from '@/views/pages/testing-management/utils'

const props = defineProps<{ id: number }>()
const router = useRouter()
const experimentScheme = ref<ExperimentScheme>({
  auto_report: false,
  creator: {} as User,
  dosage: {},
  experiment_name: '',
  experiment_number: '',
  experiment_plan: {} as ExperimentPlan,
  experiment_type: null,
  id: null,
  importance_level: null,
  materials: [],
  purpose: '',
  scheme_content: '',
  submission_date: '',
  test_index: ''
})

const del = () => {
  deleteExperimentScheme(props.id).then((res) => {
    ElMessage.success('删除成功')
    router.push({ name: 'test-plan' })
  })
}

onMounted(() => {
  getExperimentScheme(props.id).then((res) => {
    experimentScheme.value = res.data
  })
})

const cols = computed<{ label: string }[]>(() => {
  return experimentScheme.value.materials.map((i) => {
    return {
      label: (i as Material).chemical_name!
    }
  })
})

const creator = computed<User>(() => {
  return (
    (experimentScheme.value.creator as User) || {
      id: null,
      last_name: '',
      email: '',
      phone: '',
      first_name: '',
      is_staff: false,
      is_superuser: false,
      date_joined: '',
      is_active: false,
      is_admin: false,
      password: '',
      username: ''
    }
  )
})
</script>

<template>
  <div class="c">
    <el-container style="padding: 10px">
      <el-button type="primary" @click="$router.push({ name: 'test-plan' })">返回</el-button>
    </el-container>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="实验类型">
        {{ experimentScheme.experiment_type }}
      </el-descriptions-item>
      <el-descriptions-item label="试验名称">
        {{ experimentScheme.experiment_name }}
      </el-descriptions-item>
      <el-descriptions-item label="实验目的">
        {{ experimentScheme.purpose }}
      </el-descriptions-item>
      <el-descriptions-item label="试验归属">
        <el-table :data="[experimentScheme?.experiment_plan]" style="width: 600px">
          <el-table-column prop="title" label="实验计划标题" width="180"></el-table-column>
          <el-table-column prop="level" label="实验计划等级" width="120">
            <template #default="{ row }">
              {{ levelText(row.level) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            label="实验计划内容"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="weight" label="实验计划权重" width="120"></el-table-column>
        </el-table>
      </el-descriptions-item>
      <el-descriptions-item label="编制人">
        <el-descriptions>
          <el-descriptions-item label="用户名">{{ creator.username }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ creator.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ creator.email }}</el-descriptions-item>
          <el-descriptions-item label="全名">
            {{ creator.first_name }} {{ creator.last_name }}
          </el-descriptions-item>
        </el-descriptions>
      </el-descriptions-item>
      <el-descriptions-item label="提交时间">
        {{ experimentScheme.submission_date }}
      </el-descriptions-item>
      <el-descriptions-item label="重要等级">
        {{ experimentScheme.importance_level }}
      </el-descriptions-item>
      <el-descriptions-item label="试验编号">
        {{ experimentScheme.experiment_number }}
      </el-descriptions-item>
      <el-descriptions-item label="试验方案">
        {{ experimentScheme.scheme_content }}
      </el-descriptions-item>
      <el-descriptions-item label="实验材料">
        <el-table :data="experimentScheme.materials" border style="width: 800px">
          <el-table-column prop="material_id" label="材料ID" width="80"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="chemical_name" label="化学名称"></el-table-column>
          <el-table-column prop="cas_number" label="CAS编号"></el-table-column>
          <el-table-column prop="is_confidential" label="保密">
            <template v-slot="scope">
              {{ scope.row.is_confidential ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column prop="confidential_code" label="保密代码"></el-table-column>
          <el-table-column prop="specification" label="规格"></el-table-column>
          <el-table-column prop="packaging_spec" label="包装规格"></el-table-column>
        </el-table>
      </el-descriptions-item>
      <el-descriptions-item label="实验用量">
        <TableInput
          v-if="Object.keys(experimentScheme.dosage).length > 0"
          readonly
          v-model="experimentScheme.dosage"
          :cols="cols"
        />
      </el-descriptions-item>
      <el-descriptions-item label="测试指标">
        {{ experimentScheme.test_index }}
      </el-descriptions-item>
      <el-descriptions-item label="自动报告">
        {{ experimentScheme.auto_report ? '开启' : '关闭' }}
      </el-descriptions-item>
      <el-descriptions-item label="操作">
        <el-button type="danger" @click="del">删除</el-button>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style scoped lang="scss">
.c {
  width: 100%;
}
</style>
