<template>
  <div class="main-div">
    <app-head @getMenuIndex="getMenuIndexVal"></app-head>
    <el-row :gutter="20">
      <el-col :span="5">
        <div class="grid-content bg-purple" style="margin-top: 12px">
          <el-tree :data="type" @node-click="handleNodeClick"></el-tree>
        </div>
      </el-col>
      <el-col :span="15">
        <div class="grid-content bg-purple">
          <div style="margin: 20px 10px 0px 10px">
            <span class="demonstration"></span>
            <el-input
              v-model="SearchName"
              placeholder="搜索"
              style="width: 500px; margin-right: 30px;margin-bottom: 20px"
            >
            </el-input>
            <el-switch
              v-model="SearchType"
              active-text="所有分类"
              inactive-text="当前分类"
              inactive-color="#13ce66">
            </el-switch>
            <el-button type="primary" size="mini" style="margin-left: 30px" @click="DataSearch">搜索</el-button>
            <!--<el-cascader
              placeholder="可输入搜索"
              :options="type"
              filterable
              clearable
              :props="{ expandTrigger: 'hover' }"
              size="medium"
              @change="handleTypeChange">
            </el-cascader>-->
            <el-card class="box-card" style="width: 600px; height: 200px; margin-top: 20px;margin-bottom: 20px" v-show="AddBox==true">
              <div style="margin-bottom: 15px">新增至：{{CurrentTypePath}}</div>
              <el-input v-model="CurrentDocumentTitle" placeholder="先填写文档标题"></el-input>
              <div>_</div>
              <el-upload
                class="upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple
                :limit="1"
                :on-exceed="handleFileExceed"
                :file-list="FileList"
                :http-request="uploadFile"
              >
                <el-button size="mini" type="primary">选择文件/一键上传</el-button>
                <div slot="tip" class="el-upload__tip">_</div>
              </el-upload>
            </el-card>
          </div>
          <el-table
            :data="DocumentList"
            style=""
            v-loading="loading">
            <el-table-column prop="title" label="名称" width="400"></el-table-column>
            <!--<el-table-column prop="type" label="文档类型" width="200"></el-table-column>-->
            <el-table-column prop="type1" label="环节" width="120"></el-table-column>
            <el-table-column prop="type2" label="知识类目" width="120"></el-table-column>
            <el-table-column prop="category" label="类型" width="200"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleDownload(scope.$index, scope.row)">下载</el-button>
                <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" v-show="EditType.includes(scope.row.categoryid)?true:false">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
    name: "DocumentEdit",
    components: {
      appHead
    },
    data() {
      return {
        //导航信息
        MenuIndex: 5,
        //用户
        UserId: '',
        MyToken:'',
        userName:'',
        userPassword:'',
        userType:'',
        keyStr:'',
        //
        UserRole:'',
        IsEdit:false,
        AddBox:false,
        SearchType:true,
        SearchName:'',
        //
        type: [],
        EditType:[],
        CurrentType:'',
        CurrentTypePath:'',
        DocumentList:[],
        CurrentDocumentTitle:'',
        CurrentDocumentId:'',
        FileList:[],
        loading:false
      }
    },
    mounted(){
      //
      var GlobalThis = this;
      this.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      Request = this.getRequest();
      var modeLogin = this.decode(Request["login"]);
      var modeUserName = modeLogin.split('_')[0];
      var modePassword = modeLogin.split('_')[1];
      this.userName = modeUserName;
      this.userPassword = modePassword;
      GlobalThis.$http.post('http://newpms.cei.cn/api-token-auth/', {
        "username": modeUserName,
        "password": modePassword
      })
        .then(function (response) {
          if (response.status == 200) {
            localStorage.setItem('mytoken', response.data.token);
            localStorage.setItem('myusername', modeUserName);
            localStorage.setItem('myuserpass', modePassword);
            GlobalThis.MyToken = response.data.token;
            GlobalThis.userName = modeUserName;
            console.log(GlobalThis.MyToken);
            //
          }
        })
        .catch(function (error) {
          console.log(error);
        })
      //
      this.$http.post('http://newpms.cei.cn/ApiLogin/', {"username": modeUserName, "password": modePassword})
        .then(function (response) {
          console.log('login', response);
          localStorage.setItem('myusertype', response.data.group);
          GlobalThis.userType = response.data.group;
          var UserRoleList = GlobalThis.userType.split(';');
          var UseBrowse="";
          var UserEdit="";
          UserRoleList.forEach(function(r) {
            if(r.search('Doc_browse') != -1){
              UseBrowse=r;
              GlobalThis.UserRole=r;
            }
            if(r.search('Doc_edit') != -1){
              UserEdit=r;
            }
          });
          axios.get("http://newpms.cei.cn/DocumentCategory/?role="+UseBrowse, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
            .then(function (response) {
              GlobalThis.type=GlobalThis.null2str(response.data);
            });
          axios.get("http://newpms.cei.cn/DocumentEditCategory/?role="+UserEdit, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
            .then(function (response) {
              GlobalThis.EditType=GlobalThis.null2str(response.data);
              //console.log(GlobalThis.EditType);
            });
        });
    },
  methods: {
    //appHead
    getMenuIndexVal(index)
    {
      this.MenuIndex = index;
      //console.log(this.MenuIndex);
    },
    handleTypeChange(val) {
      var GlobalThis = this;
      this.CurrentType=val[2];
      this.IsEdit= this.in_array(this.CurrentType,this.EditType);
      if(this.CurrentType != "" && this.CurrentType != null && this.CurrentType != undefined && this.IsEdit){
        this.AddBox = true;
      }
      else {this.AddBox = false; }
      if(this.CurrentType != "" && this.CurrentType != null && this.CurrentType != undefined){
      axios.get("http://newpms.cei.cn/document/?category="+ this.CurrentType, {headers: {'Authorization': 'JWT ' + this.MyToken}})
        .then(function (response) {
          GlobalThis.DocumentList = GlobalThis.null2str(response.data);
        });
      }
    },
    handleNodeClick(data, node, obj){
      var GlobalThis = this;
      if(node.level === 3){
        this.CurrentType=data.value;
        this.CurrentTypePath= node.parent.parent.data.label+" --> "+node.parent.data.label+" --> "+data.label
        console.log(node);
        this.IsEdit= this.in_array(this.CurrentType,this.EditType);
        if(this.CurrentType != "" && this.CurrentType != null && this.CurrentType != undefined && this.IsEdit){
          this.AddBox = true;
        }
        else {this.AddBox = false; }
        if(this.CurrentType != "" && this.CurrentType != null && this.CurrentType != undefined){
          axios.get("http://newpms.cei.cn/document/?category="+ this.CurrentType, {headers: {'Authorization': 'JWT ' + this.MyToken}})
            .then(function (response) {
              GlobalThis.DocumentList = GlobalThis.null2str(response.data);
            });
        }
      }
      else {
        this.CurrentType='';
        this.AddBox=false;
        this.DocumentList=[];
      }
    },
    handleFileExceed(files, FileList) {
      this.$message.warning(`只能上传1个文件`);
    },
    uploadFile(param) {
      const formdata = new FormData()
      formdata.append('doc', param.file)
      formdata.append('user', this.userName)
      formdata.append('id', this.CurrentDocumentId)
      formdata.append('name',  this.CurrentDocumentTitle)
      formdata.append('type', this.CurrentType)
      var GlobalThis = this;
      this.$axios({
        method: 'post',
        url: 'http://newpms.cei.cn/UpdateDocument/',
        data: formdata
      }).then(function (res) {
        if (res.status == 202) {
          GlobalThis.FileList=[];
          GlobalThis.$message({
            type: 'warning',
            message: res.data.res
          });
        }
        if (res.status == 200) {
          GlobalThis.$message({
            type: 'success',
            message: `已上传`
          }),
            axios.get("http://newpms.cei.cn/document/?category="+ GlobalThis.CurrentType, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
              .then(function (response) {
                GlobalThis.DocumentList = GlobalThis.null2str(response.data);
              }),
            GlobalThis.FileList=[]
        }
      })
    },
    handleDownload(index, row) {
      this.CurrentDocumentTitle=row.title;
      this.CurrentDocumentId=row.id;
      window.open('http://newpms.cei.cn/DocumentFile/' + row.id + row.path);
      console.log(this.CurrentDocumentTitle,this.CurrentDocumentId);
    },
    handleDelete(index, row){
      var GlobalThis = this;
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get("http://newpms.cei.cn/DeleteDocument/?id="+ row.id, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
          .then(function (response) {
            axios.get("http://newpms.cei.cn/document/?category="+ GlobalThis.CurrentType, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
              .then(function (response) {
                GlobalThis.DocumentList = GlobalThis.null2str(response.data);
              })
          })
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    DataSearch(){
      var GlobalThis = this;
      if(this.SearchType)
      {
        axios.get("http://newpms.cei.cn/documentall/?role="+ GlobalThis.UserRole+"&name="+GlobalThis.SearchName, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
          .then(function (response) {
            GlobalThis.DocumentList = GlobalThis.null2str(response.data);
          })
      }
      else {
        axios.get("http://newpms.cei.cn/document/?category="+ GlobalThis.CurrentType+"&name="+GlobalThis.SearchName, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
          .then(function (response) {
            GlobalThis.DocumentList = GlobalThis.null2str(response.data);
          })
      }
    },
    in_array(stringToSearch, arrayToSearch) {
    for (var s = 0; s < arrayToSearch.length; s++) {
       var thisEntry = arrayToSearch[s].toString();
      if (thisEntry == stringToSearch) {
        return true;
      }
    }
    return false;
  },
    isIntNum(val){
    var regPos = / ^\d+$/; // 非负整数
    var regNeg = /^\-[1-9][0-9]*$/; // 负整数
    if(regPos.test(val) && regNeg.test(val)){
      return true;
    }else{
      return false;
    }
  },
  getRequest() {
      var url = unescape(window.location.href); //获取url中"?"符后的字串
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.split("?")[1];
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    },
    decode(input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (i < input.length) {
        enc1 = this.keyStr.indexOf(input.charAt(i++));
        enc2 = this.keyStr.indexOf(input.charAt(i++));
        enc3 = this.keyStr.indexOf(input.charAt(i++));
        enc4 = this.keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }
      output = this._utf8_decode(output);
      return output;
    },
    _utf8_decode(utftext) {
      var string = "";
      var i = 0;
      var c, c1, c2, c3;
      c = c1 = c2 = 0;
      while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if ((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
      return string;
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
  .el-cascader--medium{
    width: 600px;
  }
</style>
