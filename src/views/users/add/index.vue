<template>
  <div class="app-container">
    <el-form ref="form" :model="form" status-icon :rules="rules">
      <el-form-item label="用户账号" prop="userCode">
        <el-input
          v-model.trim="form.userCode"
          type="text"
          auto-complete="false"
          placeholder="请输入3位及以上12位及以下英文字母和数字"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="userName">
        <el-input
          v-model.trim="form.userName"
          type="text"
          auto-complete="false"
          placeholder="请输入3位及以上12位及以下的字符"
        />
      </el-form-item>
      <el-form-item label="密码" prop="userPassword">
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
          placeholder="再次确认密码"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          clearable
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOption"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input
          v-model.trim="form.phone"
          type="text"
          auto-complete="false"
          placeholder="输入11位电话号码"
        />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model.trim="form.address" type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="角色" prop="userRole">
        <el-select v-model="form.userRole" clearable placeholder="---请选择---">
          <el-option :value="0" disabled label="---请选择---" />
          <el-option v-for="role in roleList" :key="role.id" :label="role.roleName" :value="role.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="reset('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { toAdd, exist, add } from '@/api/user'
export default {
  name: 'UserAdd',
  data() {
    const checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账户不能为空'))
      } else {
        if ((/^[\w]+$/.test(value))) {
          setTimeout(() => {
            exist(value).then(({ data }) => {
              if (!data) {
                return callback()
              } else {
                return callback(new Error('账户已被使用，请重新输入'))
              }
            })
          }, 500)
        } else {
          return callback(new Error('账户格式错误'))
        }
      }
    }
    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('姓名不能为空'))
      } else {
        if ((/^.*[ ].*$/.test(value))) {
          return callback(new Error('姓名格式错误'))
        } else {
          return callback()
        }
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
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机不能为空'))
      } else {
        setTimeout(() => {
          if (/^1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(value)) {
            return callback()
          } else {
            return callback(new Error('手机号码不合法'))
          }
        }, 500)
      }
    }
    const checkRole = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('角色不能为空'))
      } else {
        setTimeout(() => {
          return value > 0 ? callback() : callback(new Error('角色不能为空'))
        }, 500)
      }
    }
    return {
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now() || time.getTime() < new Date(new Date().getFullYear() - 100, new Date().getMonth(), new Date().getDate())
        }
      },
      form: {
        userCode: '',
        userName: '',
        userPassword: '',
        resurePassword: '',
        gender: '',
        birthday: '',
        phone: '',
        address: '',
        userRole: ''
      },
      roleList: [],
      rules: {
        userCode: [
          { validator: checkCode, required: true, trigger: 'blur' },
          { min: 3, max: 12, message: '请输入3位及以上12位及以下英文字母和数字', trigger: 'blur' }
        ],
        userName: [
          { validator: checkName, required: true, trigger: 'blur' },
          { min: 3, max: 12, message: '请输入3位及以上12位及以下的字符', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, message: '请输入长度大于等于3的字符', trigger: 'blur' }
        ],
        resurePassword: [
          { required: true, message: '再次确认密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '请选择出生日期', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        userRole: [
          { required: true, message: '请选择角色', trigger: 'blur' },
          { validator: checkRole, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { datas: { roleList }} = await toAdd()
      this.roleList = roleList
    },
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
              this.$router.push({ path: '/user/list' })
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
