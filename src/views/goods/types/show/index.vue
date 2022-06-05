<template>
  <div class="app-container">
    <el-form ref="form" :model="form" status-icon :rules="rules">
      <el-form-item label="商品类型编号" prop="typeCode">
        <el-input v-model="form.typeCode" type="text" readonly auto-complete="false" />
      </el-form-item>
      <el-form-item label="商品类型名称" prop="typeName">
        <el-input v-model="form.typeName" type="text" readonly auto-complete="false" />
      </el-form-item>
      <el-form-item>
        <el-button @click="back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { toShow } from '@/api/goodType'
export default {
  name: 'TypeAlter',
  data() {
    return {
      form: {}
    }
  },
  mounted() {
    this.getGoodType(this.$route.params.id)
  },
  methods: {
    getGoodType(id) {
      toShow(id).then(({ datas: { goodType }}) => {
        this.form = goodType
      })
    },
    back() {
      window.history.back()
    }
  }
}
</script>

<style>

</style>
