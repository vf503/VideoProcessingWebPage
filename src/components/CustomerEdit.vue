<template>
  <div class="main-div">
    <app-head @getMenuIndex="getMenuIndexVal"></app-head>
    <div style="margin: 20px 10px 10px 10px">
      <el-button type="primary" size="mini" @click="dialogCityVisible=true" disabled>编辑城市选项</el-button>
    </div>
    <div style="margin: 20px 10px 10px 10px">
      <el-input
        v-model="CustomerSearch"
        placeholder="名称搜索"
        style="width: 500px"
      >
    </el-input>
      <el-button type="primary" size="mini" @click="search">搜索</el-button>
    </div>
    <el-table
      :data="CustomerData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%" :row-class-name="tableRowClassName"
    >
      <el-table-column label="名称" width="250px">
        <template slot-scope="scope">
          <el-input size="mini" placeholder="输入名称" v-model="scope.row.name" v-bind:disabled="!scope.row.IsEdit"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-select size="mini" placeholder="选择" v-model="scope.row.sort" v-bind:disabled="!scope.row.IsEdit" filterable>
            <el-option
              v-for="item in OptionsSort"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="性质">
        <template slot-scope="scope">
          <el-select size="mini" placeholder="选择" v-model="scope.row.sortExt" v-bind:disabled="!scope.row.IsEdit" filterable>
            <el-option
              v-for="item in OptionsSortExt"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="合作状态">
        <template slot-scope="scope">
          <el-select size="mini" placeholder="选择" v-model="scope.row.state" v-bind:disabled="!scope.row.IsEdit" filterable>
            <el-option
              v-for="item in OptionsState"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="省份">
        <template slot-scope="scope">
          <el-select size="mini" placeholder="选择" v-model="scope.row.province" v-bind:disabled="!scope.row.IsEdit" @change="selectProvinceChange" filterable>
            <el-option
              v-for="item in OptionsProvince"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="城市">
        <template slot-scope="scope">
          <el-select size="mini" placeholder="选择" v-model="scope.row.city" v-bind:disabled="!scope.row.IsEdit"  filterable>
            <el-option
              v-for="item in OptionsCurrentCity"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="区域划分">
        <template slot-scope="scope">
          <el-select size="mini" placeholder="选择" v-model="scope.row.area" v-bind:disabled="!scope.row.IsEdit" filterable>
            <el-option label="北方" value="n"></el-option>
            <el-option label="南方" value="s"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="收入归属">
      <template slot-scope="scope">
        <el-select size="mini" placeholder="选择" v-model="scope.row.income" v-bind:disabled="!scope.row.IsEdit" filterable>
          <el-option label="北方" value="n"></el-option>
          <el-option label="南方" value="s"></el-option>
        </el-select>
      </template>
    </el-table-column>
      <el-table-column label="是/否第三方">
        <template slot-scope="scope">
          <el-select size="mini" placeholder="选择" v-model="scope.row.IsThirdTParty" v-bind:disabled="!scope.row.IsEdit" filterable>
            <el-option label="否" value="否"></el-option>
            <el-option label="是" value="是"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="是/否新增客户">
        <template slot-scope="scope">
          <el-select size="mini" placeholder="选择" v-model="scope.row.IsNew" v-bind:disabled="!scope.row.IsEdit" filterable>
            <el-option label="否" value="否"></el-option>
            <el-option label="是" value="是"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="开始年份">
          <template slot-scope="scope">
            <!--<el-input size="mini" placeholder="输入年份" v-model="scope.row.StartDate" v-bind:disabled="!scope.row.IsEdit"></el-input>-->
            <el-date-picker
              v-model="scope.row.StartDate"
              v-bind:disabled="!scope.row.IsEdit"
              size="mini"
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </template>
      </el-table-column>
      <el-table-column label="停止年份">
        <template slot-scope="scope">
          <!--<el-input size="mini" placeholder="输入年份" v-model="scope.row.EndDate" v-bind:disabled="!scope.row.IsEdit"></el-input>-->
          <el-date-picker
            v-model="scope.row.EndDate"
            v-bind:disabled="!scope.row.IsEdit"
            size="mini"
            align="right"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="所属销售">
        <template slot-scope="scope">
          <el-select size="mini" placeholder="选择" v-model="scope.row.seller" v-bind:disabled="!scope.row.IsEdit" filterable>
            <el-option
              v-for="item in seller"
              :key="item.id"
              :label="item.first_name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"  @click="edit(scope.row,scope.$index)">{{scope.row.IsEdit?'保存':"修改"}}</el-button>
          <!--<el-button size="mini" @click="delete(scope.$index)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page"
                   layout="total,sizes, prev, pager, next"
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
                   :current-page.sync="currentPage"
                   :total="total"
                   background>
    </el-pagination>
    <!--对话框-->
    <el-dialog :visible.sync="dialogCityVisible" class="" width="1000">
      <el-input
        v-model="CitySearch"
        placeholder="搜索"
      >
      </el-input>
      <el-table :data="OptionsCity.filter(data => !CitySearch || data.label.toLowerCase().includes(CitySearch.toLowerCase()))" id="city_table" max-height="800" >
        <el-table-column prop="label" label="名称">
        </el-table-column>
        <el-table-column prop="value" label="值" v-show="false">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="CityDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-input size="mini" placeholder="输入城市" v-model="NewCity" width="300"></el-input>
      <el-button size="mini" @click="CityInsert()">增加</el-button>
      <el-button size="mini" @click="CitySave()">保存</el-button>
    </el-dialog>
    <!--对话框-->
  </div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import appHead from '@/components/AppHead.vue'

    export default {
      name: "CustomerEdit",
      components: {
        appHead
      },
      data() {
        return {
          //导航信息
          MenuIndex: 2,
          //用户
          UserId: '',
          MyToken:'',
          userName:'',
          userPassword:'',
          keyStr:'',
          //数据
          CustomerData:[],
          OptionsSort:[],
          OptionsSortExt:[],
          OptionsState:[],
          OptionsProvince:[],
          OptionsCity:[],
          OptionsCurrentCity:[],
          seller:[],
          CustomerSearch: '',
          CurrentRow:{},
          //
          total:0,//默认数据总数
          pageSize:10,//每页的数据条数
          currentPage:1,//默认开始页面
          //
          dialogCityVisible: false,
          CitySearch: '',
          NewCity:''
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
              axios.get('http://newpms.cei.cn/customer/', {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
                .then(function (response) {
                  GlobalThis.CustomerData=response.data;
                  GlobalThis.CustomerData.map(i => {
                    i.IsEdit = false
                    return i
                  })
                  GlobalThis.total=response.data.length;
                  console.log(GlobalThis.total);
                })
              axios.get('http://newpms.cei.cn/option/', {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
                .then(function (response) {
                  GlobalThis.OptionsSort=eval(response.data.CustomerSort);
                  GlobalThis.OptionsSortExt=eval(response.data.CustomerSortExt);
                  GlobalThis.OptionsState=eval(response.data.CustomerState);
                  GlobalThis.OptionsProvince=eval(response.data.province);
                  GlobalThis.OptionsCity=eval(response.data.city);
                })
              axios.get('http://newpms.cei.cn/user/seller/', {headers: {'Authorization': 'JWT ' + GlobalThis.MyToken}})
                .then(function (response) {
                  GlobalThis.seller=response.data;
                })
            }
          })
          .catch(function (error) {
            console.log(error);
          })
        //

      },
      methods: {
        //appHead
        getMenuIndexVal(index) {
          this.MenuIndex = index;
          //console.log(this.MenuIndex);
        },
        search(){
          //this.currentPage=1
          var that =this;
          axios.get('http://newpms.cei.cn/customer/', {headers: {'Authorization': 'JWT ' + this.MyToken}})
            .then(function (response) {
              that.CustomerData=response.data;
              that.CustomerData=that.CustomerData.filter(data => !that.CustomerSearch || data.name.toLowerCase().includes(that.CustomerSearch.toLowerCase()))
              that.total= that.CustomerData.length
              })
        },
        edit(row, index) {
          if( !row.IsEdit === true){
            this.CurrentRow=row;
            console.log(row.id);
          }
          if( row.IsEdit === true)
          {
            var that = this;
            this.$axios({
              method: 'post',
              url: 'http://newpms.cei.cn/customerdetail/',
              headers: {'Authorization': 'JWT ' + that.MyToken},
              data: {
                "id":row.id,
                "name": row.name,
                "sort": row.sort,
                "sortExt": row.sortExt,
                "area": row.area,
                "income":row.income,
                "state":row.state,
                "province":row.province,
                "city":row.city,
                "IsThirdTParty":row.IsThirdTParty,
                "IsNew":row.IsNew,
                "StartDate":row.StartDate,
                "EndDate":row.EndDate,
                "seller":row.seller
              }
            }).then(function (res) {
              console.log(res);
              if (res.status == 200) {
                that.$message({
                  type: 'success',
                  message: '已更新'
                });
            }
            }).catch(function (err) {
              that.$message({
                type: 'warning',
                message: '错误！'
              });
              console.log(err);
            })
          }
          row.IsEdit = row.IsEdit ? false : true
          Vue.set(this.CustomerData, index, row)
          //
        },
        delete(index) {
          this.CustomerData.splice(index, 1)
          //
        },
        CityInsert() {
          var city  =
            {
              "label" :this.NewCity,
              "value" : this.NewCity
            }
          this.OptionsCity.push(city);
          //
        },
        CityDelete(index) {
          console.log(index,this.OptionsCity);
          this.OptionsCity.splice(index, 1)
          //
        },
        CitySave() {
          var that = this;
          axios.get('http://newpms.cei.cn/option/', {headers: {'Authorization': 'JWT ' + that.MyToken}})
            .then(function (response) {
              var TempOptionsSort=eval(response.data.CustomerSort);
              var TempOptionsSortExt=eval(response.data.CustomerSortExt);
              var TempOptionsState=eval(response.data.CustomerState);
              var TempOptionsProvince=eval(response.data.province);
              that.$axios({
                method: 'post',
                url: 'http://newpms.cei.cn/option/',
                headers: {'Authorization': 'JWT ' + that.MyToken},
                data: {
                  "id":"1",
                  "city":that.OptionsCity,
                  "CustomerSort":TempOptionsSort,
                  "CustomerSortExt":TempOptionsSortExt,
                  "CustomerState":TempOptionsState,
                  "province":TempOptionsProvince,
                }
              }).then(function (res) {
                console.log(res);
                if (res.status == 200) {
                  that.$message({
                    type: 'success',
                    message: '已保存'
                  });
                }
              }).catch(function (err) {
                that.$message({
                  type: 'warning',
                  message: '错误！'
                });
                console.log(err);
              })
            })
        },
        selectProvinceChange(value){
          var CurrentProvince = this.OptionsCity.filter(function (e) { return e.name == value; })
          this.OptionsCurrentCity = CurrentProvince[0].city
          this.CurrentRow.city=CurrentProvince[0].city[0]
          console.log(this.CurrentRow.id);
        },
        tableRowClassName({ row, rowIndex }) {
          if (row.IsEdit  === true) {
            console.log(rowIndex);
            return 'edit-row';
          }
          return '';
        },
        handleCurrentChange(val) {
          // 改变默认的页数
          this.currentPage=val;
          this.search();
        },
        handleSizeChange(val) {
          // 改变每页显示的条数
          this.pageSize=val
          // 注意：在改变每页显示的条数时，要将页码显示到第一页
          this.currentPage=1
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
        }
        // base 64 ED
      }
    }
</script>

<style>
  /deep/ input[disabled],input:disabled,input.disabled{
    -webkit-text-fill-color:#333;
    -webkit-opacity:1;
    opacity: 1;
    color: #333333;
    background: #fff;
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #e9f4e5 !important;
  }
  .el-input.is-disabled .el-input__inner {
    color: #333333 !important;
  }
  .el-table .edit-row {
    background-color: #b3e19d;
  }
</style>
