<template>
  <div class="app-container">
    <el-form ref="form" :model="form">
      <el-form-item label="订单编号" prop="billName">
        <el-input v-model="form.billCode" readonly type="text" auto-complete="false" />
      </el-form-item>
      <el-card shadow="never" style="border: 1px solid #DCDFE6;padding-bottom: 0px;">
        <div slot="header" class="clearfix">
          <el-row>
            <el-col>
              <el-form-item
                style="margin-bottom: 0;"
                label="商品列表"
                label-position="left"
              />
            </el-col>
            <el-col :span="6">
              <el-form-item
                style="margin-bottom: 0;"
                label="商品数量"
                label-width="100px"
                label-position="left"
                prop="goodCount"
              >
                <el-input v-model.number="form.goodCount" status-icon="false" placeholder="商品数量" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                style="margin-bottom: 0;"
                label="订单总价"
                label-width="100px"
                label-position="left"
                prop="totalPrice"
              >
                <el-input v-model.number="form.totalPrice" placeholder="订单总价" readonly />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="5">
            <el-form-item label="商品编号" />
          </el-col>
          <el-col :span="5">
            <el-form-item label="商品名称" />
          </el-col>
          <el-col :span="5">
            <el-form-item label="商品数量" />
          </el-col>
          <el-col :span="5">
            <el-form-item label="商品单价" />
          </el-col>
        </el-row>
        <el-row
          v-for="(good,index) in form.goods"
          :key="index"
          :gutter="10"
          :label="'商品 ' + (index + 1)"
        >
          <el-col :span="5">
            <el-form-item :prop="'goods.'+index+'.goodCode'">
              <el-input v-model="good.goodCode" readonly placeholder="商品编号" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-input v-model="good.goodName" readonly placeholder="商品名称" />
          </el-col>
          <el-col :span="5">
            <el-form-item :prop="'goods.'+index+'.quantity'">
              <el-input v-model.number="good.quantity" readonly placeholder="商品数量" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item :prop="'goods.'+index+'.price'">
              <el-input v-model="good.price" readonly placeholder="商品单价" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-form-item label="顾客账户" prop="customerCode">
        <el-input v-model="form.customerCode" readonly type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="顾客姓名" prop="customerName">
        <el-input v-model="form.customerName" readonly type="text" auto-complete="false" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label-width="100px" label="地址" prop="address">
            <el-input v-model="form.address" readonly type="text" auto-complete="false" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="下单时间" prop="billTime">
            <el-date-picker
              v-model="form.billTime"
              readonly
              clearable
              type="date"
              format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label-width="100px" label="支付方式" prop="paymentMethodName">
            <el-input v-model="form.paymentMethodName" readonly type="text" auto-complete="false" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="支付时间" prop="billTime">
            <el-date-picker
              v-model="form.deliveryTime"
              readonly
              clearable
              type="date"
              format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { toShow } from '@/api/bill'
export default {
  name: 'BillShow',
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
      toShow(id).then(({ datas: { bill }}) => {
        this.form = bill
      })
    }
  }
}
</script>

<style>

</style>
