<script setup lang="ts">
import Material from '@/views/pages/materials-equipment/forms/material.vue'
import MaterialInOutRecord from '@/views/pages/materials-equipment/forms/material-in-out-record.vue'
import Equipment from '@/views/pages/materials-equipment/forms/equipment.vue'
import ExpressReceipt from '@/views/pages/materials-equipment/forms/express-receipt.vue'
import Supplier from '@/views/pages/materials-equipment/forms/supplier.vue'
import Contact from '@/views/pages/materials-equipment/forms/contact.vue'
</script>

<template>
  <el-tabs type="border-card">
    <el-tab-pane label="材料">
      <Material />
    </el-tab-pane>
    <el-tab-pane label="出入库记录">
      <MaterialInOutRecord />
    </el-tab-pane>
    <el-tab-pane label="设备">
      <Equipment />
    </el-tab-pane>
    <el-tab-pane label="快递收据">
      <ExpressReceipt />
    </el-tab-pane>
    <el-tab-pane label="供应商">
      <Supplier />
    </el-tab-pane>
    <el-tab-pane label="联系人">
      <Contact />
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped lang="scss"></style>
