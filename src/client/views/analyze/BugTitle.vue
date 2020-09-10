<template>
    <Table height="600" border :columns="titleList" :data="bugDateLists"></Table>
</template>
<script>
  import moment from 'moment'
  export default {
    props: {
      detailsList: { type: Array }
    },
    data () {
      return {
        titleList: [],
        bugDateLists: []
      }
    },
    watch: {
      detailsList: {
        handler: function(newValue) {
          this.titleList = []
          this.bugDateLists = []
          const pointsCopy = JSON.parse(JSON.stringify(newValue))
          var p = 1
          for (var j = 0; j < pointsCopy.length; j++) {
            delete pointsCopy[j].pid
            delete pointsCopy[j].description
            for (var obj in pointsCopy[j]) {
              if (obj === '_id') {
                pointsCopy[j][obj] = p
                p++
              }
              if (obj === 'createTime') {
                pointsCopy[j][obj] = moment(parseInt(pointsCopy[j][obj])).format('YYYY-MM-DD')
              }
            }
            this.bugDateLists.push(pointsCopy[j])
          }
          for (var keys in pointsCopy[0]) {
            var titles = ''
            switch (keys) {
              case '_id':
                titles = '序号'
                break;
              // case 'pid':
              //   titles = '项目'
              //   break;
              case 'bid':
                titles = 'BUG号'
                break;
              case 'title':
                titles = 'bug标题'
                break;
              case 'edition':
                titles = '版本'
                break;
              case 'state':
                titles = '状态'
                break;
              case 'founder':
                titles = '测试人员'
                break;
              case 'personliable':
                titles = '所属人员'
                break;
              case 'seriousness':
                titles = '严重性'
                break;
              // case 'description':
              //   titles = '描述'
              //   break;
              case 'createTime':
                titles = '创建时间'
                break;
              case 'priority':
                titles = '优先级'
                break;
            }
            var width = 80
            if (titles === 'bug标题') {
              width = 300
            } else if (titles === '序号') {
              width = 50
            } else if (titles === '严重性' || titles === '优先级') {
              width = 110
            } else if (titles === 'BUG号') {
              width = 105
            }
            const titleEle = {
              title: titles,
              key: keys,
              align: 'center',
              minWidth: width
            }
            this.titleList.push(titleEle)
          }
        },
        deep: true
      }
    }
  }
</script>