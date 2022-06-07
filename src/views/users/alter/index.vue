<template>
  <div class="app-container">
    <el-form ref="form" :model="form" status-icon :rules="rules">
      <el-form-item label="姓名" prop="userName">
        <el-input
          v-model="form.userName"
          type="text"
          auto-complete="false"
          placeholder="请输入3位及以上12位及以下的字符"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender">
          <el-radio disabled :label="1">男</el-radio>
          <el-radio disabled :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          clearable
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          readonly
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input
          v-model="form.phone"
          type="text"
          auto-complete="false"
          laceholder="输入11位电话号码"
        />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="角色" prop="userRole">
        <el-select v-model="form.userRole" clearable placeholder="---请选择---">
          <el-option :value="0" disabled label="---请选择---" />
          <el-option v-for="role in roleList" :key="role.id" :label="role.roleName" :value="role.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { upd, toUpd } from '@/api/user'
import moment from 'moment'
export default {
  name: 'UserAlter',
  data() {
    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('姓名不能为空'))
      } else {
        if ((/^((?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])|(\w))+$/.test(value))) {
          return callback()
        } else {
          return callback(new Error('姓名格式错误'))
        }
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
      form: {
        id: '',
        userName: '',
        gender: '',
        birthday: '',
        phone: '',
        address: '',
        userRole: '',
        version: ''
      },
      roleList: [],
      rules: {
        userName: [
          { validator: checkName, required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, message: '请输入长度大于等于2的字符', trigger: 'blur' }
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
    this.toUpd(this.$route.params.id)
  },
  methods: {
    submitForm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          upd({ ...this.form, currentId: this.$store.state.user.id }).then(({ success, message }) => {
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
    back() {
      window.history.back()
    },
    toUpd(id) {
      toUpd(id).then(({ datas: { roleList, user: {
        id,
        userName,
        gender,
        birthday,
        phone,
        address,
        userRole,
        version
      }}}) => {
        this.roleList = roleList
        birthday = moment(birthday).format('yyyy-MM-DD')
        this.form = {
          id,
          userName,
          gender,
          birthday,
          phone,
          address,
          userRole,
          version
        }
      })
    }
  }
}
</script>

<style>

</style>
