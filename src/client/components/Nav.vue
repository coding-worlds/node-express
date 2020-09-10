<template>
  <div class="Nav">
    <Menu :accordion="true" @on-select="selectedMenu" :active-name="activeMenu">
      <MenuItem name="project">
          <Icon type="android-person"></Icon>
          项目清单
      </MenuItem>
      <MenuItem name="analyze">
          <Icon type="ios-monitor"></Icon>
          BUG列表分析
      </MenuItem>
      <MenuItem  name="settings">
          <Icon type="ios-list-outline"></Icon>
          设置
      </MenuItem>
    </Menu>
  </div>
</template>

<script>
export default {
  name: 'Nav',
  data () {
    return {
      activeMenu: ''
    }
  },
  computed: {
    path () {
      return this.$route.path
    }
  },
  methods: {
    selectedMenu(name) {
      this.$router.push(`/${name}`)
    }
  },
  watch: {
    'path' (val) {
      this.activeMenu = val.replace('/', '')
    }
  },
  created () {
    this.activeMenu = this.path.replace('/', '')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import '../assets/style/common.less';
  .Nav {
    width: 100%;
    .ivu-menu-light {
      width: 100% !important;
      background-color: @darkColor;
      color: #B5B5B5;
      position: static;
      // font-weight: 500;
    }
    .ivu-menu-item {
      border-bottom:1px solid rgba(107, 108, 109, 0.19);
      color: @lightColor;
    }
    .ivu-menu-item:hover {
      background-color: transparent;
    }
    .ivu-menu-item-selected {
      background-color: @lightColor !important;
      color: #fff !important;
      border-right: 0 !important;
    }
    .ivu-icon-ios-arrow-down:before {
      content: "";
    }
    .ivu-menu-item > i {
      margin-right: 28px;
      font-size: 18px;
    }
    .ivu-menu-vertical.ivu-menu-light:after {
      display: none;
    }
  }
</style>
