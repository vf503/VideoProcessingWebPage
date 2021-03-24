<template>
  <div class="main-div">
    <div class="search-box">
      <el-card class="box-card">
        <div>课程检索</div>
        <el-input type="text" v-model="className" placeholder="输入课程名称"></el-input>
        <el-input type="text" v-model="classGroup" style="width: 153px" placeholder="输入专题名称"></el-input>
        <el-input type="text" v-model="classTeacher" style="width: 153px" placeholder="输入讲师名称"></el-input>
        <el-input type="text" v-model="classKeyword" placeholder="输入关键词"></el-input>
        <br/>
        <el-button type="primary" class="search-btn" @click="selectClassWord">查询</el-button>
      </el-card>
      <el-card class="box-card">
        <div>工单信息</div>
      </el-card>
    </div>
    <div style="float: left;clear: left;width: 47%;margin: 10px 0px 0 35px">
      <el-card class="search-table-result">
      <div class="search-table-head">
        <span>检索结果</span>
        <div>
          <el-button type="primary" @click="addSelected">添加所选</el-button>
          <!--<el-button type="primary" @click="addSelectedAll">添加全部</el-button>-->
        </div>
      </div>
      <div class="class-table">
        <el-table ref="multipleTableAll"
                  v-loading="loadingAll"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  :data="currentShowTableData" tooltip-effect="dark"
                  :default-sort="{prop: 'CreateDate', order: 'descending'}"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="30" sortable>
          </el-table-column>
          <el-table-column label="" width="30">
            <template slot-scope="scope">
              <div v-show="(scope.row.DataType=='旧课件'?true:false)"
                   style="background-color: #63a35c;color: #fff;width: 20px;text-align: center;font-size: 12px;">
                旧
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="CreateDate" label="日期" width="100" sortable>
          </el-table-column>
          <el-table-column prop="title" label="题目">
          </el-table-column>
          <el-table-column prop="GroupName" label="专题">
          </el-table-column>
          <el-table-column prop="lecturer_name" label="讲师" width="70">
          </el-table-column>
          <el-table-column prop="duration" label="时长" width="70">
          </el-table-column>
          <el-table-column prop="TempletType" label="类型" width="70">
          </el-table-column>
          <el-table-column prop="progress" label="课程状态" width="80">
          </el-table-column>
          <el-table-column label="操作" width="100" style="text-align: center;">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="bottom-start">
                <i class="iconfont" @click="PlayCourse(scope.row)">&#xe63e;</i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="center-box">
        <el-pagination background layout="prev, pager, next" :total="allPage" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-card>
    </div>
    <div class="co-table-box">
      <el-card>
        <div class="new-class-result">
          <div class="search-table-head">
            <span>选中列表</span>
          </div>
          <div class="new-class-table">
            <el-table id="new_class_table" :data="allTableChosen" tooltip-effect="dark" max-height="1200">
              <el-table-column type="index" width="55"></el-table-column>
              <el-table-column prop="CreateDate" label="日期" sortable width="100">
              </el-table-column>
              <el-table-column prop="title" label="题目" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="lecturer_name" label="讲师" width="80">
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <el-button size="mini" style="margin: 0 0 0 10px" @click="moveUp(scope.row, scope.$index)" :disabled="scope.$index === 0">上移</el-button>
                  <el-button size="mini" @click="moveDown(scope.row, scope.$index)" :disabled="getFormLength(scope.$index)">下移</el-button>
                  <el-button size="mini" @click="handleNewDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
    export default {
      name: "SelectCourse",
      data() {
        return {
          className:"",
          classGroup:"",
          classTeacher:"",
          classKeyword:"",
          allPage: 0,
          curPage: 1,
          loadingAll: false,
          multipleSelection: [],
          allTableData:[],
          currentShowTableData:[],
          allTableChosen: [], /*当前已选的所有课程列表——用于导出选中课程列表*/
          allTableChosenId: [] /*当前已选课程列表的课程id*/
        }
      },
      mounted() {
          var that = this;
          var Request = new Object();
          var Request2 = new Object();
          Request = this.getRequest();
          Request2 = this.getRequest2();
          this.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          var modeLogin = this.decode(Request["login"]);
          var projectId = Request2["project"];
          var modeUserName = modeLogin.split('_')[0];
          var modePassword = modeLogin.split('_')[1];
          this.userName = modeUserName;
          this.userPassword = modePassword;

          that.$http.post('http://newpms.cei.cn/api-token-auth/', {
            "username": modeUserName,
            "password": modePassword
          })
            .then(function (response) {
              if (response.status == 200) {
                localStorage.setItem('mytoken', response.data.token);
                localStorage.setItem('myusername', modeUserName);
                localStorage.setItem('myuserpass', modePassword);
                that.myToken = response.data.token;
                that.userName = modeUserName;
                //that.$http.get('http://pms.cei.com.cn/InterFace/custom.ashx?method=get&id=A-20180524-1').then(function (res) {
                //}).catch(function (err) {
                //  console.log(err);
                //})
              }

            })
            .catch(function (error) {
              console.log(error);
            })
      },
      methods:{
        selectClassWord() {
          this.loadingAll = true;
          this.currentShowTableData = [];
          this.allTableData = [];
          //console.log(this.classDate[1].Format("yyyy-MM-dd HH:mm:ss"));
          var that = this;
          var urlNew = "http://newpms.cei.cn/course/FieldQuery/" +
            "?title=" + encodeURIComponent(this.className) + "&lecturer=" + encodeURIComponent(this.classTeacher)
            + "&key=" + encodeURIComponent(this.classKeyword) + "&type=" + encodeURIComponent("微课") + "&group=" + encodeURIComponent(this.classGroup)
            + "&source=" + encodeURIComponent("") + "&start=" + encodeURIComponent("2000-01-01 00:00:00")
            + "&end=" + encodeURIComponent("2077-01-01 00:00:00") + "&sheet=" + encodeURIComponent("published") + "&area=" + encodeURIComponent("");
          // console.log(urlNew);
          var urlOld = "http://newpms.cei.cn/OldCourseQuery/" +
            "?title=" + encodeURIComponent(this.className) + "&lecturer=" + encodeURIComponent(this.classTeacher) +
            "&key=" + encodeURIComponent(this.classKeyword) + "&type=" + encodeURIComponent("微课") + "&group=" + encodeURIComponent(this.classGroup)
            + "&source=" + encodeURIComponent("") + "&start=" + encodeURIComponent("2000-01-01 00:00:00")
            + "&end=" + encodeURIComponent("2077-01-01 00:00:00") + "&sheet=" + encodeURIComponent("none") + "&area=" + encodeURIComponent("n");
          this.$http.get(urlNew, {headers: {'Authorization': 'JWT ' + that.myToken}})
            .then(function (response) {
              if (response.status == 200) {
                // console.log(response);
                response.data.forEach(function (item) {
                  item.DataType = "新课件";
                  if(that.courseState=="made")
                  {
                    if(item.progress=="未发布"){
                      that.allTableData.push(item);
                    }
                  }
                  else if(that.courseState=="published"){
                    if(item.progress=="已发布"){
                      that.allTableData.push(item);
                    }
                  }
                  else{
                    that.allTableData.push(item);
                  }
                });
                //if (that.publishType == "source") {
                  //that.loadingAll = false;
                  //that.reShowTable();
                  //return;
                //}
                that.$http.get(urlOld, {headers: {'Authorization': 'JWT ' + that.myToken}})
                  .then(function (response) {
                    // console.log(response);

                    response.data.forEach(function (item) {
                      if(that.courseState=="made")
                      {
                        if(item.progress != "已审已发"){
                          that.allTableData.push(item);
                        }
                      }
                      else if(that.courseState=="published"){
                        if(item.progress == "已审已发"){
                          that.allTableData.push(item);
                        }
                      }
                      else{
                        that.allTableData.push(item);
                      }
                    });
                    //console.log(that.allTableData);
                    that.loadingAll = false;
                    that.reShowTable();
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              }

            })
            .catch(function (error) {
              console.log(error);
            });
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        handleCurrentChange(val) {
          this.curPage = val;
          var count = 0;
          var myCurrentShowTableData = [];
          for (var i = (val - 1) * 10; i < val * 10; i++) {
            if (this.allTableData[i]) {
              myCurrentShowTableData[count] = this.allTableData[i];
              count++;
            }
          }
          this.currentShowTableData = myCurrentShowTableData;
        },
        addSelected() {
          var that = this;
          this.multipleSelection.forEach(function (item) {
            if (that.allTableChosenId.indexOf(item.CourseId) < 0) {
              that.allTableChosen.push(item);
              that.allTableChosenId.push(item.CourseId)
            }
          });
        },
        reShowTable() {

          this.allPage = this.allTableData.length;

          var myCurrentShowTableData = [];
          var count = 0;
          this.curPage = 1;
          for (var i = (this.curPage - 1) * 10; i < this.curPage * 10; i++) {
            if (this.allTableData[i]) {
              myCurrentShowTableData[count] = this.allTableData[i];
              count++;
            }
          }
          //当最后一页被删除完后自动跳到前一页
          if (myCurrentShowTableData.length == 0 && this.curPage > 1) {
            count = 0;
            for (var i = (this.curPage - 2) * 10; i < this.curPage * 10; i++) {
              if (this.allTableData[i]) {
                myCurrentShowTableData[count] = this.allTableData[i];
                count++;
              }
            }
          }
          this.currentShowTableData = [];
          this.currentShowTableData = myCurrentShowTableData;
        },
        handleNewDelete(index, row) {
          this.$confirm('确定删除该课程？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            for (var i = 0, n = 0; i < this.allTableChosen.length; i++) {
              if (this.allTableChosen[i] != row) {
                this.allTableChosen[n++] = this.allTableChosen[i];
              }
            }
            this.allTableChosen.pop();
            for (var i = 0, n = 0; i < this.allTableChosenId.length; i++) {
              if (this.allTableChosenId[i] != row.CourseId) {
                this.allTableChosenId[n++] = this.allTableChosenId[i];
              }
            }
            this.allTableChosenId.pop();
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
        PlayCourse(row) {
          if (row.DataType == '新课件') {
            //console.log(row.SourceCourseId);
            if (row.SourceCourseId === null) {
              window.open('http://203.207.118.112/CourseFile/' + row.CourseId.slice(0, 4) + '/' + row.CourseId + '/publish/index.html');
            }
            else {
              window.open('http://203.207.118.112/CourseFile/' + row.CourseId.slice(0, 4) + '/' + row.CourseId + '/index.html');
            }
          }
          else if (row.DataType == '旧课件') {
            window.open('http://lms.cei.cn/doc/' + row.CourseId + '/');
          }
        },
        moveUp(item, index) {
          this.allTableChosen.splice(index - 1, 0, item);  // 定位到点击位置的上一行，0即不删除如何元素，在此位置插入item
          this.allTableChosen.splice(index + 1, 1); // 此时数组中有重复元素，把原来被挤下去的元素删除
          console.log(this.allTableChosen);
        },
        moveDown(item, index) {
          this.allTableChosen.splice(index + 2, 0, item);
          this.allTableChosen.splice(index, 1);
        },
        getFormLength(index) {
          if (index === this.allTableChosen.length - 1) return true;
          else return false;
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
          var url = window.location.href; //获取url中"?"符后的字串
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
        //base64 OP
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
        _utf8_encode(string) {
          string = string.replace(/\r\n/g, "\n");
          var utftext = "";
          for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
              utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
            } else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
            }
          }
          return utftext;
        },
        encode64(input) {
          var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
          var output = "";
          var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
          var i = 0;
          input = this._utf8_encode(input);
          while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
              enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
              enc4 = 64;
            }
            output = output +
              _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
              _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
          }
          return output;
        },
        // base 64 ED
      }
    }
</script>

<style scoped lang="less">
  .main-div, .search-box {
    width: 100%;
  }

  .box-card {
    width: 47%;
    margin-left: 2%;
    margin-top: 20px;
    float: left;
    height: 300px;
    position: relative;
    .el-input, .el-select {
    width: 40%;
  }
    .el-input, .el-button, .el-select, .el-date-picker {
    margin-top: 20px;
    margin-left: 20px;
  }
    .search-btn {
    position: relative;
    bottom: 20px;
    left: 20px;
    margin-right: 30px;
    float:right;
  }
    .is-especial-class {
    display: inline-block;
    margin: 20px;
  }
  }
  .co-table-box {
    float: left;
    margin-left: 30px;
    margin-top: 10px;
    width: 47%;
  }
</style>
