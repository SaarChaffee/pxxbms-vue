<template>
  <div class="app-container">
    <el-form ref="form" :model="form" status-icon :rules="rules">
      <el-form-item label="商品类型编号" prop="typeCode">
        <el-input v-model="form.typeCode" type="text" readonly auto-complete="false" />
      </el-form-item>
      <el-form-item label="商品类型名称" prop="typeName">
        <el-input v-model="form.typeName" type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { toUpd, upd } from '@/api/goodType'
export default {
  name: 'TypeAlter',
  data() {
    return {
      form: {
        id: '',
        typeCode: '',
        typeName: '',
        version: ''
      },
      rules: {
        typeName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, message: '请输入长度大于等于2的字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getGoodType(this.$route.params.id)
  },
  methods: {
    getGoodType(id) {
      toUpd(id).then(({ datas: { goodType: { id, typeCode, typeName, version }}}) => {
        this.form = {
          id,
          typeCode,
          typeName,
          version
        }
      })
    },
    submitForm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log(this.form)
          upd({ ...this.form, currentId: this.$store.state.user.id }).then(({ success, message }) => {
            if (success) {
              this.$message({
                type: 'success',
                message
              })
              this.$router.push({ path: '/good/type/list' })
            } else {
              this.$message({
                type: 'faild',
                message
              })
            }
          })
        }
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
