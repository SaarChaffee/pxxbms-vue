<template>
  <div class="app-container">
    <el-form ref="form" :model="form">
      <el-form-item label="账户" prop="userName">
        <el-input v-model="form.userCode" readonly type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="form.userName" readonly type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender" readonly>
          <el-radio disabled :label="1">男</el-radio>
          <el-radio disabled :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          readonly
          clearable
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" readonly type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" readonly type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="角色" prop="userRole">
        <el-input v-model="form.userRoleName" readonly type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item>
        <el-button @click="back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { toShow } from '@/api/user'
import moment from 'moment'
export default {
  name: 'UserShow',
  data() {
    return {
      form: {}
    }
  },
  mounted() {
    this.toShow(this.$route.params.id)
  },
  methods: {
    back() {
      window.history.back()
    },
    toShow(id) {
      toShow(id).then(({ datas: { user }}) => {
        user.birthday = moment(user.birthday).format('yyyy-MM-DD')
        this.form = user
      })
    }
  }
}
</script>

<style>

</style>
