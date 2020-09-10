<template>
  <div class="project">
    <Files></Files>
    <!-- <div class="cut-line">
      文档上传
    </div> -->
    <!-- <UploadExcel></UploadExcel> -->
    <div class="cut-line">
      <div class="cut-line-title">项目信息</div>
      <div class="cut-line-solt"><UploadExcel></UploadExcel></div>
    </div>
    <Info></Info>
  </div>
</template>

<script>
import Files from './Files'
import Info from './Info'
import UploadExcel from './Upload'
export default {
  name: 'project',
  components: {
    Files,
    Info,
    UploadExcel
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="less">
  .cut-line {
    width: 100%;
    border-bottom:2px solid #1cc09f;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .cut-line-title {
    flex-basis: 400px;
    line-height: 50px;
  }
</style>
