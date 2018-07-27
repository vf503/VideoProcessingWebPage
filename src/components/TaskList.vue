<template>
  <div class="main-div">
    <app-head @getMenuIndex="getMenuIndexVal"></app-head>
    <el-tag>执行队列</el-tag>
    <el-table
      :data="WaitingTask"
      style="width: 100%"
      max-height="400">
      <el-table-column
        fixed
        prop="id"
        label="编号"
        width="120">
      </el-table-column>
      <el-table-column
        fixed
        prop="CreateDate"
        label="创建日期"
        width="200">
      </el-table-column>
      <el-table-column
        prop="TaskType"
        label="类型"
        width="200">
      </el-table-column>
      <el-table-column
        prop="TaskState"
        label="状态"
        width="120">
      </el-table-column>
      <el-table-column
        prop="creator"
        label="创建人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="TaskNote"
        label="说明"
        width="300">
      </el-table-column>
    </el-table>
    <el-tag>个人任务</el-tag>
    <el-table
      :data="OwnTask"
      style="width: 100%"
      max-height="400">
      <el-table-column
        fixed
        prop="id"
        label="编号"
        width="120">
      </el-table-column>
      <el-table-column
        fixed
        prop="CreateDate"
        label="创建日期"
        width="200">
      </el-table-column>
      <el-table-column
        prop="TaskType"
        label="类型"
        width="200">
      </el-table-column>
      <el-table-column
        prop="TaskState"
        label="状态"
        width="120">
      </el-table-column>
      <el-table-column
        prop="creator"
        label="创建人"
        width="120">
      </el-table-column>Insert
      <el-table-column
        prop="TaskNote"
        label="说明"
        width="300">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from 'axios'
  import appHead from '@/components/AppHead.vue'

  export default {
    name: "TaskList",
    components: {
      appHead
    },
    data() {
      return {
        //导航信息
        MenuIndex: 1,
        //用户
        UserId: '',
        MyToken:'',
        //数据
        OwnTask:[],
        WaitingTask:[]
      }
    },
    mounted(){
      this.MyToken = localStorage.getItem('mytoken')
      this.UserId = localStorage.getItem('myusername')
      var GlobalThis = this;
      axios.get('http://newpms.cei.cn/edittask/?mode=own&userid='+this.UserId, {headers: {'Authorization': 'JWT ' + this.MyToken}})
        .then(function (response) {
          GlobalThis.OwnTask=response.data
        })
      axios.get('http://newpms.cei.cn/edittask/?mode=waiting', {headers: {'Authorization': 'JWT ' + this.MyToken}})
        .then(function (response) {
          GlobalThis.WaitingTask=response.data
        })
    },
    methods: {
      //appHead
      getMenuIndexVal(index) {
        this.MenuIndex = index;
        //console.log(this.MenuIndex);
      }
    }
  }
</script>

<style scoped>

</style>
