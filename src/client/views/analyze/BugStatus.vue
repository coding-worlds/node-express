<template>
  <div class="status" style="position: relative">
    <div v-show="isData" ref='bugStatus' id="bugStatus"></div>
    <div v-show="isData || isPerson || isVersion" class="selectStyle">
      <label>请选择统计类型</label>
      <Select v-model="model1" @on-change="changeStyle">
        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <div v-show="isPerson" ref='personTotle' id="personTotle"></div>
    <div v-show="isVersion" ref='versionTotle' id="versionTotle"></div>
    <div v-show="!isData && !isPerson && !isVersion" class="message">{{tooltipMessage}}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'status',
  props: {
    analyzeListss: { type: Object }
  },
  data () {
    return {
      isVersion: false,
      isPerson: false,
      cityList: [
        {
          value: 'status',
          label: 'BUG状态统计'
        },
        {
          value: 'person',
          label: '人员统计'
        },
        {
          value: 'version',
          label: '版本统计'
        }
      ],
      model1: 'status',
      personListArr: [],
      versionListArr: [],
      tooltipMessage: '',
      isData: true,
      barData: {
        title : {
          text: 'BUG状态统计',
          left: '300'
        },
        tooltip : { // 提示框组件
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color:['#77b0d7', '#5a84a1', '#485669', '#61a0a8', '#749f83', '#c23531', '#ca8622', '#bda29a', '#96989d'],
        legend: { // 图例组件
          orient: 'vertical',
          left: 'left',
          top: '60',
          data: []
        },
        series : [
          {
            name: '访问来源',
            type: 'pie',
            radius: '75%',
            center: ['60%', '58%'],
            data:[],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      barDataPerson: {
        title : {
          text: '人员统计',
          left: '300'
        },
        tooltip : { // 提示框组件
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: { // 图例组件
          orient: 'vertical',
          left: 'left',
          top: '60',
          data: []
        },
        series : [
          {
            name: '访问来源',
            type: 'pie',
            radius: '75%',
            center: ['60%', '58%'],
            data:[],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      barDataVersion: {
        title : {
          text: '版本统计',
          left: '300'
        },
        tooltip : { // 提示框组件
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: { // 图例组件
          orient: 'vertical',
          left: 'left',
          top: '60',
          data: []
        },
        series : [
          {
            name: '访问来源',
            type: 'pie',
            radius: '75%',
            center: ['60%', '58%'],
            data:[],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  watch: {
    analyzeListss: {
      handler: function(newValue) {
        this.selectedShow(this.model1)
        this.barData.series[0].data = []
        this.barDataPerson.series[0].data = []
        this.barDataVersion.series[0].data = []
        const statusList = this.analyzeList.result.state
        const personList = this.analyzeList.result.personliables
        const editionsList = this.analyzeList.result.editions
        this.$store.commit('SET_STATE_LIST', Object.keys(statusList))
        this.barData.legend.data = Object.keys(statusList)
        for (var key in statusList) {
          this.getStatusList(key, statusList[key])
        }
        for (var key in personList) {
          for (var keys in personList[key]) {
            this.personListArr.push(keys)
            const personData = {
              value: personList[key][keys].totalNum,
              name: keys
            }
            this.barDataPerson.series[0].data.push(personData)
          }
        }
        for (var key in editionsList) {
          for (var keys in editionsList[key]) {
            this.versionListArr.push(keys)
            const versionData = {
              value: editionsList[key][keys].totalNum,
              name: keys
            }
            this.barDataVersion.series[0].data.push(versionData)
          }
        }
        this.barDataPerson.legend.data = this.personListArr
        this.barDataVersion.legend.data = this.versionListArr
        var echarts = require('echarts')
        var myCharts = echarts.init(this.$refs.bugStatus)
        var myChartsPerson = echarts.init(this.$refs.personTotle)
        var myChartsversion = echarts.init(this.$refs.versionTotle)
        myCharts.setOption(this.barData)
        myChartsPerson.setOption(this.barDataPerson)
        myChartsversion.setOption(this.barDataVersion)
      },
      deep: true
    },
  },
  methods: {
    getStatusList(key, val) {
      const obj = {
        value: val,
        name: key
      }
      this.barData.series[0].data.push(obj)
    },
    changeStyle(val) {
      this.selectedShow(val)
    },
    selectedShow(args) {
      if (args === 'person') {
        this.isPerson = true
        this.isData = false
        this.isVersion = false
      } else if (args === 'version') {
        this.isPerson = false
        this.isData = false
        this.isVersion = true
      } else if (args === 'status') {
        this.isPerson = false
        this.isData = true
        this.isVersion = false
      }
    }
  },
  computed: {
    ...mapState({
      analyzeList: ({ analyze }) => analyze.analyzeList
    }),
  },
  created() {
    if (this.analyzeListss.length === undefined) {
      this.isData = false
      this.tooltipMessage = '请选择筛选条件~~~'
    } else {
      this.isData = true
    }
  },
  mounted: function () {}
}
</script>

<style lang="less">
  @import '../../assets/style/common.less';
  #bugStatus {
    width: 600px;
    height: 400px;
    margin-top: 60px;
  }
  #personTotle {
    width: 600px;
    height: 400px;
    margin-top: 60px;
  }
  .message {
    width: 700px;
    height: 100px;
    line-height: 100px;
    margin: 60px 0 0 150px;
    font-size: 16px;
  }
  .selectStyle {
    width: 148px;
    position: absolute;
    top: 0;
    left: 645px;
  }
  .selectStyle label {
    float: left;
    width: 106px;
    height: 32px;
    line-height: 32px;
    padding-right: 10px;
  }
  #versionTotle {
    width: 600px;
    height: 400px;
    margin-top: 60px;
  }
</style>
