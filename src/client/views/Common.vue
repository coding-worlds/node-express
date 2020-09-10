<template>
  <div class="common-view">
    <Header></Header>
    <div class="content">
      <div class="content-left">
        <Nav></Nav>
      </div>
      <div class="content-right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header'
import Nav from '../components/Nav'
export default {
  name: 'login',
  components: {
    Header,
    Nav
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
  @import '../assets/style/common.less';
  .common-view {
    width: 100%;
    height: 100%;
  }
  .content {
    display: flex;
    width: 100%;
    height: calc(100% - 60px);
  }
  .content-left {
    flex-basis: @navWidth;
    background-color: @darkColor;
    padding-top: 28px;
    left: 0px;
  }
  .content-right {
    flex: 1;
    background-color: @wallColor;
    padding: 15px 30px;
  }
</style>
