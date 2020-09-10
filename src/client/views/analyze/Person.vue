<template>
  <div class="person">
    <div v-show="isData" ref='personAnly' id="personAnly"></div>
    <div v-show="!isData" class="message">{{tooltipMessage}}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'person',
  props: {
    analyzeListss: { type: Object }
  },
  data () {
    return {
      tooltipMessage: '暂无数据~~~',
      isData: true,
      sourceDataArr: [],
      barData: {
        title: {
          text: '人员统计',
          show: true,
          padding: 5,
          left: 'center', // left、center、right、auto、20、 '20%'
          top: 'auto', // 'top', 'middle', 'bottom'、20、 '20%'
          right: 'auto', // 20、 '20%'
          bottom: '0', // 20、 '20%'
          textStyle: {
            // fontWeight: 'normal',
            fontSize: 16
          }
        },
        legend: {
          show: true,
          type: 'scroll', // scroll、plain
          width:'500px',
          // height: '250px',
          // left: '300', // left、center、right、auto、20、 '20%'
          // align: 'left',
          top: '0', // 'top', 'middle', 'bottom'、20、 '20%'
          // right: '0', // 20、 '20%'
          // bottom: '20', // 20、 '20%'
          orient: 'horizontal', // vertical、horizontal 图例列表的布局朝向
          selectedMode: true,
          data: [],
          pageButtonGap: 20
          // selected: {
          //   'Submitted': false
          // }
        },
        tooltip: {},
        dataset: {
          source: [
            // ['product', '一级', '二级', 'A', 'B'],
            // ['张祎', 43.3, 85.8, 93.7, 50],
            // ['胡权', 83.1, 73.4, 55.1, 30],
            // ['邓波', 86.4, 65.2, 82.5, 40],
            // ['张楠', 72.4, 53.9, 39.1, 60]
          ]
        },
        xAxis: {
          type: 'category', // 坐标轴类型 将第一列映射到x轴上 value category time log
          // grideIndex: 3
          position: 'bottom', // top
          name: '人员',
          axisLine: { // 轴线相关
            // show: true
            // symbol: 'arrow'
          }
        }, 
        yAxis: {},
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
        this.sourceDataArr = []
        this.barData.series = []
        const productArr = ['product']
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
        }
        this.sourceDataArr.push(productArr)
        const personliableList = this.analyzeList.result.personliables
        if (personliableList.length === 0) {
          this.isData = false
          this.tooltipMessage = '暂无数据~~~'
          return
        } else {
          this.isData = true
        }
        for (var key in personliableList) {
          for (var keys in personliableList[key]) {
            this.versionData(keys, personliableList[key][keys])
          }
        }
        this.barData.dataset.source = this.sourceDataArr
        var echarts = require('echarts')
        var myCharts = echarts.init(this.$refs.personAnly)
        myCharts.setOption(this.barData)
      },
      deep: true
    },
  },
  methods: {
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
   #personAnly {
    width: 700px;
    height: 400px;
    margin-top: 60px;
  }
</style>
