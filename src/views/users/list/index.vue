<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :inline="true">
      <el-form-item label="用户名称" prop="queryUserName">
        <el-input v-model="form.queryUserName" placeholder="用户名称" />
      </el-form-item>
      <el-form-item label="用户角色" prop="queryUserRole">
        <el-select v-model="form.queryUserRole" clearable placeholder="---请选择---">
          <el-option value="0" disabled label="---请选择---" />
          <el-option v-for="role in form.roleList" :key="role.id" :label="role.roleName" :value="role.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native="getList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click.native="reset()">重置</el-button>
      </el-form-item>
      <el-form-item prop="current">
        <el-input v-model="form.pageParam.current" type="hidden" />
      </el-form-item>
      <el-form-item prop="size">
        <el-input v-model="form.pageParam.size" type="hidden" />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      element-loading-text="加载中"
      :data="users"
      fit
      border
      stripe
      style="width: 100%"
    >
      <el-table-column label="用户账号" width="180">
        <template slot-scope="scope">
          {{ scope.row.userCode }}
        </template>
      </el-table-column>
      <el-table-column label="用户名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="年龄" width="140">
        <template slot-scope="scope">
          {{ scope.row.age }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="100">
        <template slot-scope="scope">
          {{ scope.row.gender === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="电话" width="220">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="用户角色" width="140">
        <template slot-scope="scope">
          {{ scope.row.userRoleName }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="toShow(scope.row.id)"
          >查看
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="toAlter(scope.row.id)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="delUser(scope.row.id)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 10px;text-align: center;"
      :current-page="form.pageParam.current"
      :page-size="form.pageParam.size"
      :page-sizes="[5,10,20,50]"
      :total="form.pageParam.total"
      :page-count="form.pageParam.pages"
      :pager-count="5"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { list, delUser } from '@/api/user'
export default {
  name: 'UserList',
  filters: {
    stringToInt({ total, size, pages, currnet }) {
      return {
        total: Number(total),
        size: Number(size),
        pages: Number(pages),
        current: Number(currnet)
      }
    }
  },
  data() {
    return {
      loading: false,
      form: {
        roleList: [],
        queryUserRole: '0',
        queryUserName: '',
        pageParam: {
          'total': 0,
          'size': 10,
          'current': 1,
          'pages': 0
        }
      },
      users: []
    }
  },
  computed: {
    gender() {
      return this.users.gender === 1 ? '男' : '女'
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const { datas: {
        roleList,
        queryUserRole,
        pageParam: { pages, size, total, current },
        users
      }} = await list({
        queryUserRole: this.form.queryUserRole,
        queryUserName: this.form.queryUserName,
        pageIndex: this.form.pageParam.current,
        pageSize: this.form.pageParam.size
      })
      this.form.roleList = roleList
      this.form.queryUserRole = queryUserRole
      this.form.pageParam = {
        pages: Number(pages),
        size: Number(size),
        total: Number(total),
        current: Number(current)
      }
      this.users = users
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    reset() {
      this.$refs['form'].resetFields()
      this.getList()
    },
    handleSizeChange(size) {
      this.form.pageParam.size = size
      this.getList()
    },
    handleCurrentChange(current) {
      this.form.pageParam.current = current
      this.getList()
    },
    toAlter(id) {
      this.$router.push({ path: '/user/alter/' + id })
    },
    toShow(id) {
      this.$router.push({ path: '/user/show/' + id })
    },
    delUser(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser(id).then(({ success }) => {
          if (success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>

</style>
