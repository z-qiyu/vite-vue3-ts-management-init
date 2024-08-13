<script setup lang="ts">

</script>

<template>
  <img src="/home.jpg" class="img" alt="home"/>
  <el-row>
    <el-col :span="16"></el-col>
    <el-col :span="8">
      <div class="btn-grp">
        <el-button type="success">访客</el-button>
        <el-button @click="$router.push({name:'login'})" type="primary">登录</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.img{
  width: 100%;
  border-radius: 5px;
}

.btn-grp{
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: end;
  margin-top: 10px;
  gap: 7px;

  .el-button{
    width: 150px;
  }
}
</style>