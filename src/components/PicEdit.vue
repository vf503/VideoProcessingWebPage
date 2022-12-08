<template>
<div>
  <div style="width: 1242px">
  <!--<el-button size="mini" type="primary" @click="adjustment('titleUp')">上</el-button>
  <el-button size="mini" type="primary" @click="adjustment('titleDown')">下</el-button>-->
    <div>
      标准：<br/>
      <el-button size="mini" type="primary" @click="adjustment('main','title+');adjustment('NoSection','title+');adjustment('NoPost','title+');adjustment('NoLecturer','title+')">大</el-button>
      <el-button size="mini" type="primary" @click="adjustment('main','title-');adjustment('NoSection','title-');adjustment('NoPost','title-');adjustment('NoLecturer','title-')">小</el-button>
      <el-input
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 4}"
        @input="DrawPic('main',false);DrawPic('NoSection',false);DrawPic('NoPost',false);DrawPic('NoLecturer',false)"
        v-model="TextTitle">
      </el-input>
    </div>
    <div>
      无分集：<br/>
      <el-input
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 4}"
        @input="DrawPic('main',false);DrawPic('NoSection',false);DrawPic('NoPost',false);DrawPic('NoLecturer',false)"
        v-model="NoSectionTextTitle">
      </el-input>
    </div>
    <div>
      讲师姓名：<br/>
      <el-input
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 1}"
        @input="DrawPic('main',false);DrawPic('NoSection',false);DrawPic('NoPost',false);DrawPic('NoLecturer',false)"
        v-model="TextName">
      </el-input>
    </div>
    <div>
      讲师职务：<br/>
      <el-input
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 2}"
        @input="DrawPic('main',false);DrawPic('NoSection',false);DrawPic('NoPost',false);DrawPic('NoLecturer',false)"
        v-model="TextPost">
      </el-input>
    </div>
    <el-button size="mini" type="primary" @click="uploadFile">存</el-button>
  </div>
  <div style="width: 1242px;height: 750px">
    标准：<br/>
  <canvas id="main" style="position: absolute;z-index: 1"></canvas>
  <canvas id="DashedLineMain" style="position: absolute;z-index: 99"></canvas>
  </div>
  <div style="width: 1242px;height: 750px">
    无分集：<br/>
    <canvas id="NoSection" style="position: absolute;z-index: 1"></canvas>
    <canvas id="DashedLineNoSection" style="position: absolute;z-index: 99"></canvas>
  </div>
  <div style="width: 1242px;height: 750px">
    无讲师职务：<br/>
    <canvas id="NoPost" style="position: absolute;z-index: 1"></canvas>
  </div>
  <div style="width: 1242px;height: 750px">
    无讲师：<br/>
    <canvas id="NoLecturer" style="position: absolute;z-index: 1"></canvas>
  </div>
</div>

</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import appHead from '@/components/AppHead.vue'

  export default {
      name: "PicEdit",
      components: {
        appHead
      },
    data() {
        return{
          BgSrc:'',
          BgSrcState: false,
          TextTitle: '',
          NoSectionTextTitle: '',
          TitleX: 10,
          TitleY: 10,
          TitleW: 100,
          TitleWHRate: 1,
          TitleWS:5,
          TitleLS:5,
          TitleIX:10,
          TitleIY:10,
          TitleWMax:0,
          TextName:'',
          TextPost:'',
          NoNameTextTitle: '',
          NameW:80,
          NameX: 10,
          NameY: 430
        }
      },
    mounted() {
      this.BgSrc="http://203.207.118.112/CourseFile/TempUpload/Temp/51.png"
      this.TextTitle="“保六是重点”“重”"
      this.NoSectionTextTitle="“保六是重点”"
      this.TextName="六重点"
      this.TextPost="保六是重点保六是重点保六是重点保六是重点保六是重点"
      this.NoNameTextTitle=this.TextTitle
      //
      var GlobalThis = this;
      //this.DrawPic();
      this.DashedLine("DashedLineMain");
      this.DashedLine("DashedLineNoSection");
    },
    methods:
      {
        SetBg(src,CanvasId) {
          this.BgSrcState=false;
          var canvas = document.getElementById(CanvasId);
          canvas.width = 1242;
          canvas.height = 699;
          var canvas_context = canvas.getContext("2d");
          canvas.globalCompositeOperation="source-in"
          var img = new Image();
          img.setAttribute("crossOrigin",'Anonymous');
          img.src = src;
          img.alt = "背景";
          var GlobalThis = this;
          img.onload = function() {  //图片加载完成后，执行此方法
            canvas_context.drawImage(img,0,0);
            GlobalThis.BgSrcState=true;
            //console.log("Bg_Fin");
          }
        },
        AddPic(CanvasId,src,x,y,w,h) {
          var main = document.getElementById(CanvasId);
          var main_context=main.getContext('2d');
          var img = new Image();
          img.setAttribute("crossOrigin",'Anonymous');
          img.src = src;
          img.alt = "_";
          img.onload = function() {
            main_context.drawImage(img, x, y,w,h);
            //console.log("src");
          }
        },
        AddAllPic(CanvasId) {
          var GlobalThis = this;
          var ArrTitle = "";
          var ArrName="";
          if(CanvasId=="main")
          {
            ArrTitle = this.TextTitle.split("\n").filter(i=>i && i.trim());
            ArrName=(this.TextName+"\n"+this.TextPost).split("\n").filter(i=>i && i.trim());
          }
          else if(CanvasId=="NoSection")
          {
            ArrTitle = this.NoSectionTextTitle.split("\n").filter(i=>i && i.trim());
            ArrName=(this.TextName+"\n"+this.TextPost).split("\n").filter(i=>i && i.trim());
          }
          else if(CanvasId=="NoPost")
          {
            ArrTitle = this.NoNameTextTitle.split("\n").filter(i=>i && i.trim());
            ArrName=this.TextName.split("\n").filter(i=>i && i.trim());
          }
          else if(CanvasId=="NoLecturer")
          {
            ArrTitle = this.NoNameTextTitle.split("\n").filter(i=>i && i.trim());
            ArrName=[];
          }
          else{}
          //
          var MaxLineCount = 0;
          for (let line of ArrTitle) {
            //
            var ArrLine = line.split("");
            if (1242 > GlobalThis.TitleW * ArrLine.length + GlobalThis.TitleWS*(ArrLine.length-1) && ArrLine.length > MaxLineCount) {
            }
            else {
              if (ArrLine.length > MaxLineCount) {
                GlobalThis.TitleW = 1242 / ArrLine.length- GlobalThis.TitleWS;
                GlobalThis.TitleIX = (1242 - (GlobalThis.TitleW * ArrLine.length + GlobalThis.TitleWS*(ArrLine.length-1))) / 2;
                MaxLineCount = ArrLine.length;
              }
            }
          }
          var TotalH=GlobalThis.TitleW*GlobalThis.TitleWHRate*ArrTitle.length+GlobalThis.TitleLS*(ArrTitle.length-1);
          if(TotalH<430)
          {
            GlobalThis.TitleIY=(430-TotalH)/2;
          }
          GlobalThis.TitleY = GlobalThis.TitleIY;
          //
          var MaxLineCount2 = 0;
          for (let line of ArrName) {
            //
            var ArrLine = line.split("");
            if (1242 > GlobalThis.NameW * ArrLine.length + GlobalThis.TitleWS*(ArrLine.length-1) && ArrLine.length > MaxLineCount2) {
            }
            else {
              if (ArrLine.length > MaxLineCount2) {
                GlobalThis.NameW = 1242 / ArrLine.length- GlobalThis.TitleWS;
                GlobalThis.NameX = (1242 - (GlobalThis.NameW * ArrLine.length + GlobalThis.TitleWS*(ArrLine.length-1))) / 2;
                MaxLineCount2 = ArrLine.length;
              }
            }
          }
          var TotalH2=GlobalThis.NameW*GlobalThis.TitleWHRate*ArrTitle.length+GlobalThis.TitleLS*(ArrTitle.length-1);
          if(TotalH2<269)
          {
            GlobalThis.NameY=(269-TotalH2)/2+430;
          }
          //
          for (let line of ArrTitle) {
            if  (line==""){continue}
            var ArrLine = line.split("");
            GlobalThis.TitleIX = (1242 - (GlobalThis.TitleW * ArrLine.length + GlobalThis.TitleWS * (ArrLine.length-1))) / 2;
            GlobalThis.TitleX = GlobalThis.TitleIX;
            if (ArrLine.length > 0) {
              //console.log(GlobalThis.TitleX+";"+ArrLine.length);
              for (let z of ArrLine) {
                this.AddPic(CanvasId,"http://203.207.118.112/CourseFile/TempUpload/Temp/" + encodeURIComponent(z) + ".png", GlobalThis.TitleX, GlobalThis.TitleY,GlobalThis.TitleW, GlobalThis.TitleW*GlobalThis.TitleWHRate);
                GlobalThis.TitleX = GlobalThis.TitleX + GlobalThis.TitleW + GlobalThis.TitleWS;
              }
              GlobalThis.TitleX = GlobalThis.TitleIX;
              GlobalThis.TitleY = GlobalThis.TitleY + GlobalThis.TitleW*GlobalThis.TitleWHRate + GlobalThis.TitleLS;
            }
          }
          //
          for (let line of ArrName) {
            if  (line==""){continue}
            var ArrLine = line.split("");
            GlobalThis.NameX = (1242 - (GlobalThis.NameW * ArrLine.length + GlobalThis.TitleWS * (ArrLine.length-1))) / 2;
            if (ArrLine.length > 0) {
              //console.log(GlobalThis.TitleX+";"+ArrLine.length);
              for (let z of ArrLine) {
                this.AddPic(CanvasId,"http://203.207.118.112/CourseFile/TempUpload/Temp/" + encodeURIComponent(z) + ".png", GlobalThis.NameX, GlobalThis.NameY,GlobalThis.NameW, GlobalThis.NameW*GlobalThis.TitleWHRate);
                GlobalThis.NameX = GlobalThis.NameX + GlobalThis.NameW + GlobalThis.TitleWS;
              }
              GlobalThis.TitleX = GlobalThis.TitleIX;
              GlobalThis.NameY = GlobalThis.NameY + GlobalThis.NameW*GlobalThis.TitleWHRate + GlobalThis.TitleLS;
            }
          }
        },
        DrawPic(CanvasId,IsAdj) {
          //
          this.SetBg(this.BgSrc,CanvasId);
          if(this.TitleW<100 && IsAdj==false) {
          this.TitleW=100;
          }
          var GlobalThis = this;
          var timer = setInterval(function() {
            //console.log(GlobalThis.BgSrcState);
            if (GlobalThis.BgSrcState) {
              GlobalThis.AddAllPic(CanvasId);
              clearInterval(timer);
            }
          }, 50)
        },
        DashedLine(CanvasId){
          var CanvasDashedLine = document.getElementById(CanvasId);
          CanvasDashedLine.width = 1242;
          CanvasDashedLine.height = 699;
          var ContextDashedLine = CanvasDashedLine.getContext("2d");
          ContextDashedLine.strokeStyle="#000000"
          ContextDashedLine.setLineDash([12, 6]);
          ContextDashedLine.moveTo(155.25, 0);
          ContextDashedLine.lineTo(155.25,699);
          ContextDashedLine.moveTo(1086.75, 0);
          ContextDashedLine.lineTo(1086.75,699);
          ContextDashedLine.stroke();
          ContextDashedLine.strokeStyle="#ffffff"
          ContextDashedLine.setLineDash([6, 12]);
          ContextDashedLine.moveTo(155.25, 0);
          ContextDashedLine.lineTo(155.25,699);
          ContextDashedLine.moveTo(1086.75, 0);
          ContextDashedLine.lineTo(1086.75,699);
          ContextDashedLine.stroke();
        },
        adjustment(CanvasId,mode){
          if(mode=="title+")
          {
            this.TitleW += 5;
            this.NameW += 3;
          }
          else if (mode=="title-" && this.TitleW>30 && this.NameW>20)
          {
            this.TitleW += -5;
            this.NameW += -3;
          }
          if(mode=="titleUp" && this.TitleIY>10)
          {
            this.TitleIY += -10;
          }
          if(mode=="titleDown" && this.TitleIY<300)
          {
            this.TitleIY += 10;
          }
          this.DrawPic(CanvasId,true);
        },
        uploadFile() {
          const formdata = new FormData()
          var canvas = document.getElementById("main");
          var PicData = canvas.toDataURL("image/png");
          formdata.append('pic', PicData)
          formdata.append('id', "temp")
          formdata.append('name', "temp" + ".png")
          var GlobalThis = this;
          this.$axios({
            method: 'post',
            url: 'http://newpms.cei.cn/UploadCoursePic/',
            data: formdata
          }).then(function (res) {
            if (res.status == 202) {
              GlobalThis.$message({
                type: 'warning',
                message: res.data.res
              });
            }
            if (res.status == 200) {
              GlobalThis.$message({
                type: 'success',
                message: `图片已上传`
              })
            }
          })
        },
      }
  }
</script>

<style scoped>

</style>
