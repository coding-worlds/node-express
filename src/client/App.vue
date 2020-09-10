<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  body, html {
    width: 100%;
    height: 100%;
  }
  ul, ol { list-style: none}
  #app {
    font-family: 'Open Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333;
    width: 100%;
    height: 100%;
  }
</style>
