<template>
  <div class="app-container">
    <el-form ref="form" :model="form" status-icon :rules="rules">
      <el-form-item label="订单编号" prop="billCode">
        <el-input v-model="form.billCode" type="text" auto-complete="false" />
      </el-form-item>
      <el-card shadow="never" style="border: 1px solid #DCDFE6;padding-bottom: 0px;">
        <div slot="header" class="clearfix">
          <el-row>
            <el-col :span="2">
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
        <el-row
          v-for="(good,index) in form.goods"
          :key="index"
          :gutter="10"
          :label="'商品 ' + (index + 1)"
        >
          <el-col :span="5">
            <el-form-item :prop="'goods.'+index+'.goodCode'" :rules="rules.goodCode">
              <el-input v-model="good.goodCode" readonly placeholder="商品编号" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-input v-model="good.goodName" readonly placeholder="商品名称" />
          </el-col>
          <el-col :span="5">
            <el-form-item :prop="'goods.'+index+'.quantity'" :rules="rules.quantity">
              <el-input v-model.number="good.quantity" readonly placeholder="商品数量" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item :prop="'goods.'+index+'.price'" :rules="rules.price">
              <el-input v-model="good.price" placeholder="商品单价" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-form-item label="顾客账号" prop="customerCode">
        <el-input v-model="form.customerCode" readonly type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="顾客姓名" prop="customerName">
        <el-input v-model="form.customerName" readonly type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="支付方式" prop="paymentMethod">
        <el-select v-model="form.paymentMethod" clearable placeholder="---请选择---">
          <el-option :value="0" disabled label="---请选择---" />
          <el-option
            v-for="method in methodList"
            :key="method.id"
            :label="method.typeName"
            :value="method.id"
          />
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
import { toUpd, upd } from '@/api/bill'
import { accMul } from '@/utils'
export default {
  name: 'BillAdd',
  data() {
    const checkPrice = (rule, value, callback) => {
      value = Number(value)
      if (value < 1 || isNaN(value) || !/^\d+\.?\d*$/.test(value)) {
        return callback(new Error('请输入大于0的价格'))
      } else {
        const index = Number(rule.field.split('.')[1])
        if (this.form.goods[index].quantity !== '') {
          this.form.goods[index].totalPrice = accMul(this.form.goods[index].quantity, value)
          this.updateTotal()
        }
        return callback()
      }
    }
    const checkMethod = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('支付方式不能为空'))
      } else {
        setTimeout(() => {
          return value > 0 ? callback() : callback(new Error('角色不能为空'))
        }, 500)
      }
    }
    return {
      form: {
        id: '',
        billCode: '',
        goodCount: 0,
        totalPrice: 0.0,
        address: '',
        paymentMethod: 0,
        version: '',
        goods: []
      },
      methodList: [],
      rules: {
        paymentMethod: [
          { required: true, message: '请选择角色', trigger: 'blur' },
          { validator: checkMethod, trigger: 'blur' }
        ],
        price: [
          { validator: checkPrice, required: true, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.toUpd(this.$route.params.id)
  },
  methods: {
    toUpd(id) {
      toUpd(id).then(({ datas: {
        billvo, methodList }}) => {
        this.form = billvo
        this.methodList = methodList
      })
    },
    updateTotal() {
      console.log(this.form.toString)
      this.form.totalPrice = this.form.goods.reduce((x, y) => x + y.totalPrice, 0)
    },
    submitForm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          upd({ ...this.form, currentId: this.$store.state.user.id }).then(({ success, message }) => {
            if (success) {
              this.$message({
                type: 'success',
                message
              })
              this.$router.push({ path: '/bill/list' })
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
    }
  }
}
</script>

<style>

</style>
