<template>
  <div class="main-div">
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple" style="margin-top: 12px">
          <el-tree :data="CategoryTreeData"
                   :props="TreeProps"
                   @node-click="handleNodeClick"
                   default-expand-all
          ></el-tree>
        </div>
      </el-col>
      <el-col :span="20">
        <el-card v-show="isCourse">
          <div slot="header">
            <span>当前课件：{{ CurrentCourseName }}</span>
          </div>
          <div>
            <span style="vertical-align: center">当前状态：</span>
            <el-image
              style="width: 160px;"
              :src="CoursePicSrc"
              :preview-src-list="PreviewCoursePic"
              fit="scale-down">
              <div slot="error" class="image-slot">
                未选定
              </div>
            </el-image>
          </div>
        </el-card>
        <div style="margin-bottom: 15px">当前选定栏目：{{CurrentCategoryName}}</div><el-button type="primary" size="mini" style="margin-left: 30px" @click="handleCleanCategory()">清空选定栏目</el-button>
        <el-card class="box-card" style="width: 600px; height: 200px; margin-top: 20px;margin-bottom: 20px" v-show="CategoryAddBox==true">
          <el-input v-model="NewCategoryName" placeholder="填写栏目标题"></el-input>
          <el-button type="primary" size="mini" style="margin-left: 10px;margin-top: 20px" @click="handleCategoryEdit('new')">新增</el-button>
        </el-card>
        <el-card class="box-card" style="width: 600px; height: 200px; margin-top: 20px;margin-bottom: 20px" v-show="CategoryEditBox==true">
          <el-input v-model="CurrentCategoryName" placeholder=""></el-input>
          <el-button type="primary" size="mini" style="margin-left: 10px;margin-top: 20px" @click="handleCategoryEdit('edit')">修改</el-button>
        </el-card>
        <el-card class="box-card" style="width: 600px; height: 70px; margin-top: 10px;margin-bottom: 10px" v-show="CategoryEditBtnBox==true">
          <el-button type="primary" size="mini" style="margin-left: 30px" @click="OpenCategoryAddBox" v-text="CategoryAddBtnText"></el-button>
          <el-button type="primary" size="mini" style="margin-left: 30px" @click="OpenCategoryEditBox" v-text="CategoryEditBtnText"></el-button>
          <el-button type="primary" size="mini" style="margin-left: 30px" @click="handleCategoryDelete">删除栏目</el-button>
          <el-button type="primary" size="mini" style="margin-left: 30px" @click="OpenPicAddBox">上传图片</el-button>
        </el-card>
        <div>
          <el-input
            v-model="SearchText"
            placeholder="搜索"
            style="width: 500px; margin-right: 30px;margin-bottom: 20px"
          >
          </el-input>
          <el-button type="primary" size="mini" style="margin-left: 10px" @click="PicSearch">搜索</el-button>
        </div>
        <div>
          <div style="margin: 0px 10px 0px 10px">
            <div v-for="pic in CurrentPicList" :key="pic.id" style="margin:20px 15px 0px 15px;float: left">
              <el-image
                style="width: 100px; height: 100px"
                :src="pic.FilePath"
                @click.native="handlePicClick(pic)"
                fit="scale-down"></el-image>
              <span class="demonstration">{{ pic.name }}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-dialog
        title="图片编辑"
        :visible.sync="PicAddBox"
        class="box-card"
        style="width:50%; height: 800px; margin-top: 0px;margin-bottom: 0px;">
        <el-row :gutter="20">
          <el-input v-model="NewPicName" placeholder="填写标题(可留空)"></el-input>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px">已选标签：
          <el-tag
          v-for="tag in NewPicTags"
          :key="tag.name"
          closable
          type="success"
          @close="handleNewPicTagClose(tag)">
          {{tag.name}}
        </el-tag>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px">可选标签：
          <el-tag
          v-for="tag in AllPicTags"
          :key="tag.name"
          closable
          type="success"
          @click="handlePicTagClick(tag)"
          @close="handlePicTagClose(tag)">
          {{tag.name}}
        </el-tag>
          <el-input
          class="input-new-tag"
          v-if="NewTagVisible"
          v-model="NewTagValue"
          ref="SaveTagInput"
          size="small"
          @keyup.enter.native="handleNewTag"
          @blur="handleNewTag"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="ShowNewTagInput">+新标签</el-button>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px">
          <el-upload
          class="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
          :limit="50"
          :on-exceed="handleFileExceed"
          :file-list="NewPicFileList"
          :http-request="uploadFile">
          <el-button size="mini" type="primary" v-show="isPicEdit==false">选择文件/一键上传</el-button>
          <div slot="tip" class="el-upload__tip">_</div>
          </el-upload>
          <el-button size="mini"  type="primary"  v-show="isPicEdit" @click="handelPicEdit">修改</el-button>
          <el-button size="mini"  type="primary"  v-show="isPicEdit" @click="handelPicDel">删除</el-button>
        </el-row>
      </el-dialog>
      <el-dialog :visible.sync="PicPreviewDialogVisible">
        <el-image
          :src="CurrentPic.FilePath"
          fit="scale-down"
        >
        </el-image>
        <el-button style="float: right; margin: 10px 0px 0px 0"  type="primary" @click="OpenPicEditBox">编辑</el-button>
        <el-button style="float: right; margin: 10px 10px 0px 0"  type="primary" v-show="isCourse==true" @click="handelPicChoose">选中</el-button>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import appHead from '@/components/AppHead.vue'

  export default {
    name: "BgPicEdit",
    components: {
      appHead
    },
    data()
    {
      return {
        //用户
        UserId: '',
        MyToken:'',
        userName:'',
        userPassword:'',
        userType:'',
        keyStr:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        //
        CurrentCourseId:'',
        CurrentCourseName:'',
        CurrentCategoryName:'',
        CoursePicSrc:'',
        PreviewCoursePic:[],
        CurrentCategoryId:null,
        CurrentCategoryLevel:0,
        CurrentCategoryParent:null,
        NewCategoryName:'',
        CategoryAddBox:false,
        CategoryEditBox:false,
        CategoryEditBtnBox:true,
        CategoryAddBtnText:'新建子栏目',
        CategoryEditBtnText:'栏目编辑',
        CategoryTreeData:[],
        TreeProps: {
          children: 'children',
          label: 'name',
        },
        PicAddBox:false,
        PicPreviewDialogVisible:false,
        AllPicTags:[],
        NewPicName:'',
        NewPicTags:[],
        NewPicFileList:[],
        NewTagVisible:false,
        NewTagValue:'',
        CurrentPicList:[],
        CurrentPic:{},
        isCourse:false,
        isPicEdit:false,
        SearchText:''
      }
    },
    mounted(){
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
            axios.get("http://newpms.cei.cn/PicCategoryList/", {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
              .then(function (response) {
                GlobalThis.CategoryTreeData=GlobalThis.null2str(response.data);
              });
            //
            axios.get("http://newpms.cei.cn/PicKeyWordsList/", {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
              .then(function (response) {
                GlobalThis.AllPicTags=GlobalThis.null2str(response.data);
              });
            //
            if(GlobalThis.getRequest()["id"]){
              GlobalThis.CurrentCourseId=GlobalThis.getRequest()["id"];
              GlobalThis.CurrentCourseName=GlobalThis.getRequest2()["title"];
              GlobalThis.$http.get("http://newpms.cei.cn/course/FieldQueryExacted/?field=srcid&val=" + GlobalThis.CurrentCourseId, {headers: {'Authorization': 'JWT ' +  GlobalThis.MyToken}})
                .then(function (response) {
                  GlobalThis.CoursePicSrc=response.data[0]["BgPicFile"];
                  GlobalThis.PreviewCoursePic.push(GlobalThis.CoursePicSrc);
                  GlobalThis.isCourse=true;
                });
            }
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
        });
    },
    methods: {
      handleCleanCategory(){
          this.CurrentCourseName='',
          this.CurrentCategoryName='',
          this.CurrentCategoryId=null,
          this.CurrentCategoryLevel=0,
          this.CurrentCategoryParent=null
      },
      OpenCategoryAddBox()
      {
        if(this.CategoryAddBox==false){
          this.CategoryAddBox=true;
          this.CategoryAddBtnText='关闭新建子栏目';
        }
        else{
          this.CategoryAddBox=false;
          this.CategoryAddBtnText='新建子栏目';
        }
      },
      OpenCategoryEditBox(){
        if(this.CategoryEditBox==false){
          this.CategoryEditBox=true;
          this.CategoryEditBtnText='关闭栏目编辑';
        }
        else{
          this.CategoryEditBox=false;
          this.CategoryEditBtnText='栏目编辑';
        }
      },
      OpenPicAddBox(){
        this.isPicEdit=false;
        this.NewPicName='';
        this.NewPicTags=[];
        if(this.PicAddBox==false
          &&this.CurrentCategoryId !=null
          &&this.CurrentCategoryId !='')
        {
          this.PicAddBox=true;
        }
        else {
          this.$message({
            type: 'warning',
            message: `请先选定栏目`
          })
        }
      },
      ShowNewTagInput(){
        this.NewTagVisible = true;
        this.$nextTick(_ => {
          this.$refs.SaveTagInput.$refs.input.focus();
        });
      },
      handleNewTag(){
        let NewTagValue = this.NewTagValue;
        if ( NewTagValue !=null && NewTagValue !='')
        {
          let GlobalThis = this;
          this.$axios({
            method: 'post',
            url: 'http://newpms.cei.cn/PicKeyWordsDetail/',
            headers: {'Authorization': 'JWT ' + GlobalThis.MyToken},
            data: {
              "id":'',
              "name": NewTagValue,
            }
          }).then(function (res) {
            console.log(res);
            if (res.status == 201) {
              axios.get("http://newpms.cei.cn/PicKeyWordsList/", {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
                .then(function (response) {
                  GlobalThis.AllPicTags=GlobalThis.null2str(response.data);
                });
              GlobalThis.$message({
                type: 'success',
                message: '已添加新标签'
              });
            }
          }).catch(function (err) {
            GlobalThis.$message({
              type: 'warning',
              message: '不能添加重名标签'
            });
            console.log(err);
          })
        }
        this.NewTagVisible = false;
        this.NewTagValue = '';
      },
      handleNewPicTagClose(tag){
        var pos=this.NewPicTags.indexOf(tag);
        if(pos!=-1)
        {
          this.NewPicTags.splice(pos,1);
        }
      },
      handlePicTagClick(tag){
        var QueryData = this.NewPicTags.filter(function (t) {
          return t.id == tag.id
        });
        if (QueryData.length==0)
        {
          this.NewPicTags.push(tag);
          //console.log(this.NewPicTags);
        }
      },
      handlePicTagClose(tag){
        let GlobalThis= this
        axios.get("http://newpms.cei.cn/PicKeyWordsDetail/?delid="+tag.id, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
          .then(function (response){
            axios.get("http://newpms.cei.cn/PicKeyWordsList/", {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
              .then(function (response) {
                GlobalThis.AllPicTags = GlobalThis.null2str(response.data);
                GlobalThis.$message({
                  type: 'success',
                  message: '已删除标签'
                });
              });
          }).catch(function (err) {
            GlobalThis.$message({
              type: 'warning',
              message: '不能删除已用标签'
            });
          })
      },
      handleNodeClick(data){
        this.CurrentCategoryName=data.name;
        this.CurrentCategoryId=data.id;
        this.CurrentCategoryLevel=data.level;
        this.CurrentCategoryParent=data.parent;
        var GlobalThis = this;
        axios.get("http://newpms.cei.cn/BgPicList/?type=c&cid="+ GlobalThis.CurrentCategoryId, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
          .then(function (response) {
            GlobalThis.CurrentPicList = GlobalThis.null2str(response.data);
          })
      },
      handleCategoryDelete(){
        var GlobalThis =this;
        axios.get("http://newpms.cei.cn/PicCategoryDetail/?delid="+GlobalThis.CurrentCategoryId, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
          .then(function (response) {
            console.log(response.status)
            axios.get("http://newpms.cei.cn/PicCategoryList/", {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
              .then(function (response) {
                GlobalThis.CategoryTreeData=GlobalThis.null2str(response.data);
              });
          }).catch(function (err) {
          GlobalThis.$message({
            type: 'warning',
            message: '不能删除非最末级栏目'
          });
        });
      },
      handleCategoryEdit(type){
        var GlobalThis =this;
        var id=this.CurrentCategoryId;
        var name=this.CurrentCategoryName;
        var parent=this.CurrentCategoryParent;
        var level=this.CurrentCategoryLevel;
        if(type!='new'){

        }
        else{
          id='';
          name= this.NewCategoryName;
          parent=this.CurrentCategoryId;
          level=this.CurrentCategoryLevel+1;
        }
        this.$axios({
          method: 'post',
          url: 'http://newpms.cei.cn/PicCategoryDetail/',
          headers: {'Authorization': 'JWT ' + GlobalThis.MyToken},
          data: {
            "id":id,
            "name": name,
            "parent":parent,
            "level":level
          }
        }).then(function (res) {
          console.log(res);
          if (res.status == 201) {
            axios.get("http://newpms.cei.cn/PicCategoryList/", {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
              .then(function (response) {
                GlobalThis.CategoryTreeData=GlobalThis.null2str(response.data);
              });
            GlobalThis.$message({
              type: 'success',
              message: '已处理'
            });
          }
        }).catch(function (err) {
          GlobalThis.$message({
            type: 'warning',
            message: '错误！'
          });
          console.log(err);
        })
      },
      handleFileExceed(files, FileList) {
        this.$message.warning(`只能上传30个文件`);
      },
      uploadFile(param) {
        const formdata = new FormData()
        formdata.append('file', param.file)
        formdata.append('name', this.NewPicName)
        formdata.append('KeyWords', JSON.stringify(this.NewPicTags))
        formdata.append('category', this.CurrentCategoryId)
        var GlobalThis = this;
        this.$axios({
          method: 'post',
          url: 'http://newpms.cei.cn/BgPicDetail/',
          data: formdata
        }).then(function (res) {
          if (res.status == 202) {
            GlobalThis.NewPicFileList=[];
            GlobalThis.$message({
              type: 'warning',
              message: '只接收PNG文件'
            });
          }
          if (res.status == 201) {
            GlobalThis.$message({
              type: 'success',
              message: `已上传`
            }),
              axios.get("http://newpms.cei.cn/BgPicList/?type=c&cid="+ GlobalThis.CurrentCategoryId, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
                .then(function (response) {
                  GlobalThis.CurrentPicList = GlobalThis.null2str(response.data);
                })
              GlobalThis.NewPicFileList=[]
          }
        }).catch(function (err) {
          GlobalThis.NewPicFileList=[];
          GlobalThis.$message({
              type: 'warning',
              message: '标签不能为空、只接收PNG文件'
            });
          });
      },
      handlePicClick(pic){
        this.CurrentPic=pic;
        this.PicPreviewDialogVisible=true;
      },
      handelPicChoose(){
        this.PreviewCoursePic=[];
        this.PreviewCoursePic.push(this.CurrentPic.FilePath);
        this.CoursePicSrc=this.CurrentPic.FilePath;
        this.PicPreviewDialogVisible=false;
        var GlobalThis = this;
        axios.get("http://newpms.cei.cn/UpdateCoursePic/?cid="+GlobalThis.CurrentCourseId+"&pid="+GlobalThis.CurrentPic.id, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
          .then(function (response) {
            GlobalThis.$message({
              message:'已为课件选定图片',
              type: 'success'
            });
          });
      },
      handelPicEdit(){
        const formdata = new FormData()
        formdata.append('id', this.CurrentPic.id)
        formdata.append('name', this.NewPicName)
        formdata.append('KeyWords', JSON.stringify(this.NewPicTags))
        formdata.append('category', this.CurrentCategoryId)
        var GlobalThis = this;
        this.$axios({
          method: 'post',
          url: 'http://newpms.cei.cn/BgPicDetail/',
          data: formdata
        }).then(function (res) {
          if (res.status == 202) {
            GlobalThis.$message({
              type: 'warning',
              message: res.data.res
            });
          }
          if (res.status == 201) {
            var p = GlobalThis.CurrentPicList.filter((p) => {
              return p.id == GlobalThis.CurrentPic.id;
            });
            p[0].name=GlobalThis.NewPicName;
            p[0].KeyWords=JSON.stringify(GlobalThis.NewPicTags);
            GlobalThis.$message({
              type: 'success',
              message: `已修改`
            })
          }
        }).catch(function (err) {
          console.log(err);
          GlobalThis.$message({
            type: 'warning',
            message: '标签不能为空'
          });
        });
      },
      handelPicDel(){
        var GlobalThis =this;
        axios.get("http://newpms.cei.cn/BgPicDetail/?delid="+GlobalThis.CurrentPic.id, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
          .then(function (response) {
            var DelIndex=GlobalThis.CurrentPicList.findIndex(item => item.id==GlobalThis.CurrentPic.id);
            GlobalThis.CurrentPicList.splice(DelIndex, 1);
            GlobalThis.PicPreviewDialogVisible=false;
            GlobalThis.PicAddBox=false;
          }).catch(function (err) {
            console.log(err);
            GlobalThis.$message({
            type: 'warning',
            message: '不能删除选用过的图片'
          });
        });
      },
      OpenPicEditBox(){
        var GlobalThis = this;
        this.PicAddBox=true;
        this.isPicEdit=true;
        this.NewPicName=this.CurrentPic.name;
        this.NewPicTags=this.AllPicTags.filter(function (t) { return GlobalThis.CurrentPic.KeyWords.includes(t.id) });
      },
      PicSearch(){
        var GlobalThis = this;
        if(GlobalThis.SearchText!=''){
        axios.get("http://newpms.cei.cn/BgPicList/?type=s&key="+ GlobalThis.SearchText, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
          .then(function (response) {
            GlobalThis.CurrentPicList = GlobalThis.null2str(response.data);
          })
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
      getRequest2() {
        var url = decodeURIComponent(window.location.href); //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
          var str = url.split("?")[1];
          var strs = str.split("&");
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
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
  .el-tag{margin: 0 10px 0 0;}
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 12px;
    margin-bottom: 20px;
  }
</style>
