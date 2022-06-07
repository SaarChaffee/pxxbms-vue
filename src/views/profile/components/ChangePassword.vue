<template>
  <div class="app-container">
    <el-form ref="form" :model="form" status-icon :rules="rules">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          v-model.trim="form.oldPassword"
          type="password"
          auto-complete="false"
          placeholder="请输入旧密码"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="userPassword">
        <el-input
          v-model.trim="form.userPassword"
          type="password"
          auto-complete="false"
          placeholder="请输入长度大于等于3的字符"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="resurePassword">
        <el-input
          v-model.trim="form.resurePassword"
          type="password"
          auto-complete="false"
          placeholder="再次确认新密码"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { judge, updPasswd } from '@/api/user'
import cryptoJs from 'crypto-js'
export default {
  data() {
    const checkOldPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('旧密码不能为空'))
      } else {
        setTimeout(() => {
          const passwd = cryptoJs.MD5(value).toString()
          judge(this.$store.state.user.id, passwd).then(({ data }) => {
            if (data) {
              return callback()
            } else {
              return callback(new Error('密码错误'))
            }
          })
        }, 500)
      }
    }
    const checkNewPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入新密码'))
      } else {
        setTimeout(() => {
          if (value === this.form.oldPassword) {
            return callback(new Error('新密码不能与旧密码重复'))
          } else {
            return callback()
          }
        }, 500)
      }
    }
    const checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      } else {
        setTimeout(() => {
          if (value === this.form.userPassword) {
            return callback()
          } else {
            return callback(new Error('两次密码输入不一致'))
          }
        }, 500)
      }
    }
    return {
      form: {
        oldPassword: '',
        userPassword: '',
        resurePassword: ''
      },
      rules: {
        oldPassword: [
          { validator: checkOldPassword, required: true, trigger: 'blur' }
        ],
        userPassword: [
          { validator: checkNewPassword, required: true, trigger: 'blur' },
          { min: 3, message: '请输入长度大于等于3的字符', trigger: 'blur' }
        ],
        resurePassword: [
          { required: true, message: '再次确认密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const passwd = cryptoJs.MD5(this.form.userPassword).toString()
          updPasswd(this.$store.state.user.id, passwd).then(async({ success, message }) => {
            if (success) {
              this.$message({
                type: 'success',
                message: '修改密码成功，请使用新密码重新登陆'
              })
              await this.$store.dispatch('user/logout')
              this.$router.push('/login')
            } else {
              this.$message({
                type: 'faild',
                message
              })
            }
          })
        }
      })
    }
  }
}
</script>

