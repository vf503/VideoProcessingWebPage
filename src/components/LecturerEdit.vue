<template>
  <div class="main-div">
    <app-head @getMenuIndex="getMenuIndexVal"></app-head>
    <div style="margin: 20px 10px 0px 10px">
      <el-input
        v-model="NameSearch"
        placeholder="姓名"
        style="width: 200px"
      >
      </el-input>
      <el-input
        v-model="JobSearch"
        placeholder="职务"
        style="width: 300px"
      >
      </el-input>
      <el-input
        v-model="IntroSearch"
        placeholder="简介"
        style="width: 500px"
      >
      </el-input>
      <el-button type="primary" size="mini" @click="DataSearch">搜索</el-button>
      <div style="margin-top: 15px">
        <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
      </div>
      <el-table
        :data="LecturerData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column prop="LecturerId" label="编号" width="200"></el-table-column>
        <el-table-column prop="name" label="姓名" width="200"></el-table-column>
        <el-table-column prop="post" label="职务" width="300"></el-table-column>
        <el-table-column prop="introduction" label="简介" width="550" show-overflow-tooltip></el-table-column>
        <el-table-column prop="auth" label="师资证明" width="50" :formatter="stateAuth"></el-table-column>
        <!--<el-table-column prop="keyword" label="关键词" width="300"></el-table-column>-->
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看/编辑</el-button>
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page"
                     layout="total,sizes, prev, pager, next"
                     @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     :current-page.sync="currentPage"
                     :total="total"
                     :page-size="50"
                     background>
      </el-pagination>
    </div>
    <el-dialog :visible.sync="DialogEditVisible" class="" width="1000">
      <el-card class="box-card" style="width: 600px; height: 450px">
        <img style="width: auto;height: auto;max-width: 500px;max-height:300px;  " :src="ImgSrc" />
        <el-upload
          class="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
          :limit="1"
          :on-exceed="handlePICExceed"
          :file-list="PicfileList"
          :http-request="uploadFile"
          >
          <el-button size="mini" type="primary">点击上传图片</el-button>
          <div slot="tip" class="el-upload__tip">只能上传JPG、PNG文件</div>
        </el-upload>
        <br/>
        <el-upload
          class="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
          :limit="1"
          :on-exceed="handleAuthExceed"
          :file-list="AuthfileList"
          :http-request="uploadAuthFile"
        >
        <el-button size="mini" type="primary">点击上传师资职称证明</el-button>
        </el-upload>
        <br/>
        <!--<el-input size="mini" type="textarea" placeholder="" v-model="CurrentRow.auth"></el-input>-->
        <el-link icon="el-icon-s-check" type="primary" :href="AuthSrc" v-show="(CurrentRow.auth ==null?false:true) && (CurrentRow.auth ==''?false:true)">下载师资职称证明</el-link>
      </el-card>
      <el-card class="box-card">
        <el-input size="small" placeholder="姓名" v-model="CurrentRow.name" ></el-input>
        <el-input size="mini" placeholder="关键字" v-model="CurrentRow.keyword" ></el-input>
      </el-card>
      <el-card class="box-card" v-show="ExtInfoVisible">
        <el-input size="mini" type="textarea" placeholder="电话" v-model="CurrentRow.tel" ></el-input>
        <el-input size="mini" type="textarea" placeholder="手机" v-model="CurrentRow.contact" ></el-input>
        <el-input size="mini" type="textarea" placeholder="邮箱" v-model="CurrentRow.mail" ></el-input>
        <el-input size="mini" type="textarea" placeholder="微信" v-model="CurrentRow.wechat" ></el-input>
        <el-input size="mini" type="textarea" placeholder="评价" v-model="CurrentRow.note" ></el-input>
      </el-card>
      <el-card class="box-card">
        当前职务/简介：
        <el-input size="mini" type="textarea" placeholder="当前职务" v-model="CurrentRow.post" ></el-input>
        <el-input size="mini" type="textarea" placeholder="当前简介" v-model="CurrentRow.introduction" ></el-input>
        <div style="margin-top: 20px">
          过往职务/简介：
        <el-button size="mini" @click="handleAddHistory">新增过往职务</el-button>
      <el-table :data="CurrentRow.lecturer_history" id="LecturerHistory" max-height="800" >
        <el-table-column prop="label" label="起始">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.begin"
              size="mini"
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="终止" >
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.end"
              size="mini"
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="职务" width="250px">
          <template slot-scope="scope">
            <el-input size="mini" placeholder="输入职务" v-model="scope.row.post"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="简介" width="250px">
          <template slot-scope="scope">
            <el-input size="mini" type="textarea" placeholder="简介" v-model="scope.row.introduction"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleHistoryDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
          </div>
      </el-card>
      <div style="margin-top: 15px">
        <el-button size="small" @click="handleSave" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import appHead from '@/components/AppHead.vue'

  export default {
    name: "LecturerEdit",
    components: {
      appHead
    },
    data() {
      return {
        //导航信息
        MenuIndex: 4,
        //用户
        UserId: '',
        MyToken:'',
        userName:'',
        userPassword:'',
        userType:'',
        keyStr:'',
        //数据
        LecturerData:[],
        NameSearch: '',
        JobSearch: '',
        IntroSearch: '',
        CurrentRow:{},
        CurrentRowIndex:0,
        ImgSrc:"",
        AuthSrc:"",
        CourseId:"none",
        //
        total:0,//默认数据总数
        pageSize:50,//每页的数据条数
        currentPage:1,//默认开始页面
        //
        loading:false,
        DialogEditVisible:false,
        ExtInfoVisible:false,
        //
        PicFile: {},
        PicfileList:[],
        AuthfileList:[]
      }
    },
    mounted(){
      //
      var GlobalThis = this;
      this.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      Request = this.getRequest();
      var modeLogin = this.decode(Request["login"].replace("=",""));
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
            GlobalThis.DataSearch();
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
          var url="";
          if (GlobalThis.userType.search('planner;') != -1) {
            GlobalThis.ExtInfoVisible=true;
            url="http://newpms.cei.cn/lecturerf/";
            }
          else
          {
            url="http://newpms.cei.cn/lecturerl/";
          }
          if(Request["lid"]){
          axios.get(url+"?id="+ encodeURI(Request['lid']), {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
              .then(function (response) {
                //that.CustomerData=response.data;
                GlobalThis.LecturerData=GlobalThis.null2str(response.data);
                GlobalThis.total= GlobalThis.LecturerData.length;
                GlobalThis.loading = false;
                GlobalThis.handleEdit(0,GlobalThis.LecturerData[0]);
              })
            GlobalThis.currentPage=1;
          }
        })
      if (Request["cid"])
      {
        console.log(Request["cid"]);
        this.CourseId=Request["cid"];
      }
      //
    },
    methods: {
      //appHead
      getMenuIndexVal(index) {
        this.MenuIndex = index;
        //console.log(this.MenuIndex);
      },
      DataSearch(){
        //this.currentPage=1
        this.loading = true;
        var that =this;
        var url="";
        if (that.userType.search('planner;') != -1) {
          url="http://newpms.cei.cn/lecturerf/";
        }
        else {
          url="http://newpms.cei.cn/lecturerl/";
        }
        axios.get(url+"?name="+ encodeURI(that.NameSearch)+"&post="+ encodeURI(that.JobSearch)+"&introduction="+ encodeURI(that.IntroSearch)+"&current="+this.currentPage+"&size="+this.pageSize, {headers: {'Authorization': 'JWT ' + this.MyToken}})
          .then(function (response) {
            let res=that.null2str(response.data);
            //that.LecturerData=that.LecturerData.filter(data => !that.LecturerData || data.name.toLowerCase().includes(that.NameSearch.toLowerCase()));
            res=JSON.parse(res);
            console.log(res);
            that.LecturerData=res.data;
            that.total= res.total;
            that.loading = false;
          })
        this.currentPage=1;
      },
      handleCurrentChange(val) {
        // 改变默认的页数
        this. DataSearch(this.currentPage,this.pageSize);
        this.currentPage=val;
      },
      handleSizeChange(val) {
        // 改变每页显示的条数
        this.pageSize=val
        this. DataSearch(this.currentPage,this.pageSize);
        // 注意：在改变每页显示的条数时，要将页码显示到第一页
        this.currentPage=1
      },
      handleEdit(index, row) {
        this.DialogEditVisible=true;
        this.CurrentRow=row;
        this.CurrentRowIndex=index;
        if(this.CurrentRow.PhotoSrc==""){this.CurrentRow.PhotoSrc="nobody.jpg"}
        this.ImgSrc="http://newpms.cei.cn/LecturerFile/"+this.CurrentRow.PhotoSrc;
        this.AuthSrc="http://newpms.cei.cn/LecturerFile/Auth/"+this.CurrentRow.auth;
        console.log(this.CurrentRow,this.CurrentRowIndex);
        //console.log(this.CurrentRow.auth);
        //console.log(this.CurrentRow.auth ==null?false:true);
      },
      handleAdd(){
        var lecturer  =
          {
            "LecturerId":"",
            "post":"",
            "name":"",
            "introduction":"",
            "PhotoSrc":"",
            "IntroSrc":null,
            "note":null,
            "keyword":null,
            "contact":null,
            "tel":null,
            "mail":null,
            "wechat":null,
            "ExtendedData":null,
            "lecturer_history":[]
          }
        //this.LecturerData.push(lecturer);
        this.ImgSrc="";
        this.CurrentRow=lecturer;
        this.CurrentRowIndex=this.LecturerData.length;
        this.DialogEditVisible=true;
      },
      handleAddHistory()
      {
        var item  =
          {
            "begin":"",
            "end":"",
            "post":"",
            "introduction":"",
          }
        this.CurrentRow.lecturer_history.push(item)
      },
      handleHistoryDelete(index)
      {
        this.CurrentRow.lecturer_history.splice(index,1)
      },
      handleSave(){
        var form = new FormData();
        form.append("id",this.CurrentRow.LecturerId);
        form.append("LecturerJobInput",this.CurrentRow.post);
        form.append("LecturerNameInput",this.CurrentRow.name);
        form.append("LecturerSummaryText",this.CurrentRow.introduction.replace(/\r\n/g,'').replace(/\n/g,''));
        form.append("item",JSON.stringify(this.CurrentRow));
        var GlobalThis = this;
        this.$axios({
          method: 'post',
          url: 'http://newpms.cei.cn/UpdateLecturer/?link='+Request["login"]+'&cid='+ GlobalThis.CourseId,
          headers: {'Authorization': 'JWT ' + GlobalThis.MyToken},
          data: form
        }).then(function (res) {
          console.log(res);
          if (res.status == 200) {
            GlobalThis.CurrentRow.LecturerId=res.data.id;
            GlobalThis.$message({
              type: 'success',
              message: '已更新'
            });
          }
          if (res.status == 202) {
            GlobalThis.$message({
              type: 'warning',
              message: res.data.res
            });
          }
        }).catch(function (err) {
          GlobalThis.$message({
            type: 'warning',
            message: '错误！'
          });
          console.log(err);
        })
        //this.CurrentRow=
        Vue.set(this.LecturerData, this.CurrentRowIndex, this.CurrentRow)
      },
      handlePICExceed(files, PicfileList) {
        this.$message.warning(`只能上传1个文件`);
      },
      handleAuthExceed(files, AuthfileList) {
        this.$message.warning(`只能上传1个文件`);
      },
      uploadFile(param) {
        const formdata = new FormData()
        formdata.append('pic', param.file)
        formdata.append('id', this.CurrentRow.LecturerId)
        formdata.append('name', this.CurrentRow.LecturerId + ".jpg")
        //formdata.append('_csrfToken', this.$ajax.getCsrfToken()._csrfToken)
        console.log(this.CurrentRow.LecturerId);
        var GlobalThis = this;
        this.$axios({
          method: 'post',
          url: 'http://newpms.cei.cn/UpdateLecturerPic/',
          //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: formdata
        }).then(function (res) {
          if (res.status == 202) {
            GlobalThis.PicfileList=[];
            GlobalThis.$message({
              type: 'warning',
              message: res.data.res
            });
          }
          if (res.status == 200) {
            GlobalThis.$message({
              type: 'success',
              message: `图片已上传`
            }),
              GlobalThis.CurrentRow.PhotoSrc = res.data.res,
              GlobalThis.ImgSrc = "http://newpms.cei.cn/LecturerFile/" + GlobalThis.CurrentRow.PhotoSrc,
              GlobalThis.PicfileList=[]
          }
        })
      },
      uploadAuthFile(param) {
        const formdata = new FormData()
        formdata.append('auth', param.file)
        formdata.append('id', this.CurrentRow.LecturerId)
        formdata.append('name', this.CurrentRow.LecturerId +"."+ param.file.name.split('.').pop())
        //formdata.append('_csrfToken', this.$ajax.getCsrfToken()._csrfToken)
        console.log(this.CurrentRow.LecturerId + param.file.name.split('.').pop());
        var GlobalThis = this;
        this.$axios({
          method: 'post',
          url: 'http://newpms.cei.cn/UpdateLecturerAuth/',
          //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: formdata
        }).then(function (res) {
          if (res.status == 202) {
            GlobalThis.AuthfileList=[];
            GlobalThis.$message({
              type: 'warning',
              message: res.data.res
            });
          }
          if (res.status == 200) {
            GlobalThis.$message({
              type: 'success',
              message: `证明已上传`
            }),
              GlobalThis.CurrentRow.auth = res.data.res,
              GlobalThis.AuthSrc = "http://newpms.cei.cn/LecturerFile/Auth/" + GlobalThis.CurrentRow.auth,
              GlobalThis.AuthfileList=[]
          }
        })
      },
      stateAuth(row, column) {
        if (row.auth === null ||row.auth === '') {
            return '无'
        } else{
          return '有'
        }
      },
      getRequest() {
        var url = decodeURIComponent(window.location.href); //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
          var str = url.split("?")[1];
          var strs = str.split("&");
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].substr(strs[i].indexOf("=")+1));
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
      // base 64 ED
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

</style>
