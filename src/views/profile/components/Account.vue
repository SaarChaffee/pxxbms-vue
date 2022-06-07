<template>
  <el-form ref="form" :model="user" status-icon :rules="rules">
    <el-form-item label="用户账号" prop="userCode">
      <el-input
        v-model.trim="user.userCode"
        readonly
        type="text"
        auto-complete="false"
        placeholder="请输入3位及以上12位及以下英文字母和数字"
      />
    </el-form-item>
    <el-form-item label="姓名" prop="userName">
      <el-input
        v-model.trim="user.userName"
        type="text"
        auto-complete="false"
        placeholder="请输入3位及以上12位及以下的字符"
      />
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <el-radio-group v-model="user.gender">
        <el-radio disabled :label="1">男</el-radio>
        <el-radio disabled :label="2">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="birthday"
            readonly
            clearable
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="年龄">
          <el-input v-model="user.age" style="width: 80%" readonly />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="电话" prop="phone">
      <el-input
        v-model.trim="user.phone"
        type="text"
        auto-complete="false"
        placeholder="输入11位电话号码"
      />
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model.trim="user.address" type="text" auto-complete="false" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit()">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import moment from 'moment'
import { upd } from '@/api/user'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: '',
          userCode: '',
          userName: '',
          userRole: '',
          userRoleName: '',
          phone: '',
          birthday: '',
          gender: '',
          age: '',
          address: '',
          version: '',
          avatar: {
            type: Object,
            default: () => {
              return {
                avatar: '',
                id: '',
                version: ''
              }
            }
          }
        }
      }
    }
  },
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
    return {
      rules: {
        userName: [
          { validator: checkName, required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, message: '请输入长度大于等于2的字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    birthday() {
      return moment(this.user.birthday).format('yyyy-MM-DD')
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          upd({
            id: this.user.id,
            userName: this.user.userName,
            phone: this.user.phone,
            address: this.user.address,
            version: this.user.version,
            currentId: this.$store.state.user.id
          }).then(({ success, message }) => {
            if (success) {
              this.$message({
                type: 'success',
                message
              })
              this.$router.push({ path: '/profile' })
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
