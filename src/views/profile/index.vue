<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="个人资料" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="changepassword">
                <ChangePassword />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getProfile } from '@/api/user'
import UserCard from './components/UserCard'
import ChangePassword from './components/ChangePassword'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, ChangePassword, Account },
  data() {
    return {
      user: {},
      activeTab: 'account'
    }
  },
  mounted() {
    this.getUser(this.$store.state.user.id)
  },
  methods: {
    getUser(id) {
      getProfile(id).then(({ datas: { user }}) => {
        this.user = user
      })
    }
  }
}
</script>
