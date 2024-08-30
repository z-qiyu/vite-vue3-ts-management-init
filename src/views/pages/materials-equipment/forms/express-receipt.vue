<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import { createExpressReceipt } from '@/apis/expressReceipt'
import dayjs from 'dayjs'

const expressReceiptFormRef = ref(null)
const expressReceipt = reactive({
  express_id: 0, // 可能需要从后端获取或自动生成
  name: '',
  tracking_number: '',
  express_label_photo: '', // 应该是一个有效的base64编码图片链接
  purchaser: '',
  storage_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  receiver: '',
  location: ''
})

const rules = {
  name: [{ required: true, message: '请输入快递名称', trigger: 'blur' }],
  tracking_number: [{ required: true, message: '请输入跟踪编号', trigger: 'blur' }],
  express_label_photo: [{ required: true, message: '请上传快递标签照片', trigger: 'change' }],
  purchaser: [{ required: true, message: '请输入购买者', trigger: 'blur' }],
  storage_time: [{ required: true, message: '请选择存储时间', trigger: 'change' }],
  receiver: [{ required: true, message: '请输入收件人', trigger: 'blur' }],
  location: [{ required: true, message: '请输入位置', trigger: 'blur' }]
}

const submitForm = (formName: string) => {
  ;(expressReceiptFormRef.value as any).validate((valid: boolean) => {
    if (valid) {
      createExpressReceipt(expressReceipt)
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
  ;(expressReceiptFormRef.value as any).resetFields()
}

const uploadAction = '/api/express-receipts/img_upload/' // 替换为你的后端上传API
const uploadRef = ref()

const handleUploadSuccess = (response: any, file: File, fileList: any[]) => {
  expressReceipt.express_label_photo = response.backend_path // 假设后端返回的是文件URL
  ElMessage.success('上传成功')
}

const handleUploadError = (err: any, file: File, fileList: any[]) => {
  ElMessage.error('上传失败')
}

const beforeUpload = (file: File) => {
  const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt500K = file.size / 1024 / 1024 < 0.5

  if (!isJPGorPNG) {
    ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!')
  }
  if (!isLt500K) {
    ElMessage.error('上传头像图片大小不能超过 500KB!')
  }
  return isJPGorPNG && isLt500K
}
</script>

<template>
  <el-form :model="expressReceipt" :rules="rules" ref="expressReceiptFormRef" label-width="140px">
    <el-form-item label="快递单号" prop="express_id">
      <el-input v-model.number="expressReceipt.express_id" disabled></el-input>
    </el-form-item>
    <el-form-item label="快递名称" prop="name">
      <el-input v-model="expressReceipt.name"></el-input>
    </el-form-item>
    <el-form-item label="跟踪编号" prop="tracking_number">
      <el-input v-model="expressReceipt.tracking_number"></el-input>
    </el-form-item>
    <el-form-item label="快递标签照片">
      <el-upload
        ref="uploadRef"
        :action="uploadAction"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :before-upload="beforeUpload"
        auto-upload
        list-type="picture-card"
        :limit="1"
      >
        <el-icon color="success" v-if="expressReceipt.express_label_photo"><Check /></el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="购买者" prop="purchaser">
      <el-input v-model="expressReceipt.purchaser"></el-input>
    </el-form-item>
    <el-form-item label="存储时间" prop="storage_time">
      <el-date-picker
        v-model="expressReceipt.storage_time"
        type="datetime"
        placeholder="选择日期时间"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="收件人" prop="receiver">
      <el-input v-model="expressReceipt.receiver"></el-input>
    </el-form-item>
    <el-form-item label="位置" prop="location">
      <el-input v-model="expressReceipt.location"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('expressReceiptFormRef')">提交</el-button>
      <el-button @click="resetForm('expressReceiptFormRef')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
