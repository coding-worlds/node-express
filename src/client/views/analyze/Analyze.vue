<template>
  <div class="introduction">
    <div class="filter">
      <p class="cut-line">条件筛选</p>
      <div style="margin:20px 0 0 20px">
        <p class="select-style" style="margin-right:40px">
          <label>项目名称</label>
          <Select v-model="projectName" style="width:154px" @on-change="changeProject">
            <Option v-for="item in projectNamesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </p>
        <!-- <p class="select-style">
          <label>系统选择</label>
          <Select v-model="projectName" style="width:154px">
            <Option v-for="item in projectNamesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </p> -->
        <p class="select-style">
          <label>日期选择</label>
          <DatePicker type="daterange" @on-change="dateRange" split-panels confirm placement="bottom-end" placeholder="选择日期" style="width: 210px"></DatePicker>
        </p>
      </div>
      <div style="margin:20px 0 0 20px">
        <p class="select-style" style="margin-right:40px">
          <label>版本号</label>
          <Select v-model="versionName" multiple style="width:374px">
            <Option v-for="item in versionList" :value="item.value" :key="item.value" :disabled="item.isDisable">{{ item.label }}</Option>
          </Select>
        </p>
        <p class="select-style">
          <label>BUG状态</label>
          <Select v-model="bugStatus" multiple style="width:374px">
            <Option v-for="item in bugStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </p>
      </div>
      <div style="margin:20px 0 0 20px">
        <p class="select-style" style="margin-right:40px">
          <label>严重性</label>
          <Select v-model="severity" multiple style="width:374px">
            <Option v-for="item in severityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </p>
        <p class="select-style">
          <label>优先级</label>
          <Select v-model="priority" multiple style="width:374px">
            <Option v-for="item in priorityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </p>
      </div>
      <div style="margin:20px 0 0 20px">
        <p class="select-style" style="margin-right:40px">
          <label>人员选择</label>
          <Select v-model="personName" multiple style="width:374px">
            <Option v-for="item in personNameList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </p>
        <p class="select-style">
          <Input v-model="bugKeywords" placeholder="可输入bug关键字" style="width:338px"></Input>
        </p>
        <p class="select-style"><Button @click="getSelestData" type="primary" style="margin-left:26px">生成报表</Button></p>
      </div>
    </div>
    <div class="analyse">
      <p class="cut-line">数据分析</p>
      <Tabs :animated="false" style="margin-left:20px">
        <TabPane label="BUG统计总览" name="name1">
          <BugStatus :analyzeListss="analyzeListss"></BugStatus>
        </TabPane>
        <TabPane label="项目版本 / 人员统计" name="name2">
          <Version :analyzeListss="analyzeListss"></Version>
        </TabPane>
        <!-- <TabPane label="人员统计" name="name3">
          <Person :analyzeListss="analyzeListss"></Person>
        </TabPane> -->
      </Tabs>
    </div>
    <!-- <div>
      <BigPanel :title="'条件筛选'" :custom="false" v-model="panels[0]" @clicked="panelChange(0)" :foldable="true">
        <p class="select-style">
          <label>项目名称</label>
          <Select v-model="projectName" style="width:154px">
            <Option v-for="item in projectNamesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </p>
        <p class="select-style">
          <label>系统选择</label>
          <Select v-model="projectName" style="width:154px">
            <Option v-for="item in projectNamesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </p>
        <p class="select-style">
          <label>优先级</label>
          <Select v-model="projectName" style="width:154px">
            <Option v-for="item in projectNamesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </p>
      </BigPanel>
    </div> -->
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'
import BigPanel from '../../components/BigPanel.vue'
import BugStatus from './BugStatus.vue'
// import Person from './Person.vue'
import Version from './Version.vue'
export default {
  name: 'introduction',
  components: {
    BigPanel,
    BugStatus,
    // Person,
    Version
  },
  data () {
    return {
      optionDisable: false,
      analyzeListss: {},
      panels: [true, false],
      projectNamesList: [],
      versionList: [],
      bugStatusList: [],
      severityList: [],
      priorityList: [],
      personNameList: [],
      projectName: '',
      versionName: [],
      bugStatus: [],
      severity: [],
      priority: [],
      personName: [],
      bugKeywords: '',
      dateRangeArr: []
    }
  },
  computed: {
    ...mapState({
      analyzeList: ({ analyze }) => analyze.analyzeList,
      projectList: ({ project }) => project.projectList
    }),
  },
  watch: {
    versionName: {
      handler: function(newValue) {
        if (newValue.length >= 4) {
          this.disabledOptions(newValue, this.versionList, '1')
        } else {
          this.disabledOptions(newValue, this.versionList, '2')
        }
      },
      deep: true
    },
  },
  created() {
    // 获取项目列表
    this.GetProjectList().then(suc => {
      for (var key in this.projectList) {
        const projectObj = {
          value: this.projectList[key].pid,
          label: this.projectList[key].title
        }
        if (projectObj.value === 1) {
          this.projectName = 1
        }
        this.projectNamesList.push(projectObj)
      }
      const analysePrames = {
        pid: this.projectName,
        // bid: '',
        // title: '',
        edition: this.versionName,
        state: this.bugStatus,
        // founder: '',
        personliable: this.personName,
        seriousness: this.severity,
        // description: '',
        createTime: this.dateRangeArr,
        priority: this.priority
      }
      this.getAnalyListMethod(analysePrames, '1')
    }).catch(err => {
      console.log('GetProjectList' + err)
    })
  },
  methods: {
    ...mapActions(['getAnalyList', 'GetProjectList']),
    // 选中5个后其他选项不可选
    disabledOptions(selectOpt, allOption, flag) {
      const verList = []
      for (const key in allOption) {
        verList.push(allOption[key].value)
      }
      for (var i = 0; i < selectOpt.length; i++) {
        let pos = verList.indexOf(selectOpt[i])
        if (pos < 0){
        } else {
          verList.splice(pos, 1)
        }
      }
      for (var j in this.versionList) {
        for (var o in verList) {
          if ((this.versionList[j].value === verList[o]) && (flag === '1')) {
            Vue.set(this.versionList, j , {
              value: this.versionList[j].value,
              label: this.versionList[j].value,
              isDisable: true
            })
          }
          if (flag === '2') {
            Vue.set(this.versionList, j , {
              value: this.versionList[j].value,
              label: this.versionList[j].value,
              isDisable: false
            })
          }
        }
      }
    },
    dateRange(val) {
      const start = new Date(val[0])
      const end = new Date(val[1])
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        this.dateRangeArr = []
      } else {
        this.dateRangeArr = [start.getTime(), end.getTime()]
      }
      // console.log(this.dateRangeArr, '时间戳')
    },
    getStatusList(prams, flag) {
      for (var key in prams) {
        const obj = {
          value: key,
          label: key,
          isDisable: this.optionDisable
        }
        if (flag === '1') {
          this.bugStatusList.push(obj)
        } else if (flag === '2') {
          this.severityList.push(obj)
        } else if (flag === '3') {
          this.priorityList.push(obj)
        } else if (flag === '4') {
          this.versionList.push(obj)
        } else if (flag === '5') {
          this.personNameList.push(obj)
        }
      }
    },
    // 获取数据分析列表
    getAnalyListMethod(prams, flag) {
      this.getAnalyList(prams).then(suc => {
        if (flag === '2') {
          this.analyzeListss = this.analyzeList
          return
        }
        this.bugStatusList = []
        this.severityList = []
        this.priorityList = []
        this.versionList = []
        this.personNameList = []
        const versionList = this.analyzeList.result.editions
        const personliablesList = this.analyzeList.result.personliables
        for (var key in versionList) {
          this.getStatusList(versionList[key], '4')
        }
        for (var key in personliablesList) {
          this.getStatusList(personliablesList[key], '5')
        }
        const statusList = this.analyzeList.result.state
        const gradeList = this.analyzeList.result.BUGGrade
        const priorityList = this.analyzeList.result.BUGPriority
        this.getStatusList(statusList, '1')
        this.getStatusList(gradeList, '2')
        this.getStatusList(priorityList, '3')
      }).catch(err => {
        console.log('getAnalyList' + err)
      })
    },
    // 项目名称变化时
    changeProject(val) {
      const analysePrames = {
        pid: val,
        // bid: '',
        // title: '',
        edition: this.versionName,
        state: this.bugStatus,
        // founder: '',
        personliable: this.personName,
        seriousness: this.severity,
        // description: '',
        createTime: this.dateRangeArr,
        priority: this.priority
      }
      this.getAnalyListMethod(analysePrames, '1')
    },
    getSelestData() {
      const selectPrams = {
        pid: this.projectName,
        // bid: '',
        // title: '',
        edition: this.versionName,
        state: this.bugStatus,
        // founder: '',
        personliable: this.personName,
        seriousness: this.severity,
        // description: '',
        createTime: this.dateRangeArr,
        priority: this.priority
      }
      this.getAnalyListMethod(selectPrams, '2')
    }
    // panelChange(index) { // 面板显示一个
    //   if (this.panels[index]) {
    //     this.panels.forEach((item, index) => {
    //       this.$set(this.panels, index, false)
    //     })
    //     this.$set(this.panels, index, true)
    //   }
    // }
  }
}
</script>

<style lang="less">
   @import '../../assets/style/common.less';
   .cut-line {
    width: 100%;
    padding-bottom: 15px;
    border-bottom:2px solid #1cc09f;
    font-size: 18px;
  }
  .analyse {
    margin-top: 20px;
  }
  .select-style {
    display: inline-block;
    // margin: 0px 20px 0 0;
  }
  .select-style label {
    float: left;
    width: 74px;
    height: 32px;
    line-height: 32px;
    padding-right: 10px;
  }
  .ivu-btn-primary {
    background-color:#1cc09f;
    border-color:#1cc09f;
  }
  .ivu-btn-primary:hover {
    background-color:#5abaa7;
    border-color:#5abaa7;
  }
  .ivu-btn-primary:active {
    background-color:#19ad8f;
    border-color:#19ad8f;
  }
  .ivu-tabs-nav .ivu-tabs-tab-active {
    color: #1cc09f;
  }
  .ivu-tabs-nav .ivu-tabs-tab:hover {
    color: #1cc09f;
  }
  .ivu-tabs-ink-bar {
    background-color: #1cc09f;
  }
</style>
