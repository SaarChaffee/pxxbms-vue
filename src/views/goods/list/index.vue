<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :inline="true">
      <el-form-item label="商品名" prop="queryGoodName">
        <el-input v-model="form.queryGoodName" placeholder="商品名" />
      </el-form-item>
      <el-form-item label="商家名" prop="queryOwnerName">
        <el-input v-model="form.queryOwnerName" placeholder="商家名" />
      </el-form-item>
      <el-form-item label="商品类型" prop="queryGoodType">
        <el-select v-model.trim="form.queryGoodType" clearable placeholder="---请选择---">
          <el-option value="0" disabled label="---请选择---" />
          <el-option
            v-for="category in form.typeList"
            :key="category.id"
            :label="category.typeName"
            :value="category.id"
          />
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
      :data="goods"
      fit
      border
      stripe
      style="width: 100%"
    >
      <el-table-column label="商品编号" width="180">
        <template slot-scope="scope">
          {{ scope.row.goodCode }}
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.goodName }}
        </template>
      </el-table-column>
      <el-table-column label="略缩图" width="100">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.detail.cover||''"
            fit="cover"
            :alt="scope.row.detail.title"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="商品类型" width="140">
        <template slot-scope="scope">
          {{ scope.row.goodTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="库存" width="100">
        <template slot-scope="scope">
          {{ scope.row.inventory }}
        </template>
      </el-table-column>
      <el-table-column label="商家名" width="100">
        <template slot-scope="scope">
          {{ scope.row.ownerName }}
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
            :disabled="scope.row.owner!==owner"
            @click="toAlter(scope.row.id)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            :disabled="scope.row.owner!==owner"
            @click="delGood(scope.row.id)"
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
import { list, del } from '@/api/good'
export default {
  name: 'GoodList',
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
        typeList: [],
        queryGoodName: '',
        queryOwnerName: '',
        queryGoodType: '',
        pageParam: {
          'total': 0,
          'size': 10,
          'current': 1,
          'pages': 0
        }
      },
      goods: [],
      owner: this.$store.state.user.id
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const { datas: {
        typeList,
        queryGoodName,
        queryOwnerName,
        queryGoodType,
        pageParam: { pages, size, total, current },
        goods
      }} = await list({
        queryGoodName: this.form.queryGoodName,
        queryOwnerName: this.form.queryOwnerName,
        queryGoodType: this.form.queryGoodType,
        pageIndex: this.form.pageParam.current,
        pageSize: this.form.pageParam.size
      })
      this.form.queryGoodName = queryGoodName
      this.form.queryGoodType = queryGoodType
      this.form.typeList = typeList
      this.form.queryOwnerName = queryOwnerName
      this.form.pageParam = {
        pages: Number(pages),
        size: Number(size),
        total: Number(total),
        current: Number(current)
      }
      this.goods = goods
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
      this.$router.push({ path: '/good/alter/' + id })
    },
    toShow(id) {
      this.$router.push({ path: '/good/show/' + id })
    },
    delGood(id) {
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
