<template>
  <div class="main-div">
    <div class="blur-bg"></div>
    <div class="login-box">
      <h4>用户登录</h4>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>

          <el-button type="primary" @click="toHomePage()">登 录</el-button>
      </el-form>


      <!--<div class="form">-->
        <!--<el-row :gutter="20">-->
          <!--<el-col :span="24"><el-input v-model="form.userName" placeholder="请输入用户名"></el-input></el-col>-->
        <!--</el-row>-->
        <!--<el-row :gutter="20">-->
          <!--<el-col :span="24"><el-input type="password" v-model="form.passWord" placeholder="请输入密码"></el-input></el-col>-->
        <!--</el-row>-->
        <!--<el-row :gutter="20">-->
          <!---->
        <!--</el-row>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
    export default {
      name: "login-page",
      data(){
          return {
            ruleForm: {
              username: "gwq",
              password: "gwq@2018"
            },
            rules: {
              username: [
                {required: true, message: '请输入用户名', trigger: 'blur'},
                {min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur'}
              ],
              password:[
                {required: true, message: '请输入用户密码', trigger: 'blur'},
                {min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur'}
              ]
            }
          }
      },
      mounted(){
        var that = this;
        $('body').keydown(function (e) {
          if(e.keyCode == 13){
            that.toHomePage();
          }
        })
      },
      methods:{
        toHomePage(){
          var that = this;
          if(this.ruleForm.username!==""&&this.ruleForm.password!==""){
            this.$http.post('http://newpms.cei.cn/ApiLogin/',  {"username":this.ruleForm.username,"password":this.ruleForm.password})
              .then(function (response) {
                console.log(response);
                localStorage.setItem('myusertype',response.data.group);
                if(response.data.status == true){

                  //http://newpms.cei.cn/api-token-auth/

                  that.$http.post('http://newpms.cei.cn/api-token-auth/',  {"username":that.ruleForm.username,"password":that.ruleForm.password})
                    .then(function (response) {
                      console.log(response);
                      if(response.status == 200){
                        localStorage.setItem('mytoken',response.data.token);
                        localStorage.setItem('myusername',that.ruleForm.username);
                        localStorage.setItem('myuserpass',that.ruleForm.password);
                        that.$router.push('/HomePage');
                      }

                    })
                    .catch(function(error){
                      console.log(error);
                    })
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }


          // this.$router.push('/HomePage');
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('submit!');
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }
      }
    }
</script>

<style scoped lang="less">

  @loginWidth:400px;
  @loginHeight:300px;

  .main-div{
    width: 100%;
    height: 100%;
    .blur-bg{
      width:100%;
      height:100%;
      background: url("../assets/images/login-bg.jpg") no-repeat;
      background-size: cover;
      -webkit-filter: blur(4px); /* Chrome, Opera */
      -moz-filter: blur(4px);
      -ms-filter: blur(4px);
      filter: blur(4px);
      filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=4, MakeShadow=false); /* IE6~IE9 */
    }
    .login-box{
      width: @loginWidth;
      height: @loginHeight;
      background-color: #fff;
      opacity: 0.9;
      position: absolute;
      top:calc(50% - @loginHeight/2);
      left:calc(50% - @loginWidth/2);
      box-shadow: 0 0 20px #0f5d8e;
      padding: 20px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;

      h4{
        padding: 10px;
        text-align: center;
        border-bottom: solid 1px #777;
      }
      .el-form{
        padding: 20px;
        font-size: 16px;
        margin-top: 20px;
          .el-input{
            width: 100%;
            background-color: #fff;
            height: 30px;
          }
          .el-button{
            margin-top: 20px;
            width: 100%;
            color: #fff;
            border: none;
          }
      }
    }
  }

</style>
