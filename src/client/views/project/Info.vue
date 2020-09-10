<template>
  <div class="project-info">
    <div class="info-base" v-if="selectPID">
      <Form :model="updateForm" ref="updateForm" :rules="updateFormRules" :label-width="80" v-show="edit">
        <FormItem label="项目名称" prop="title">
            <Input v-model="updateForm.title" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="更新时间">
          {{this.$moment(Number(selectProject.createTime)).format('YYYY年MM月DD日 HH时mm分')}}
        </FormItem>
        <FormItem label="当前版本">
          <!-- <Input v-model="formItem.input" placeholder="Enter something..."></Input> -->
        </FormItem>
        <FormItem label="描述" prop="description">
            <Input v-model="updateForm.description" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="saveEdit">确认</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelEdit">取消</Button>
        </FormItem>
      </Form>
      <Form :model="selectProject" :label-width="80" v-if="!edit">
        <FormItem label="项目名称">
          {{selectProject.title}}
        </FormItem>
        <FormItem label="创建时间">
          {{this.$moment(Number(selectProject.createTime)).format('YYYY年MM月DD日 HH时mm分')}}
        </FormItem>
        <FormItem label="最高版本">
          v 1.0.0.29
          <!-- {{this.$moment(selectProject.createTime).format('YYYY:MM:DD')}} -->
        </FormItem>
        <FormItem label="描述">
          {{selectProject.description}}
        </FormItem>
        <FormItem>
            <Button type="primary" @click="touchEdit">编辑</Button>
            <Button type="warning" style="margin-left: 8px" @click="openDeleteModal">删除</Button>
        </FormItem>
      </Form>
    </div>
    <div class="info-log">
    </div>
    <div class="info-upload">
    </div>
    <Modal v-model="deleteModel" width="400">
      <!-- <p slot="header" style="text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除项目</span>
      </p> -->
      <div style="text-align:center; font-size: 14px;">
        <p>删除项目后，项目信息和数据将全部删除。</p>
        <p>确定要删除吗？</p>
      </div>
      <div slot="footer">
        <Button type="warning" size="large" long  @click="deleteProject">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: 'info',
  data () {
    return {
      formItem: {
        input: '',
        select: '',
        radio: 'male',
        checkbox: [],
        switch: true,
        date: '',
        time: '',
        slider: [20, 50],
        textarea: ''
      },
      updateFormRules: {
        title: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' },
          { type: 'string', max: 20, message: '最多不能超过20个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '项目描述不能为空', trigger: 'blur' },
          { type: 'string', max: 100, message: '最多不能超过100个字符', trigger: 'blur' }
        ]
      },
      deleteModel: false,
      edit: false,
      file: null,
      loadingStatus: false
    }
  },
  computed: {
    ...mapState({
      selectProject: ({ project }) => project.selectProject,
      selectPID: ({ project }) => project.selectPID
    }),
  },
  created () {
    this.updateForm = JSON.parse(JSON.stringify(this.selectProject))
  },
  watch: {
    'selectProject' () {
      this.updateForm = JSON.parse(JSON.stringify(this.selectProject))
    }
  },
  methods: {
    ...mapActions(['UpdateProject', 'DeleteProject']),
    touchEdit () {
      this.edit = true
    },
    saveEdit () {
       this.$refs.updateForm.validate((valid) => {
        if (valid) {
          this.UpdateProject(this.updateForm).then(suc => {
            this.edit = false
          }).catch(err => {
            this.$Message.error('修改失败')
            console.log('UpdateProject' + err)
          })
        } else {
        }
      })
    },
    cancelEdit () {
      this.edit = false
    },
    openDeleteModal () {
      this.deleteModel = true
    },
    deleteProject () {
      this.DeleteProject(this.selectPID).then(suc => {
        this.deleteModel = false
      }).catch(err => {
        console.log('DeleteProject' + err)
      })
    }
  }
}
</script>

<style lang="less">
   .project-info {
     display: flex;
     justify-content: space-between;
   }
   .info-base {
     flex-basis: 400px;
   }
</style>
