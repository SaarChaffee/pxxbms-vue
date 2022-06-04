<template>
  <div class="app-container">
    <el-form ref="form" :model="form" status-icon :rules="rules">
      <el-form-item label="商品名" prop="goodName">
        <el-input v-model="form.goodName" type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="商品库存" prop="inventory">
        <el-input v-model="form.inventory" type="text" auto-complete="false" />
      </el-form-item>
      <el-form-item label="商品类型" prop="goodType">
        <el-select v-model="form.goodType" clearable placeholder="---请选择---">
          <el-option :value="0" disabled label="---请选择---" />
          <el-option
            v-for="category in typeList"
            :key="category.id"
            :label="category.typeName"
            :value="category.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上传商品图片或输入图片地址" prop="detail.cover">
        <el-input v-model="form.detail.cover" type="text" placeholder="图片地址" auto-complete="false" />
        <el-upload
          ref="upload"
          :disabled="disabledUpload"
          :before-upload="beforeCoverUpload"
          :on-success="handleCoverSuccess"
          :action="BASE_API+'/upload/cover'"
          list-type="picture-card"
          :auto-upload="true"
          :headers="headers"
        >
          <i slot="default" class="el-icon-plus" />
          <div slot="file" slot-scope="{file}">
            <img
              class="el-upload-list__item-thumbnail"
              :src="form.detail.cover"
            >
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in" />
              </span>
              <span
                v-if="form.detail.cover"
                class="el-upload-list__item-delete"
                @click="handleDownload(file)"
              >
                <i class="el-icon-download" />
              </span>
              <span
                v-if="form.detail.cover"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete" />
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl">
        </el-dialog>
      </el-form-item>
      <el-form-item label="商品简介" prop="description.description">
        <tinymce
          ref="description"
          v-model="form.description.description"
          style="margin-top:40px"
          :height="400"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { toUpd, upd } from '@/api/good'
import Tinymce from '@/components/Tinymce'
export default {
  name: 'GoodAlter',
  components: {
    Tinymce
  },
  data() {
    const checkGoodName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('商品名不能为空'))
      } else {
        return callback()
      }
    }
    const checkInventory = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('库存不能为空'))
      } else {
        setTimeout(() => {
          return value > 0 ? callback() : callback(new Error('库存不能为空'))
        }, 500)
      }
    }
    const checkType = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('商品类型不能为空'))
      } else {
        setTimeout(() => {
          return value > 0 ? callback() : callback(new Error('商品类型不能为空'))
        }, 500)
      }
    }
    return {
      headers: {
        token: this.$store.state.user.token
      },
      BASE_API: process.env.VUE_APP_BASE_API,
      disabledUpload: false,
      form: {
        goodCode: '',
        goodName: '',
        inventory: '',
        goodType: 0,
        version: '',
        detail: {
          cover: ''
        },
        description: {
          description: ''
        }
      },
      dialogImageUrl: '',
      dialogVisible: false,
      typeList: [],
      rules: {
        goodName: [
          { validator: checkGoodName, required: true, trigger: 'blur' }
        ],
        inventory: [
          { validator: checkInventory, required: true, trigger: 'blur' }
        ],
        goodType: [
          { validator: checkType, required: true, trigger: 'blur' }
        ]

      }
    }
  },
  mounted() {
    this.getGood(this.$route.params.id)
    this.$refs['upload'].fileList.push({
      'url': this.form.detail.cover
    })
  },
  methods: {
    getGood(id) {
      toUpd(id).then(({ datas: { good, typeList }}) => {
        this.typeList = typeList
        this.form = good
      })
    },
    beforeCoverUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传封面图片只能是 JPG 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传封面图片大小不能超过 10MB!')
      }
      return isJPG && isLt10M
    },
    handlePictureCardPreview() {
      this.dialogImageUrl = this.form.detail.cover
      this.dialogVisible = true
    },
    handleCoverSuccess(res) {
      this.form.detail.cover = res.datas.url
      this.disabledUpload = true
    },
    handleRemove(file) {
      const index = this.$refs['upload'].uploadFiles.indexOf(file)
      this.$refs['upload'].uploadFiles.splice(index, 1)
      this.form.detail.cover = ''
      this.disabledUpload = false
    },
    handleDownload(file) {
      console.log(file)
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
              this.$router.push({ path: '/good/list' })
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
