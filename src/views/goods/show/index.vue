<template>
  <div class="app-container">
    <el-form ref="form" :model="form">
      <el-form-item label="商品编号" prop="goodCode">
        <el-input v-model="form.goodCode" readonly type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="商品名" prop="goodName">
        <el-input v-model="form.goodName" readonly type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="商品库存" prop="inventory">
        <el-input v-model="form.inventory" readonly type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="商品类型" prop="goodType">
        <el-input v-model="form.goodTypeName" readonly type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item>
        <el-card>
          <div slot="header">
            <el-form-item label="商品图片及图片地址" />
            <el-input v-model="form.detail.cover" readonly type="text" placeholder="图片地址" auto-complete="false" />
          </div>
          <el-image
            style="height: 200px"
            :src="form.detail.cover||''"
            :alt="form.detail.title"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </el-card>
      </el-form-item>
      <el-form-item>
        <el-card>
          <div slot="header">
            <el-form-item label="商品简介" />
          </div>
          <div v-html="form.description.description" />
        </el-card>
      </el-form-item>
      <el-form-item>
        <el-button @click="back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { toShow } from '@/api/good'
import { MarkdownIt as md } from 'markdown-it'
export default {
  name: 'GoodShow',
  data() {
    return {
      form: {
        detail: {
          cover: ''
        },
        description: {
          description: ''
        }
      }
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
      toShow(id).then(({ datas: { good }}) => {
        this.form = good
        this.form.desctiprion.description = md.render(this.form.desctiprion.description)
      })
    }
  }
}
</script>

<style>

</style>
