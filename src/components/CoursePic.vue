<template>
  <div class="main-div">
    <app-head @getMenuIndex="getMenuIndexVal"></app-head>
    <el-row :gutter="20">
      <el-col :span="5">
        <div class="grid-content bg-purple" style="margin-top: 12px">
          <el-tree :load="loadNode"
                   :props="props"
                   lazy
                   @node-click="handleNodeClick"></el-tree>
        </div>
      </el-col>
      <el-col :span="15">
        <div class="grid-content bg-purple">
          <div style="margin: 0px 10px 0px 10px">
            <div v-for="pic in PicList" :key="pic.name" style="margin:20px 15px 0px 15px;float: left">
              <el-image
                style="width: 100px; height: 100px"
                :src="pic.url"
                fit="scale-down"></el-image>
              <span class="demonstration">{{ pic.name }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import appHead from '@/components/AppHead.vue'

    export default {
      name: "CoursePic",
      components: {
        appHead
      },
      data() {
        return {
          //导航信息
          MenuIndex: 6,
          //用户
          UserId: '',
          MyToken:'',
          userName:'',
          userPassword:'',
          userType:'',
          keyStr:'',
          //
          props: {
            label: 'label',
            isLeaf: 'isLeaf'
          },
          //
          UserRole:'',
          //
          PicList:[],
          CurrentPath:''
        }
      },
      mounted(){
        var GlobalThis = this;
        axios.get("http://newpms.cei.cn/DPicFile/?path=", {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
          .then(function (response) {
            GlobalThis.PicList=GlobalThis.null2str(response.data);
          });
      },
      methods: {
        //appHead
        getMenuIndexVal(index)
        {
          this.MenuIndex = index;
          //console.log(this.MenuIndex);
        },
        loadNode(node, resolve) {
          var GlobalThis = this;
          var CurrentPath='';
          console.log(CurrentPath);
          if (node.data){
            CurrentPath=node.data.value;
          }
          console.log(node.data);
          axios.get("http://newpms.cei.cn/DPicFileDir/?path="+CurrentPath, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
            .then(function (response) {
              if (node.level === 0) {
                return resolve(GlobalThis.null2str(response.data));
              }
              else{
                return resolve(GlobalThis.null2str(response.data));
              }
            });
        },
        handleNodeClick(data, node, obj){
          this.CurrentPath=data.value;
          var GlobalThis = this;
          axios.get("http://newpms.cei.cn/DPicFile/?path="+GlobalThis.CurrentPath, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
            .then(function (response) {
              GlobalThis.PicList=GlobalThis.null2str(response.data);
            });
        },
        null2str(data) {
          for (let x in data) {
            if (data[x] === null) { // 如果是null 把直接内容转为 ''
              data[x] = '';
            } else {
              if (Array.isArray(data[x])) { // 是数组遍历数组 递归继续处理
                data[x] = data[x].map(z => {
                  return this.null2str(z);
                });
              }
              if (typeof(data[x]) === 'object') { // 是json 递归继续处理
                data[x] = this.null2str(data[x])
              }
            }
          }
          return data;
        }
      }
    }
</script>

<style scoped>
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
</style>
