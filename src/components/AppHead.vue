<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="1">课程</el-menu-item>
      <el-menu-item index="2">制作队列</el-menu-item>

      <!--<el-menu-item index="3">课程列表2</el-menu-item>-->

    </el-menu>
  </div>
</template>

<script>
    export default {
      name: "appHead",
      data() {
        return {
          activeIndex: '1'
        }
      },
      mounted() {
        this.$emit('getMenuIndex',this.activeIndex)
        console.log(this.activeIndex)
      },
      methods: {
        handleSelect(key, keyPath) {
          //取得整个地址栏
          let UrlStr=location.href,num=UrlStr.indexOf("?");
          //取得所有参数
          UrlStr=UrlStr.substr(num+1);
          this.$emit('getMenuIndex',key);
          this.activeIndex=key
          console.log(this.activeIndex)
          if(key==1)
          {
            this.$router.push('/HomePage?'+UrlStr);
          }
          else if (key==2)
          {
            this.$router.push('/TaskList?'+UrlStr);
          }
        }
      }
    }
</script>

<style scoped>

</style>
