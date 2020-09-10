<template>
  <div class="version" style="position: relative">
    <div v-show="isData" ref='versionAnly' id="versionAnly"></div>
    <div v-show="isData" class="selectStyle">
      <label>请选择统计类型</label>
      <Select v-model="model1" @on-change="changeStyle">
        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <div v-show="!isData" class="message">{{tooltipMessage}}</div>
    <Modal :detailsList="detailsList" v-on:getPoints="getPoints" :isShow="isShow"></Modal>
  </div>
</template>

<script>
import Modal from './Modal.vue'
import { mapState } from 'vuex'
export default {
  name: 'version',
  components: {
    Modal
  },
  props: {
    analyzeListss: { type: Object }
  },
  data () {
    return {
      model1: 'version',
      cityList: [
        {
          value: 'version',
          label: '版本统计'
        },
        {
          value: 'person',
          label: '人员统计'
        }
      ],
      detailsList: [],
      isShow: false,
      tooltipMessage: '暂无数据~~~',
      isData: true,
      sourceDataArr: [],
      bugStateColorList: ['#77b0d7', '#5a84a1', '#485669', '#61a0a8', '#749f83', '#c23531', '#ca8622', '#bda29a', '#96989d'],
      bugSurColorList: ['#f80b16', '#e0aa5a', '#bec56d', '#549e6e', '#5991de'],
      barData: {
        title: {
          text: '',
          show: true,
          padding: 5,
          left: '400', // left、center、right、auto、20、 '20%'
          top: 'auto', // 'top', 'middle', 'bottom'、20、 '20%'
          right: 'auto', // 20、 '20%'
          bottom: '0', // 20、 '20%'
          textStyle: {
            // fontWeight: 'normal',
            fontSize: 16
          }
        },
        color: [],
        legend: {
          show: true,
          type: 'scroll', // scroll、plain
          width: '300px',
          height: '250px',
          // left: 'left', // left、center、right、auto、20、 '20%'
          // align: 'left',
          top: '45', // 'top', 'middle', 'bottom'、20、 '20%'
          right: '0', // 20、 '20%'
          // bottom: '20', // 20、 '20%'
          orient: 'vertical', // vertical、horizontal 图例列表的布局朝向
          selectedMode: true,
          data: [],
          pageButtonGap: 20
          // selected: {
          //   'Submitted': false
          // }
        },
        grid: {
          right: 200,
          left: 100,
          top: 50
        },
        tooltip: {
          // axisPointer: {
          //   type: 'line'
          // },
          // show: true,
          // trigger: 'axis',
          // showContent: true,
          // // enterable: false
          // // position: [10, 10]
          // formatter: function(prams) {
          //   // console.log(prams, 'prams')
          //   return '等级<br />'
          //          + prams[0].seriesName + ':' + prams[0].data[1] + '<br />'
          //          + prams[1].seriesName + ':' + prams[1].data[2]
          //          + '<br />状态<br />'
          //          + prams[2].seriesName + ':' + prams[2].data[3] + '<br />'
          //          + prams[3].seriesName + ':' + prams[3].data[4]
          // }
        },
        dataset: { // 数据集
          // dimensions: ['product', '一级', '二级', 'A', 'B'],
          source: [
            // ['product', 'A', 'B', 'C', 'D'],
            // ['V1', 43.3, 85.8, 93.7, 50],
            // ['V2', 83.1, 73.4, 55.1, 30],
            // ['V3', 86.4, 65.2, 82.5, 40],
            // ['V4', 72.4, 53.9, 39.1, 60]
            // { product: 'V1', '一级': 43.3, '二级': 85.8, 'A': 93.7, 'B': 50 },
            // { product: 'V2', '一级': 83.1, '二级': 73.4, 'A': 55.1, 'B': 30 },
            // { product: 'V3', '一级': 86.4, '二级': 65.2, 'A': 82.5, 'B': 40 },
            // { product: 'V4', '一级': 72.4, '二级': 53.9, 'A': 39.1, 'B': 60 }
          ]
        },
        xAxis: {
          type: 'category', // 坐标轴类型 将第一列映射到x轴上 value category time log
          position: 'bottom', // top
          name: '版本号'
        }, 
        yAxis: {
          name: 'bug数量',
          nameGap: 25
        },
        series: []
      }
    }
  },
  computed: {
    ...mapState({
      analyzeList: ({ analyze }) => analyze.analyzeList,
      stateLists: ({ analyze }) => analyze.stateLists
    }),
  },
  watch: {
    analyzeListss: {
      handler: function(newValue) {
        this.viewDatas(this.model1)
      },
      deep: true
    },
  },
  methods: {
    viewDatas(arg) {
      var _this = this
      this.sourceDataArr = []
      this.barData.series = []
      const productArr = ['product']
      const bugLists = this.analyzeList.lists
      const statusList = this.analyzeList.result.state
      const bugGradeList = this.analyzeList.result.BUGGrade
      for (var i = 0; i < Object.keys(statusList).length; i++) {
        productArr.push(Object.keys(statusList)[i])
        const seriesSrr = {
          type: 'bar',
          stack: 'stu',
          barWidth: 20
        }
        const legendIcon = {
          name: Object.keys(statusList)[i],
          icon: 'circle'
        }
        this.barData.series.push(seriesSrr)
        this.barData.legend.data.push(legendIcon)
        this.barData.color = this.bugStateColorList
      }
      for (var i = 0; i < Object.keys(bugGradeList).length; i++) {
        productArr.push(Object.keys(bugGradeList)[i])
        const seriesSrr = {
          type: 'bar',
          stack: 'grade',
          barWidth: 20
        }
        const legendIcon = {
          name: Object.keys(bugGradeList)[i],
          icon: 'roundRect'
        }
        this.barData.series.push(seriesSrr)
        this.barData.legend.data.push(legendIcon)
        for (var k = 0; k < this.bugSurColorList.length; k++) {
          this.barData.color.push(this.bugSurColorList[k])
        }
      }
      this.sourceDataArr.push(productArr)
      var editionsList
      if (arg === 'version') {
        editionsList = this.analyzeList.result.editions
        this.barData.title.text = '项目版本统计'
      } else {
        editionsList = this.analyzeList.result.personliables
        this.barData.title.text = '人员统计'
      }
      if (editionsList.length === 0) {
        this.isData = false
        this.tooltipMessage = '暂无数据~~~'
        return
      } else {
        this.isData = true
      }
      for (var key in editionsList) {
        for (var keys in editionsList[key]) {
          this.versionData(keys, editionsList[key][keys])
        }
      }
      this.barData.dataset.source = this.sourceDataArr
      var echarts = require('echarts')
      var myCharts = echarts.init(this.$refs.versionAnly)
      myCharts.setOption(this.barData)
      myCharts.on('click', function (params) {
        _this.detailsList = []
        _this.isShow = true
        for (var i = 0; i < bugLists.length; i++) {
          for (var j in bugLists[i]) {
            if (arg === 'version') {
              if (j === 'edition' && bugLists[i][j] === params.name) {
                for (var o in bugLists[i]) {
                  if (o === 'state' && bugLists[i][o] === params.seriesName) {
                    _this.detailsList.push(bugLists[i])
                  }
                  if (o === 'seriousness' && bugLists[i][o] === params.seriesName) {
                    _this.detailsList.push(bugLists[i])
                  }
                }
              }
            } else {
              if (j === 'personliable' && bugLists[i][j] === params.name) {
                for (var o in bugLists[i]) {
                  if (o === 'state' && bugLists[i][o] === params.seriesName) {
                    _this.detailsList.push(bugLists[i])
                  }
                  if (o === 'seriousness' && bugLists[i][o] === params.seriesName) {
                    _this.detailsList.push(bugLists[i])
                  }
                }
              }
            }
          }
        }
      })
    },
    changeStyle(val) {
      if (val === 'person') {
        this.viewDatas('person')
      } else {
        this.viewDatas('version')
      }
    },
    getPoints(arg) {
      this.isShow = arg
    },
    versionData(key, prams) {
      const sourceVersion = [key]
      for (var keysState in prams.state) {
        sourceVersion.push(prams.state[keysState])
      }
      for (var keysGrade in prams.BUGGrade) {
        sourceVersion.push(prams.BUGGrade[keysGrade])
      }
      this.sourceDataArr.push(sourceVersion)
    }
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
  #versionAnly {
    width: 1000px;
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
    top: -40px;
    left: 652px;
  }
  .selectStyle label {
    float: left;
    width: 106px;
    height: 32px;
    line-height: 32px;
    padding-right: 10px;
  }
</style>
