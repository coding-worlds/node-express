<template>
  <div class="header">
    <div class="logo" @click="goback">
      <Icon type="bug">
      </Icon>
      Error Analysis
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
    }
  },
  methods: {
    goback() {
      this.$router.push('/project')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import '../assets/style/common.less';
  .header {
    height: 60px;
    width: 100%;
    background-color: @lightColor;
    display: flex;
    .logo {
      width: 260px;
      background-color: @darkColor;
      color: #fff;
      line-height: 60px;
      font-size: 20px;
      font-weight: 800;
      i {
        font-size: 32px;
        margin-left: 24px;
        margin-right: 8px;
        position: relative;
        top: 3px;
      }
    }
    .logo:hover {
      color: @lightColor;
      cursor: pointer;
      background-color: rgb(43, 46, 51);
    }
  }
</style>
