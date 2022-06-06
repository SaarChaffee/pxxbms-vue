<template>
  <div class="app-container">
    <el-form ref="form" :model="form" status-icon :rules="rules">
      <el-form-item label="订单编号" prop="billCode">
        <el-input
          v-model="form.billCode"
          type="text"
          auto-complete="false"
          placeholder="请输入3位及以上12位及以下英文字母和数字"
        />
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
            <el-col :span="6">
              <el-button
                style="float: right;"
                type="primary"
                @click="addGood"
              >
                加入商品
              </el-button>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="5">
            <el-form-item label="商品编号" :rules="rules.goodCodeInput" />
          </el-col>
          <el-col :span="5">
            <el-form-item label="商品名称" />
          </el-col>
          <el-col :span="5">
            <el-form-item label="商品数量" :rules="rules.quantity" />
          </el-col>
          <el-col :span="5">
            <el-form-item label="商品单价" :rules="rules.price" />
          </el-col>
        </el-row>
        <el-row
          v-for="(good,index) in form.goods"
          :key="index"
          :gutter="10"
          :label="'商品 ' + (index + 1)"
        >
          <el-col :span="5">
            <el-form-item :prop="'goods.'+index+'.goodCodeInput'" :rules="rules.goodCodeInput">
              <el-input v-model="good.goodCodeInput" placeholder="商品编号" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-input v-model="good.goodName" readonly placeholder="商品名称" />
          </el-col>
          <el-col :span="5">
            <el-tooltip
              class="item"
              effect="dark"
              :content="good.inventory?'商品库存'+good.inventory+'件':'请输入商品编号获取商品库存'"
              placement="left"
            >
              <el-form-item :prop="'goods.'+index+'.quantity'" :rules="rules.quantity">
                <el-input v-model.number="good.quantity" placeholder="商品数量" />
              </el-form-item>
            </el-tooltip>
          </el-col>
          <el-col :span="5">
            <el-form-item :prop="'goods.'+index+'.price'" :rules="rules.price">
              <el-input v-model="good.price" placeholder="商品单价" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="info" @click.prevent="removeGood(good)">删除</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-form-item label="顾客账号" prop="customerCodeInput">
        <el-input
          v-model="form.customerCodeInput"
          type="text"
          auto-complete="false"
          placeholder="顾客账号"
        />
      </el-form-item>
      <el-form-item label="顾客姓名" prop="customerName">
        <el-input
          v-model="form.customerName"
          readonly
          type="text"
          auto-complete="false"
          placeholder="顾客姓名"
        />
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
        <el-button @click="reset('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { toAdd, exist, add } from '@/api/bill'
import { exist as userExist } from '@/api/user'
import { exist as goodExist } from '@/api/good'
import { accMul } from '@/utils'
export default {
  name: 'BillAdd',
  data() {
    const checkBillCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('订单编号不能为空'))
      } else {
        if ((/^[\w]+$/.test(value))) {
          setTimeout(() => {
            exist(value).then(({ data }) => {
              if (!data) {
                return callback()
              } else {
                return callback(new Error('订单编号已被使用，请重新输入'))
              }
            })
          }, 500)
        } else {
          return callback(new Error('订单编号格式错误，请重新输入'))
        }
      }
    }
    const checkCustomerCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('顾客账号不能为空'))
      } else {
        if ((/^[\w]+$/.test(value))) {
          setTimeout(() => {
            userExist(value).then(({ data }) => {
              if (!data) {
                this.form.customerCode = ''
                this.form.customerCodeInput = ''
                this.form.customerName = ''
                return callback(new Error('顾客账号不存在，请重新输入'))
              } else {
                this.form.customerCode = data.id
                this.form.customerCodeInput = data.userCode
                this.form.customerName = data.userName
                return callback()
              }
            })
          }, 500)
        } else {
          return callback(new Error('顾客账号格式错误，请重新输入'))
        }
      }
    }
    const checkGoodCount = (rule, value, callback) => {
      console.log(value)
      if (value < 1) {
        return callback(new Error('请添加至少一项商品'))
      } else {
        return callback()
      }
    }
    const checkGoodCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入商品编号'))
      } else {
        if ((/^[\w]+$/.test(value))) {
          const index = Number(rule.field.split('.')[1])
          const len = this.form.goods.length
          for (let i = 0; i < len; i++) {
            if (this.form.goods[i].goodCode === value && i !== index) {
              return callback(new Error('商品已存在，请输入不同的的商品'))
            }
          }
          goodExist(value).then(({ data }) => {
            if (!data) {
              this.form.goods[index].goodCode = ''
              this.form.goods[index].goodName = ''
              this.form.goods[index].inventory = ''
              return callback(new Error('商品不存在，请重新输入'))
            } else {
              this.form.goods[index].goodCode = data.id
              this.form.goods[index].goodName = data.goodName
              this.form.goods[index].inventory = data.inventory
              return callback()
            }
          })
        } else {
          return callback(new Error('商品编号格式错误，请重新输入'))
        }
      }
    }
    const checkQuantity = (rule, value, callback) => {
      if (value < 1 || isNaN(value) || !/^\d+$/.test(value)) {
        return callback(new Error('请输入正整数的购买数量'))
      } else {
        const index = Number(rule.field.split('.')[1])
        const price = Number(this.form.goods[index].price)
        if (this.form.goods[index].inventory < value) {
          return callback(new Error('库存不足'))
        }
        if (!isNaN(price) && price !== 0) {
          this.form.goods[index].totalPrice = accMul(price, value)
          this.updateTotal()
        }
        return callback()
      }
    }
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
        billCode: '',
        goodCount: 0,
        totalPrice: 0.0,
        customerCode: '',
        customerCodeInput: '',
        customerName: '',
        address: '',
        paymentMethod: 0,
        goods: []
      },
      methodList: [],
      rules: {
        billCode: [
          { validator: checkBillCode, required: true, trigger: 'blur' },
          { min: 3, max: 12, message: '请输入3位及以上12位及以下英文字母和数字', trigger: 'blur' }
        ],
        customerCodeInput: [
          { validator: checkCustomerCode, required: true, trigger: 'blur' }
        ],
        paymentMethod: [
          { required: true, message: '请选择角色', trigger: 'blur' },
          { validator: checkMethod, trigger: 'blur' }
        ],
        goodCount: [
          { validator: checkGoodCount, trigger: 'change' }
        ],
        goodCodeInput: [
          { validator: checkGoodCode, required: true, trigger: 'blur' }
        ],
        quantity: [
          { validator: checkQuantity, required: true, trigger: 'blur' }
        ],
        price: [
          { validator: checkPrice, required: true, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getMethodList()
  },
  methods: {
    async getMethodList() {
      const { datas: { methodList }} = await toAdd()
      this.methodList = methodList
    },
    addGood() {
      this.form.goods.push({
        goodCode: '',
        goodCodeInput: '',
        goodName: '',
        quantity: '',
        inventory: '',
        price: '',
        totalPrice: ''
      })
      this.form.goodCount++
    },
    updateTotal() {
      console.log(this.form.toString)
      this.form.totalPrice = this.form.goods.reduce((x, y) => x + y.totalPrice, 0)
    },
    removeGood(item) {
      const index = this.form.goods.indexOf(item)
      if (index !== -1) {
        this.form.goods.splice(index, 1)
        this.form.goodCount--
        this.updateTotal()
      }
    },
    submitForm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          add({ ...this.form, currentId: this.$store.state.user.id }).then(({ success, message }) => {
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
    reset(name) {
      this.$refs[name].resetFields()
      const len = this.form.goods.length
      for (let i = 0; i <= len; i++) {
        this.form.goods.shift()
      }
      this.getList()
    }
  }
}
</script>

<style>

</style>
