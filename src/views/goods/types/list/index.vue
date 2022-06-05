<template>
  <div class="app-container">
    <el-table
      v-loading="loading"
      element-loading-text="加载中"
      :data="typeList"
      fit
      border
      stripe
      style="width: 100%"
    >
      <el-table-column label="商品类型编号" width="180">
        <template slot-scope="scope">
          {{ scope.row.typeCode }}
        </template>
      </el-table-column>
      <el-table-column label="商品类型名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.typeName }}
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
            @click="del(scope.row.id)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { list, del } from '@/api/goodType'
export default {
  name: 'TypeList',
  data() {
    return {
      loading: false,
      typeList: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const { datas: { typeList }} = await list()
      this.typeList = typeList
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    reset() {
      this.$refs['form'].resetFields()
      this.getList()
    },
    toAlter(id) {
      this.$router.push({ path: '/good/type/alter/' + id })
    },
    toShow(id) {
      this.$router.push({ path: '/good/type/show/' + id })
    },
    del(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(id).then(({ success }) => {
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
