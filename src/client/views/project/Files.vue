<template>
  <div class="project-files">
    <ul>
      <li v-for="project in projectList" @click="clickProject(project)" :style="{color:selectPID === project.pid ? '#1cc09f' : '#283643'}">
        <div class="icon" :style="{color:selectPID === project.pid ? '#1cc09f' : '#283643'}" :title="project.title">
          <Icon type="document-text"></Icon>
        </div>
        <p class="title">{{ project.title }}</p>
      </li>
      <li class="file-add" @click="openProModel">
        <div class="icon">
          <Icon type="document"></Icon>
        </div>
        <p class="title"> Create a New Project</p>
      </li>
    </ul>
    <Modal
      v-model="proModel"
      title="创建项目"
      width="450">
      <div class="proModel-content"> 
        <Form :model="proForm" ref="proForm" :label-width="80" :rules="proFormRules">
          <FormItem label="项目名称" prop="title">
              <Input v-model="proForm.title" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="描述" prop="description">
              <Input v-model="proForm.description" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="Enter something..."></Input>
          </FormItem>
        </Form> 
      </div>
      <div slot="footer">
        <Button type="primary" @click="proFormSave">确认</Button>
        <Button type="ghost" style="margin-left: 8px" @click="proFormCancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: 'files',
  data () {
    return {
      files: ['IPC-全景', 'IPC-智能', 'IPC-Edge', 'IPC-智能'],
      proModel: false,
      proForm: {
        title: '',
        description: ''
      },
      proFormRules: {
        title: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' },
          { type: 'string', max: 20, message: '最多不能超过20个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '项目描述不能为空', trigger: 'blur' },
          { type: 'string', max: 100, message: '最多不能超过100个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      projectList: ({ project }) => project.projectList,
      selectPID: ({ project }) => project.selectPID
    }),
  },
  created () {
    this.GetProjectList().catch(err => {
      console.log('GetProjectList' + err)
    })
  },
  methods: {
    ...mapActions(['CreateProject', 'GetProjectList']),
    openProModel () {
      this.proModel = true
    },
    proFormSave () {
      this.$refs.proForm.validate((valid) => {
        if (valid) {
          this.CreateProject(this.proForm).then(suc => {
            this.proModel = false
          }).catch(err => {
            this.$Message.error('创建失败')
            console.log('CreateProject' + err)
          })
        } else {
        }
      })
    },
    proFormCancel () {
      this.perForm = {
        title: '',
        description: ''
      }
      this.proModel = false
    },
    clickProject (project) {
      this.$store.commit('SET_SELECT_PROJECT', project)
    }
  }
}
</script>

<style lang="less">
   .project-files {
     height: 400px;
     width: 100%;
     overflow: auto;
   }
   .project-files ul {
     display: inline-flex;
     flex-wrap: wrap;
   }
   .project-files li {
    //  float: left;
     padding: 30px;
     text-align: center;
     cursor: pointer;
   }
   .project-files li .icon {
     font-size: 100px;
     height: 140px;
     color: #283643;
   }
   .project-files li:hover .icon, li:hover .title {
    //  color: #1cc09f; 
    //  border: 1px solid @lightColor;
   }
  .project-files li .title {
    margin-top: 12px;
    font-size: 16px;
  }
  .project-files li.file-add .icon, li.file-add .title{
    color: #bbbec4
  }
  .project-files li.file-add:hover .icon,li.file-add:hover .title {
    color: #283643;
  }
  .proModel-content {
    width: 400px;
    padding: 20px;
  }
</style>
