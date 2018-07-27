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
      <el-menu-item index="2">任务</el-menu-item>

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
          this.$emit('getMenuIndex',key);
          this.activeIndex=key
          console.log(this.activeIndex)
          if(key==1)
          {
            this.$router.push('/HomePage');
          }
          else if (key==2)
          {
            this.$router.push('/TaskList');
          }
        }
      }
    }
</script>

<style scoped>

</style>
