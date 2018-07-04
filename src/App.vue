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
<style>
  @font-face {
    font-family: 'iconfont';  /* project id 669716 */
    src: url('//at.alicdn.com/t/font_669716_nh3zvd2q02g9zfr.eot');
    src: url('//at.alicdn.com/t/font_669716_nh3zvd2q02g9zfr.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_669716_nh3zvd2q02g9zfr.woff') format('woff'),
    url('//at.alicdn.com/t/font_669716_nh3zvd2q02g9zfr.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_669716_nh3zvd2q02g9zfr.svg#iconfont') format('svg');
  }
  .iconfont{
    font-family:"iconfont" !important;
    font-size:16px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
