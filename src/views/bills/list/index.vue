<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :inline="true">
      <el-form-item label="顾客姓名" prop="queryCustomerName">
        <el-input v-model="form.queryCustomerName" placeholder="顾客姓名" />
      </el-form-item>
      <el-form-item label="支付方式" prop="queryPaymentMethod">
        <el-select v-model.trim="form.queryPaymentMethod" clearable placeholder="---请选择---">
          <el-option value="0" disabled label="---请选择---" />
          <el-option v-for="method in form.methodList" :key="method.id" :label="method.typeName" :value="method.id" />
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
      :data="bills"
      fit
      border
      stripe
      style="width: 100%"
    >
      <el-table-column label="订单编号" width="180">
        <template slot-scope="scope">
          {{ scope.row.billCode }}
        </template>
      </el-table-column>
      <el-table-column label="商品数量" width="140">
        <template slot-scope="scope">
          {{ scope.row.goodCount }}
        </template>
      </el-table-column>
      <el-table-column label="订单金额" width="140">
        <template slot-scope="scope">
          {{ scope.row.totalPrice }}
        </template>
      </el-table-column>
      <el-table-column label="顾客姓名" width="100">
        <template slot-scope="scope">
          {{ scope.row.customerName }}
        </template>
      </el-table-column>
      <el-table-column label="付款方式" width="140">
        <template slot-scope="scope">
          {{ scope.row.paymentMethodName }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="220">
        <template slot-scope="scope">
          {{ scope.row.billTime | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="付款时间" width="220">
        <template v-if="scope.row.deliveryTime" slot-scope="scope">
          {{ scope.row.deliveryTime | dateFormat }}
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
            @click="delBill(scope.row.id)"
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
import { list, delBill } from '@/api/bill'
export default {
  name: 'BillList',
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
        methodList: [],
        queryCustomerName: '',
        queryPaymentMethod: '',
        pageParam: {
          'total': 0,
          'size': 10,
          'current': 1,
          'pages': 0
        }
      },
      bills: []
    }
  },
  computed: {
    gender() {
      return this.bills.gender === 1 ? '男' : '女'
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const { datas: {
        methodList,
        queryCustomerName,
        queryPaymentMethod,
        pageParam: { pages, size, total, current },
        billList
      }} = await list({
        queryCustomerName: this.form.queryCustomerName,
        queryPaymentMethod: this.form.queryPaymentMethod,
        pageIndex: this.form.pageParam.current,
        pageSize: this.form.pageParam.size
      })
      this.form.queryPaymentMethod = queryPaymentMethod
      this.form.methodList = methodList
      this.form.queryCustomerName = queryCustomerName
      this.form.pageParam = {
        pages: Number(pages),
        size: Number(size),
        total: Number(total),
        current: Number(current)
      }
      this.bills = billList
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
      this.$router.push({ path: '/bill/alter/' + id })
    },
    toShow(id) {
      this.$router.push({ path: '/bill/show/' + id })
    },
    delBill(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delBill(id).then(({ success }) => {
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
