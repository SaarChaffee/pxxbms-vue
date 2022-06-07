<template>
  <div class="app-container">
    <el-form ref="form" :model="form" status-icon :rules="rules">
      <el-form-item label="商品类型编号" prop="typeCode">
        <el-input v-model="form.typeCode" type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="商品类型名称" prop="typeName">
        <el-input
          v-model="form.typeName"
          type="text"
          auto-complete="false"
          placeholder="请输入1位及以上12位及以下汉字，字母和数字"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="reset('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { exist, add } from '@/api/goodType'
export default {
  name: 'TypeAdd',
  data() {
    const checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入商品类型编号'))
      } else {
        if ((/^[\w]+$/.test(value))) {
          setTimeout(() => {
            exist(value).then(({ data }) => {
              if (!data) {
                return callback()
              } else {
                return callback(new Error('编号已被使用，请重新输入'))
              }
            })
          }, 500)
        } else {
          return callback(new Error('商品类型编号格式错误，请重新输入'))
        }
      }
    }
    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('商品类型名称不能为空'))
      } else {
        if ((/^((?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])|(\w))+$/.test(value))) {
          return callback()
        } else {
          return callback(new Error('商品类型名称格式错误'))
        }
      }
    }
    return {

      form: {
        typeCode: '',
        typeName: ''
      },
      rules: {
        typeCode: [
          { validator: checkCode, required: true, trigger: 'blur' },
          { min: 1, max: 12, message: '请输入1位及以上12位及以下字母和数字', trigger: 'blur' }
        ],
        typeName: [
          { validator: checkName, required: true, trigger: 'blur' },
          { min: 1, max: 12, message: '请输入1位及以上12位及以下汉字，字母和数字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log(this.form)
          add({ ...this.form, currentId: this.$store.state.user.id }).then(({ success, message }) => {
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
    reset(name) {
      this.$refs[name].resetFields()
      this.getList()
    }
  }
}
</script>

<style>

</style>
