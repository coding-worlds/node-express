<template>
    <div class="project-upload">
      <Upload
        name="my_file"
        :before-upload="handleUpload"
        accept=""
        action="/api/file/upload">
        <Button type="ghost" icon="ios-cloud-upload-outline">点击此处上传项目文档</Button>
      </Upload>
      <!-- <div v-if="file !== null">Upload file: {{ file.name }} <Button type="ghost" @click="upload" :loading="loadingStatus">{{ loadingStatus ? '上传中' : '确认上传' }}</Button></div> -->
      <Modal v-model="uploadModel" width="400">
        <p slot="header">
          <span>选择项目</span>
        </p>
        <div class="model-content">
          <RadioGroup v-model="uploadPid" vertical>
              <Radio :key="p.pid" :label="p.pid" v-for="p in projectList">
                  <Icon type="document-text"></Icon>
                  <span>{{ p.title }}</span>
              </Radio>
          </RadioGroup>
        </div>
        <div slot="footer">
          <Button type="success" size="large" long  @click="upload" :loading="loadingStatus">上传</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { uploadProjectApi } from '../../http/project.api.js'
export default {
  name: 'upload',
  data () {
    return {
      file: null,
      loadingStatus: false,
      uploadModel: false,
      uploadPid: ''
    }
  },
  computed: {
    ...mapState({
      projectList: ({ project }) => project.projectList
    }),
  },
  created () {
  },
  watch: {
  },
  methods: {
    ...mapActions(['UpdateProject', 'DeleteProject']),
    handleUpload (file) {
      this.uploadModel = true
      this.file = file
      return false
    },
    upload () {
      if (this.uploadPid === '') return this.$Message.warning('请先选择所要上传的项目')
      this.loadingStatus = true
      var data = new window.FormData()
      data.append('my_file', this.file)
      uploadProjectApi(data, this.uploadPid).then(suc => {
        this.loadingStatus = false
        this.uploadModel = false
        this.$Message.success('上传成功')
      }).catch(() => {
        this.$Message.error('上传失败')
        this.loadingStatus = false
      })
      // setTimeout(() => {
      //   this.file = null
      //   this.loadingStatus = false
      //   this.$Message.success('Success')
      // }, 1500)
    }
  }
}
</script>

<style lang="less">
   .project-upload .ivu-upload .ivu-btn-ghost{
     background: #283643;
     padding: 12px 15px;
     color: #fff;
   }
   .project-upload .ivu-upload .ivu-btn-ghost:hover {
     background: #495060;
     color:#57a3f3;
   }
   .project-upload .ivu-radio-group-vertical .ivu-radio-wrapper {
     text-align: left;
   }
   .model-content {
     margin-left: 20px;
     height: 200px;
     overflow-y: auto;
   }
</style>
