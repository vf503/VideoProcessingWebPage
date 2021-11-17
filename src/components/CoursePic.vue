<template>
  <div class="main-div">
    <!--<app-head @getMenuIndex="getMenuIndexVal"></app-head>-->
    <el-row :gutter="20">
      <el-col :span="5">
        <div style="margin-top: 12px">
          <el-tree :load="loadNode"
                   :props="props"
                   lazy
                   @node-click="handleNodeClick"></el-tree>
        </div>
      </el-col>
      <el-col :span="15">
        <el-card v-show="isCourse">
            <div slot="header">
              <span>课件名称：{{ CourseTitle }}</span>
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
        <div>
          <div style="margin: 0px 10px 0px 10px">
            <div v-for="pic in PicList" :key="pic.name" style="margin:20px 15px 0px 15px;float: left">
              <el-image
                style="width: 100px; height: 100px"
                :src="pic.url"
                @click.native="handlePicClick(pic.url)"
                fit="scale-down"></el-image>
              <span class="demonstration">{{ pic.name }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="DialogVisible">
      <el-image
        :src="PicDialogSrc"
        fit="scale-down"
      >
      </el-image>
      <el-button style="float: right; margin: 10px 0px 0px 0"  type="primary" v-show="isCourse" @click="handelChoose">选中</el-button>
    </el-dialog>
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
          keyStr:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
          //
          props: {
            label: 'label',
            isLeaf: 'isLeaf'
          },
          //
          UserRole:'',
          DialogVisible:false,
          PicDialogSrc:'',
          isCourse:false,
          CoursePicSrc:'',
          PreviewCoursePic:[],
          CourseId:'',
          CourseTitle:'',
          //
          PicList:[],
          CurrentPath:''
        }
      },
      mounted(){
        var GlobalThis = this;
        //
        var modeLogin = this.decode(this.getRequest2()["login"]);
        var modeUserName = modeLogin.split('_')[0];
        var modePassword = modeLogin.split('_')[1].replace(/\u0000/g,"");
        GlobalThis.$http.post('http://newpms.cei.cn/api-token-auth/', {
          "username": modeUserName,
          "password": modePassword
        })
          .then(function (response) {
            if (response.status == 200) {
              GlobalThis.MyToken = response.data.token;
              //
              axios.get("http://newpms.cei.cn/PicFile/?path=", {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
                .then(function (response) {
                  GlobalThis.PicList=GlobalThis.null2str(response.data);
                });
              //
              if(GlobalThis.getRequest()["id"]){
                GlobalThis.CourseId=GlobalThis.getRequest()["id"];
                GlobalThis.CourseTitle=GlobalThis.getRequest()["title"];
                GlobalThis.$http.get("http://newpms.cei.cn/course/CourseExtdata/?id=" + GlobalThis.CourseId, {headers: {'Authorization': 'JWT ' +  GlobalThis.MyToken}})
                  .then(function (response) {
                    GlobalThis.CoursePicSrc=response.data["BGPic"];
                    GlobalThis.PreviewCoursePic.push(GlobalThis.CoursePicSrc);
                    GlobalThis.isCourse=true;
                  });
              }
            }
          })
          .catch(function (error) {
            console.log(error);
          })
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
          axios.get("http://newpms.cei.cn/PicFileDir/?path="+CurrentPath, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
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
          axios.get("http://newpms.cei.cn/PicFile/?path="+GlobalThis.CurrentPath, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
            .then(function (response) {
              GlobalThis.PicList=GlobalThis.null2str(response.data);
            });
        },
        handlePicClick(url){
          this.PicDialogSrc=url;
          this.DialogVisible=true;
        },
        handelChoose(){
          this.PreviewCoursePic=[];
          this.PreviewCoursePic.push(this.PicDialogSrc);
          this.CoursePicSrc=this.PicDialogSrc;
          this.DialogVisible=false;
          var GlobalThis = this;
          axios.get("http://newpms.cei.cn/UpdateCoursePic/?id="+GlobalThis.CourseId+"&src="+GlobalThis.CoursePicSrc, {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
            .then(function (response) {
              GlobalThis.$message({
                message:'已为课件选定图片',
                type: 'success'
              });
            });
        },
        getRequest() {
          var url = decodeURI(window.location.href); //获取url中"?"符后的字串
          var theRequest = new Object();
          if (url.indexOf("?") != -1) {
            var str = url.split("?")[1];
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
              theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
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
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
</style>
