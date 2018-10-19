<template>
  <div class="main-div">
    <app-head @getMenuIndex="getMenuIndexVal"></app-head>
    <div class="search-box">
      <el-card class="box-card">
        <div>课程检索</div>
        <el-input type="text" v-model="className" placeholder="输入课程名称"></el-input>
        <el-input type="text" v-model="classTeacher" placeholder="输入讲师名称"></el-input>
        <el-input type="text" v-model="classKeyword" placeholder="输入关键词"></el-input>
        <el-select
          v-model="videoType" style="width: 153px" placeholder="选择视频类型">
          <el-option label="不限课件类型" value=""></el-option>
          <el-option label="单视频" value="单视频"></el-option>
          <el-option label="三分屏" value="三分屏"></el-option>
          <el-option label="微课" value="微课"></el-option>
        </el-select>
        <el-select v-model="courseState" style="width: 153px" placeholder="选择状态">
          <el-option label="不限发布状态" value="none"></el-option>
          <el-option label="已审核" value="made"></el-option>
          <el-option label="已发布" value="published"></el-option>
        </el-select>
        <br/>
        <div style="margin-left: 20px;">
          <el-date-picker
            style="width: 330px"
            v-model="classDate"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="RangePickerOptions">
          </el-date-picker>
          <el-select v-model="publishType" style="width: 153px" placeholder="选择版面">
            <el-option label="不限发布版面" value="none"></el-option>
            <el-option label="党政版" value="dz"></el-option>
          </el-select>
        </div>
        <span class="is-especial-class">是否定制课 :</span>
        <el-radio v-model="isEspecialClass" label="1">是</el-radio>
        <el-radio v-model="isEspecialClass" label="0">否</el-radio>
        <el-button type="primary" class="search-btn" @click="selectClassWord">查询</el-button>
      </el-card>
      <el-card class="box-card">
        <div>excel查询</div>
        <el-select v-model="excelSearchType" placeholder="请选择检索方式">
          <el-option label="编号" value="A"></el-option>
          <el-option label="标题" value="B"></el-option>
        </el-select>

        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-change="onFileChange"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary" plain>点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传excel文件
            <a :href="require('../assets/simple.xlsx')" download="simple.xlsx">示例下载</a>
          </div>
        </el-upload>

        <el-button type="primary" class="search-btn" @click="fileSearch">查询</el-button>
      </el-card>
    </div>
    <div class="clear"></div>
    <div class="search-line"></div>
    <el-card class="search-table-result">
      <div class="search-table-head">
        <span>检索结果</span>
        <div>
          <el-button type="primary" @click="addSelected">添加所选</el-button>
          <el-button type="primary" @click="addSelectedAll">添加全部</el-button>
          <el-button type="primary" plain @click="exportAllExcel">导出列表</el-button>
          <el-button type="danger" @click="showFalseInfo" v-show="showFalse">查看检索结果</el-button>
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
          <!--<el-table-column prop="CourseId" label="编号" sortable>
          </el-table-column>-->
          <el-table-column prop="duration" label="时长" width="70">
          </el-table-column>
          <!--<el-table-column prop="creator" label="制作人" width="70">
          </el-table-column>-->
          <el-table-column prop="TempletType" label="类型" width="70">
          </el-table-column>
          <el-table-column prop="progress" label="课程状态" width="80">
          </el-table-column>
          <el-table-column label="操作" width="100" style="text-align: center;">
            <template slot-scope="scope">
              <!--<el-button size="mini" @click="handleRepeatDelete(scope.$index, scope.row)">删除</el-button>-->
              <el-tooltip class="item" effect="dark" content="查看" placement="bottom-start">
                <i class="iconfont" @click="PlayCourse(scope.row)">&#xe63e;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-start">
                <i class="iconfont" @click="EditCourse(scope.row)" v-show="(scope.row.DataType =='旧课件'?false:true) && showBtns">&#xe60c;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="发布" placement="bottom-start">
                <i class="iconfont" @click="courseFtpPublish(scope.row)"
                   v-show="showBtns && (scope.row.DataType =='旧课件'?false:true)">&#xe674;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="撤销发布" placement="bottom-start">
                <i class="iconfont" @click="courseFtpCancel(scope.row)"
                   v-show="showBtns && (scope.row.DataType =='旧课件'?false:true) && (scope.row.progress == '已发布'?true:false)">&#xe605;</i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <el-table ref="multipleTable" :data="allTableData" style="display: none;" id="all_data_table">
          <el-table-column prop="CreateDate" label="日期" width="100" sortable>
          </el-table-column>
          <el-table-column prop="title" label="题目">
          </el-table-column>
          <el-table-column prop="lecturer_name" label="讲师" width="70">
          </el-table-column>
          <!--<el-table-column prop="CourseId" label="编号" sortable>
          </el-table-column>-->
          <el-table-column prop="DataType" label="新/旧" width="70">
          </el-table-column>
          <el-table-column prop="TempletType" label="类型" width="70">
          </el-table-column>
          <el-table-column prop="progress" label="课程状态" width="80">
          </el-table-column>
        </el-table>

      </div>
      <div class="center-box">
        <el-pagination background layout="prev, pager, next" :total="allPage" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-card>

    <div class="co-table-box">
      <el-card>
        <div class="search-table-head">
          <span>筛选结果</span>
          <div>
            <el-button type="primary" v-show="showCreateWorkForm" @click="dialogWorkFormVisible = true;let now = new Date();newWorkFormId2=now.getHours().toString()+now.getMinutes().toString()+now.getSeconds().toString()">新建工单</el-button>
            <el-button type="primary" v-show="showDealWorkForm" v-text="DealBtnText" @click="dialogDealWorkFormVisible = true"></el-button>
            <el-button type="primary" plain @click="exportAllChosenExcel">导出全部列表</el-button>
          </div>

          <el-table id="all_chosen_class_table" style="display: none;" ref="multipleTableChosen" :data="allTableChosen"
                    tooltip-effect="dark"
                    :default-sort="{prop: 'CreateDate', order: 'descending'}">
            <el-table-column prop="CreateDate" label="日期" sortable width="100">
            </el-table-column>
            <el-table-column prop="title" label="题目" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="lecturer_name" label="讲师" width="100">
            </el-table-column>
            <el-table-column prop="CourseId" label="编号" sortable width="100">
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleOldDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>


        </div>
        <div class="new-class-result">
          <div class="search-table-head">
            <span>新课列表</span>
            <div>
              <el-button type="primary" plain @click="exportNewExcel">导出列表</el-button>
              <el-button type="primary" plain @click="tableDataNew = []">全部删除</el-button>
            </div>
          </div>
          <div class="new-class-table">
            <el-table id="new_class_table" ref="multipleTableNew" :data="tableDataNew" tooltip-effect="dark"
                      :default-sort="{prop: 'CreateDate', order: 'descending'}">
              <el-table-column prop="CreateDate" label="日期" sortable width="100">
              </el-table-column>
              <el-table-column prop="title" label="题目" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="lecturer_name" label="讲师" width="100">
              </el-table-column>
              <!--<el-table-column prop="CourseId" label="编号" sortable width="100">
              </el-table-column>-->
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleNewDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

          </div>
        </div>
        <div class="old-class-result">
          <div class="search-table-head">
            <span>旧课列表</span>
            <div>
              <el-button type="primary" plain @click="exportOldExcel()">导出列表</el-button>
              <el-button type="primary" plain @click="tableDataOld = []">全部删除</el-button>
            </div>
          </div>
          <div class="old-class-table">
            <el-table id="old_class_table" ref="multipleTableOld" :data="tableDataOld" tooltip-effect="dark"
                      :default-sort="{prop: 'CreateDate', order: 'descending'}">
              <el-table-column prop="CreateDate" label="日期" sortable width="100">
              </el-table-column>
              <el-table-column prop="title" label="题目" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="lecturer_name" label="讲师" width="100">
              </el-table-column>
              <!--<el-table-column prop="CourseId" label="编号" sortable width="100">
              </el-table-column>-->
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleOldDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog title="检索结果" :visible.sync="dialogTableVisible" class="myExcelResult">
      <h4>检索进度：</h4>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="searchProgress"></el-progress>
      <h4>重复的检索课程：</h4>
      <el-table :data="myExcelRepeat">
        <el-table-column property="id" label="ID"></el-table-column>
        <el-table-column property="title" label="标题"></el-table-column>
      </el-table>
      <h4 class="search-fail">检索失败的课程：</h4>
      <el-table :data="myExcelFault">
        <el-table-column property="id" label="ID"></el-table-column>
        <el-table-column property="title" label="标题"></el-table-column>
      </el-table>
    </el-dialog>
    <!--新建工单对话框-->
    <el-dialog title="新建工单" :visible.sync="dialogWorkFormVisible" class="new-course-config">
      <el-row :gutter="20">
        <el-col :span="3">工单编号:</el-col>
        <el-col :span="2">
          <el-input type="text" :disabled="true" v-model="newWorkFormId1"></el-input>
          <!--<div class="work-form-tips">请填写一位大写字母</div>-->
        </el-col>
        <el-col :span="1">-</el-col>
        <el-col :span="5">
          <el-input type="text" :disabled="true" v-model="newWorkFormNowDate"></el-input>
        </el-col>
        <el-col :span="1">-</el-col>
        <el-col :span="5">
          <el-input type="text" :disabled="true" v-model="newWorkFormId2"></el-input>
          <!--<div class="work-form-tips">请填写自定义编号</div>-->
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">用户信息:</el-col>
        <el-col :span="20">
          <el-input type="text" v-model="newWorkFormUserInfo"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">下载课件:</el-col>
        <el-col :span="20">
          <el-checkbox v-model="newWorkCourseChecked">需要</el-checkbox>
          <el-select v-model="newWorkFormModel" v-show="newWorkCourseChecked" placeholder="请选择模板">
            <!--<el-option label="无" value=""></el-option>-->
            <el-option v-for="(item,index) in videoModelForChoose" :label="item.name" :value="item.id"
                       :key="index"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">输出视频:</el-col>
        <el-col :span="4">
          <el-select v-model="newWorkFormRatio" @change="handleRatioCommand" placeholder="请选择分辨率">
            <el-option label="不需要" value=""></el-option>
            <el-option label="352*288" value="352*288"></el-option>
            <el-option label="640*360" value="640*360"></el-option>
            <el-option label="720*576" value="720*576"></el-option>
            <el-option label="1280*720" value="1280*720"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">自定义码率:</el-col>
        <el-col :span="3">
          <el-input type="text" v-model="newWorkFormBitRate"></el-input>
        </el-col>
        <el-col :span="3">
          单位：K (1M=1024K)
        </el-col>
        <el-col :span="3">是否加水印:</el-col>
        <el-col :span="4">
          <el-radio v-model="newWorkIsWaterMark" label="1">是</el-radio>
          <el-radio v-model="newWorkIsWaterMark" label="0">否</el-radio>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">单独输出素材:</el-col>
        <el-col :span="20">
          <el-checkbox-group v-model="newWorkAttachmentList">
            <el-checkbox label="text">全文(TXT格式)</el-checkbox>
            <el-checkbox label="ppt">PPT</el-checkbox>
            <el-checkbox label="test">考题</el-checkbox>
         </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">备注:</el-col>
        <el-col :span="20">
          <el-input type="textarea" v-model="newWorkFormNote"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">完成期限:</el-col>
        <el-col :span="20">
          <el-date-picker
            v-model="newWorkDeadLine"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">是否做图片:</el-col>
        <el-col :span="20">
          <el-radio v-model="newWorkIsPic" label="1">是</el-radio>
          <el-radio v-model="newWorkIsPic" label="0">否</el-radio>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-show="newWorkIsPic == 1">
        <el-col :span="3">图片要求:</el-col>
        <el-col :span="20">
          <el-input type="textarea" v-model="newWorkPicNote"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">是否做模板:</el-col>
        <el-col :span="20">
          <el-radio v-model="newWorkIsTemplate" label="1">是</el-radio>
          <el-radio v-model="newWorkIsTemplate" label="0">否</el-radio>
        </el-col>
      </el-row>
      <el-row :gutter="20"v-show="newWorkIsTemplate == '1'">
        <el-col :span="3">模板要求:</el-col>
        <el-col :span="20">
          <el-input type="textarea" v-model="newWorkTemplateNote"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">&nbsp;</el-col>
        <el-col :span="4">
          <el-button type="primary" @click="submitNewWorkForm">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!--查看、处理工单对话框-->
    <el-dialog :visible.sync="dialogDealWorkFormVisible" class="new-course-config" width="1400">
      <div slot="title">{{DealWorkFormTitle}}</div>
      <el-card class="work-form-show-card" v-show="DealProjectVisible">
        <el-tag>工单信息</el-tag>
        <el-row :gutter="20">
          <el-col :span="4">工单创建人:</el-col>
          <el-col :span="20">
            {{showFormWorkCreator}}
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">工单编号:</el-col>
          <el-col :span="20">
            {{showFormWorkId}}
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">用户信息:</el-col>
          <el-col :span="20">
            {{showFormWorkUserInfo}}
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">完成期限:</el-col>
          <el-col :span="20">
            {{showFormWorkDeadLine}}
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">要求:</el-col>
          <el-col :span="20">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows:20}"
                      v-model="showFormWorkRequire" :disabled="false"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">备注:</el-col>
          <el-col :span="20">
            <el-input type="textarea" v-model="showFormWorkNote" :disabled="false"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">审核日期:</el-col>
          <el-col :span="5">
            {{showFormWorkCheckDate}}
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">审核备注:</el-col>
          <el-col :span="20">
            <el-input type="textarea" v-model="showFormWorkCheckNote" :disabled="false"></el-input>
          </el-col>
        </el-row>
      </el-card>
      <!-- 处理工单(流程)-->
      <el-card class="work-form-DealProject-card" v-show="DealProjectVisible">
        <el-tag  type="info">流程处理</el-tag>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-button type="primary" @click="submitSendingProject('help')" :disabled="DealSendingHelpBtnState">{{DealSendingHelpBtnText}}</el-button>
          </el-col>
          <!--<el-col :span="6">
            <el-button type="primary" @click="submitSendingProject('attachment')" :disabled="DealSendingAttachmentBtnState">{{DealSendingAttachmentBtnText}}</el-button>
          </el-col>-->
          <el-col :span="6">
            <el-button type="primary" @click="submitSendingProject('template')" :disabled="DealSendingTemplateBtnState">{{DealSendingTemplateBtnText}}</el-button>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="submitSendingProject('pic')" :disabled="DealSendingPicBtnState">{{DealSendingPicBtnText}}</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">备注:</el-col>
          <el-col :span="20">
            <el-input type="textarea" v-model="dealWorkFormNote"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">&nbsp;</el-col>
          <el-col :span="4">
            <el-button type="primary" @click="submitDealProject" :disabled="DealProjectBtnState" >{{DealProjectBtnText}}</el-button>
          </el-col>
        </el-row>
      </el-card>
      <!-- 处理工单(新)-->
      <el-card class="work-form-DealNew-card" v-show="DealProjectNewVisible">
        <el-tag  type="info">新课输出</el-tag>
        <el-row :gutter="20">
          <el-col :span="4">下载课件:</el-col>
          <el-col :span="20">
            <el-select v-model="dealWorkFormModel" placeholder="请选择模板">
              <el-option label="不需要" value=""></el-option>
              <el-option v-for="(item,index) in videoModelForChoose" :label="item.name" :value="item.id"
                         :key="index"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">输出视频:</el-col>
          <el-col :span="20">
            <el-select v-model="dealWorkFormRatio" placeholder="请选择分辨率">
              <el-option label="不需要" value=""></el-option>
              <el-option label="352*288" value="352*288"></el-option>
              <el-option label="640*360" value="640*360"></el-option>
              <el-option label="720*576" value="720*576"></el-option>
              <el-option label="1280*720" value="1280*720"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">是否改名:</el-col>
          <el-col :span="20">
            <el-radio v-model="dealWorkFormRename" label="1">是</el-radio>
            <el-radio v-model="dealWorkFormRename" label="0">否</el-radio>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">&nbsp;</el-col>
          <el-col :span="4">
            <el-button type="primary" @click="submitDealNew" :disabled="DealNewBtnState">{{DealNewBtnText}}</el-button>
          </el-col>
        </el-row>
      </el-card>
      <!-- 处理工单(旧)-->
      <el-card class="work-form-DealOld-card" v-show="DealProjectOldVisible">
        <el-tag  type="info">旧课输出</el-tag>
        <el-row :gutter="20">
          <el-col :span="4">旧模板:</el-col>
          <el-col :span="20">
            <el-select v-model="dealWorkFormModel" placeholder="请选择旧模板">
              <el-option label="不需要" value=""></el-option>
              <el-option v-for="(item,index) in videoModelForChoose" :label="item.name" :value="item.id"
                         :key="index"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">2012版模板:</el-col>
          <el-col :span="20">
            <el-select v-model="dealWorkFormModel" placeholder="请选择2012模板">
              <el-option label="不需要" value=""></el-option>
              <el-option v-for="(item,index) in videoModelForChoose" :label="item.name" :value="item.id"
                         :key="index"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">是否改名:</el-col>
          <el-col :span="20">
            <el-radio v-model="dealWorkFormRename" label="1">是</el-radio>
            <el-radio v-model="dealWorkFormRename" label="0">否</el-radio>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">&nbsp;</el-col>
          <el-col :span="4">
            <el-button type="primary" @click="">确定下载</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
  import appHead from '@/components/AppHead.vue'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    components: {
      appHead
    },
    data() {
      var DefaultEndDate = new Date();
      var DefaultStartDate =new Date();
      DefaultStartDate.setFullYear(DefaultStartDate.getFullYear()-2);
      return {
        //导航信息
        MenuIndex: 0,
        /*当前用户信息*/
        userName: '',
        userPassword: '',
        userState: '',
        userType: '',
        myToken: '',

        /*excel检索的变量*/
        fileList: [],
        excelSearchType: 'A',
        searchProgress: 0,
        X: null,
        excelFile: {},
        myExcel: [],
        myExcelRepeat: [],
        myExcelFault: [],

        /*手动检索的变量*/
        videoType: "",
        courseState:"none",
        publishType:"none",
        isEspecialClass: "",
        className: '',
        classTeacher: '',
        classKeyword: '',
        classDate:[DefaultStartDate,DefaultEndDate],
        RangePickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },

        /*检索结果总页数*/
        allPage: 0,
        curPage: 1,

        /*课程列表 & 课程id集合*/
        allTableData: [], /*当前所有的检索所得课程信息——用于导出列表*/
        currentShowTableData: [], /*当前页展示的课程列表*/
        multipleSelection: [], /*当前选中的课程列表*/
        tableDataNew: [], /*当前已选新课列表*/
        tableDataOld: [], /*当前已选旧课列表*/
        allTableChosen: [], /*当前已选的所有课程列表——用于导出选中课程列表*/
        newCourseIds: [], /*当前已选新课列表的课程id*/
        oldCourseIds: [], /*当前已选旧课列表的课程id*/
        allTableChosenId: [], /*当前已选课程列表的课程id*/

        /*界面butotn的显示属性*/
        showFalse: false,
        showBtns: false,
        showConfigBtn: false,
        showCreateWorkForm: true,
        showDealWorkForm: false,
        DealBtnText:"下载课件",

        /*用于base64转中文*/
        keyStr: "",

        /*检索中的加载框的显示变量*/
        loadingAll: false,

        /*弹出对话框*/
        dialogTableVisible: false,
        dialogWorkFormVisible: false,
        dialogDealWorkFormVisible: false,

        /*新建工单的变量*/
        newWorkFormId1: 'X',
        newWorkFormNowDate: '',
        newWorkFormId2: '',
        newWorkFormId: '',
        newWorkFormUserInfo: '',
        newWorkFormModel: '',
        newWorkFormRatio: '',
        newWorkFormNote: '',
        newWorkIsPic: '0',
        newWorkPicNote: '',
        newWorkIsTemplate: '0',
        newWorkTemplateNote: '',
        newWorkFormBitRate: '',
        newWorkIsWaterMark: '1',
        newWorkDeadLine: '',
        newWorkCourseChecked:false,
        newWorkAttachmentList:[],

        /*处理工单-展示工单的变量*/
        DealProjectVisible:false,
        DealNewBtnState:false,
        DealNewBtnText:'确定下载',
        DealProjectBtnState:true,
        DealProjectBtnText:'工单完成',
        DealSendingHelpBtnState:true,
        DealSendingHelpBtnText:'分派辅助制作',
        DealSendingTemplateBtnState:true,
        DealSendingTemplateBtnText:'分派模板制作',
        DealSendingPicBtnState:true,
        DealSendingPicBtnText:'分派图片制作',
        DealProjectOldVisible:false,
        DealProjectNewVisible:false,
        DealWorkFormTitle:'查看工单',
        showFormWorkCreator: '',
        showFormWorkId: '',
        showFormWorkUserInfo: '',
        showFormWorkDeadLine:'',
        showFormWorkRequire:'',
        showFormWorkNote: '',
        showFormWorkCheckDate: '',
        showFormWorkCheckNote: '',
        showFormWorkAllCourseData: '',

        /*处理工单-信息填写的变量*/
        dealWorkFormModel: '',
        dealWorkFormRatio: '',
        dealWorkFormNote: '',
        dealWorkFormRename: '1',

        /*从后台获取的供选择的模板信息*/
        videoModelForChoose: [],
      }
    },
    mounted() {
      var that = this;
      //this.myToken = localStorage.getItem('mytoken');
      this.userType = localStorage.getItem('myusertype');
      this.userName = localStorage.getItem('myusername');

      //通过链接登录 暂时以有mode为依据
      //  http://localhost:8080/#/HomePage?login=Z3dxX2d3cUAyMDE4&mode=dispatch&project=A-20180524-1
      if (this.getRequest()["mode"]) {
        var Request = new Object();
        var Request2 = new Object();
        Request = this.getRequest();
        Request2 = this.getRequest2();
        console.log(Request2);
        console.log(Request["mode"]);
        this.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        this.userState = Request2["mode"];
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
              localStorage.setItem('myusername',modeUserName);
              localStorage.setItem('myuserpass',modePassword);
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

        this.$http.post('http://newpms.cei.cn/ApiLogin/', {"username": modeUserName, "password": modePassword})
          .then(function (response) {
            console.log('login', response);
            localStorage.setItem('myusertype', response.data.group);
            that.userType = response.data.group;
            //角色
            if (that.userType == 'manager')
            {
              that.showCreateWorkForm = true;
              that.showDealWorkForm = true;
              that.DealProjectNewVisible=true;
              that.DealProjectOldVisible=true;
            }
            if (that.userType == 'seller' || that.userType == 'SeniorSeller') {
              that.showCreateWorkForm = true;
              that.showDealWorkForm = false;
            }
            if (that.userType == 'SeniorWorker') {
              that.showDealWorkForm = true;
              that.showCreateWorkForm =false;
              that.DealProjectNewVisible=true;
              that.DealProjectOldVisible=true;
              if(that.mode="disposal" && projectId){
                that.dialogDealWorkFormVisible = true;
                that.DealBtnText="处理工单";
                that.DealWorkFormTitle='处理工单';
                that.DealProjectVisible=true;
                that.$http.get('http://pms.cei.com.cn/InterFace/custom.ashx?method=get&id='+projectId,{withCredentials:false}).then(function (res) {
                  var workFormInfo = res.data;
                  that.showFormWorkCreator = workFormInfo.user;
                  that.showFormWorkId = workFormInfo.id;
                  that.showFormWorkUserInfo = workFormInfo.custom;
                  //操作状态
                  //
                  if (workFormInfo.HelpSendingDate == "")
                  {
                    that.DealSendingHelpBtnState=false;
                  }
                  else{
                    that.DealSendingHelpBtnText="正在辅助制作";
                  }
                  if (workFormInfo.HelperFinishDate != "")
                  {
                    that.DealSendingHelpBtnText="辅助制作已完成";
                  }
                  //
                  if (workFormInfo.TemplateSendingDate == "")
                  {
                    that.DealSendingTemplateBtnState=false;
                  }
                  else{
                    that.DealSendingTemplateBtnText="模板正在制作";
                  }
                  if (workFormInfo.TemplateFinishDate != "")
                  {
                    that.DealSendingTemplateBtnText="模板制作已完成";
                  }
                  //
                  if (workFormInfo.PicSendingDate == "")
                  {
                    that.DealSendingPicBtnState=false;
                  }
                  else{
                    that.DealSendingPicBtnText="图片正在制作";
                  }
                  if (workFormInfo.PicFinishDate != "")
                  {
                    that.DealSendingPicBtnText="图片制作已完成";
                  }
                  if (workFormInfo.FinishDate != "")
                  {
                    that.DealProjectBtnText="工单已完成";
                  }
                  if (workFormInfo.FinishDate == "" && (workFormInfo.HelpSendingDate=="" || workFormInfo.HelperFinishDate != "")
                    && (workFormInfo.TemplateSendingDate=="" || workFormInfo.TemplateFinishDate != "")  && (workFormInfo.PicSendingDate=="" || workFormInfo.PicFinishDate != ""))
                  {
                    that.DealProjectBtnState=false;
                  }
                  //任务要求
                  if (workFormInfo.require.template != "")
                  {
                    if (workFormInfo.require.template == 0)
                    {
                      that.showFormWorkRequire +=  "模板：未指定\n\r";
                    }
                    else{
                      var ThisTemplate = that.videoModelForChoose.filter((t) => { return t.id === workFormInfo.require.template; });
                      that.showFormWorkRequire +=  "模板：" + ThisTemplate[0].name + "\n\r";
                    }
                  }
                  else {
                    that.showFormWorkRequire +=  "不需要下载课件\n\r";
                  }
                  workFormInfo.require.DisplaySize === "" ? that.showFormWorkRequire+="输出分辨率：未指定 ; " : that.showFormWorkRequire += "输出分辨率：" + workFormInfo.require.DisplaySize + " ; ";
                  workFormInfo.require.BitRate === "" ? that.showFormWorkRequire+="码率：未指定 ; " : that.showFormWorkRequire += "码率：" + workFormInfo.require.BitRate + "K ; ";
                  workFormInfo.require.IsWaterMark === "1" ? that.showFormWorkRequire +=  "水印：是\n\r" : that.showFormWorkRequire += "水印：否\n\r";
                  workFormInfo.require.IsPic === "1" ? that.showFormWorkRequire += "做图：是 ; 要求：" + workFormInfo.require.PicNote + "\n\r" : that.showFormWorkRequire += "做图：否\n\r";
                  workFormInfo.require.IsTemplate === "1" ? that.showFormWorkRequire += "做模板：是 ; 要求：" + workFormInfo.require.TemplateNote : that.showFormWorkRequire += "做模板：否";
                    //that.showFormWorkModal = workFormInfo.require.template;
                  //that.showFormWorkRatio = workFormInfo.require.DisplaySize;
                  //
                  that.showFormWorkNote = workFormInfo.note;
                  that.showFormWorkCheckDate = workFormInfo.CheckDate;
                  that.showFormWorkCheckNote = workFormInfo.CheckNote;
                  that.showFormWorkAllCourseData = workFormInfo.CourseData;
                  //List Data
                  workFormInfo.CourseData.forEach(function (item) {
                    if (item.DataType == '新课件') {
                      that.tableDataNew.push(item);
                    } else {
                      that.tableDataOld.push(item);
                    }
                  });
                }).catch(function (err) {
                  console.log(err);
                });
              }
              else{
                that.DealBtnText="下载新课";
              }
            }
            if (that.userType == 'editor' || that.userType == 'manager' || that.userType == 'SeniorEditor') {
              that.showBtns = true;
            }
            if (that.userType == 'SeniorWorker' || that.userType == 'manager' || that.userType == 'SeniorEditor') {
              that.showConfigBtn = true;
            }
            //mode
            if(that.mode="browse" && projectId){
              console.log("hit");
              that.$http.get('http://pms.cei.com.cn/InterFace/custom.ashx?method=get&id='+projectId,{withCredentials:false}).then(function (res) {
                var workFormInfo = res.data;
                //List Data
                workFormInfo.CourseData.forEach(function (item) {
                  if (item.DataType == '新课件') {
                    that.tableDataNew.push(item);
                  } else {
                    that.tableDataOld.push(item);
                  }
                });
              }).catch(function (err) {
                console.log(err);
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      else{
        this.myToken = localStorage.getItem('mytoken');
      }




      if (this.userType == 'seller' || this.userType == 'SeniorSeller') {
        this.showCreateWorkForm = true;
      }
      if (this.userType == 'SeniorWorker') {
        this.showDealWorkForm = true;
      }
      if (this.userType == 'editor' || this.userType == 'manager' || this.userType == 'SeniorEditor') {
        this.showBtns = true;
      }
      if (this.userType == 'SeniorWorker' || this.userType == 'manager' || this.userType == 'SeniorEditor') {
        this.showConfigBtn = true;
      }

      var nowDate = new Date();
      var year = nowDate.getFullYear();
      var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
        : nowDate.getMonth() + 1;
      var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
        .getDate();
      this.newWorkFormNowDate = year + month + day;

      //获取模板选项内容
      var getModelUrl = 'http://newpms.cei.cn/coursetemplet/';
      this.$http.get(getModelUrl).then(function (res) {
        // console.log(res);
        that.videoModelForChoose = res.data;
      }).catch(function (err) {
        console.log(err);
      })
    },
    methods: {
      //appHead
      getMenuIndexVal(index) {
        this.MenuIndex=index;
        //console.log(this.MenuIndex);
      },
      //获取url中的参数及其值
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
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          } else if((c > 127) && (c < 2048)) {
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

      //
      selectClassWord() {
        this.loadingAll = true;
        this.currentShowTableData = [];
        this.allTableData = [];
        console.log(this.classDate[1].Format("yyyy-MM-dd HH:mm:ss"));
        var that = this;
        var urlNew = "http://newpms.cei.cn/course/FieldQuery/" +
          "?title=" + encodeURIComponent(this.className) + "&lecturer=" + encodeURIComponent(this.classTeacher)
          + "&key=" + encodeURIComponent(this.classKeyword) + "&type=" + encodeURIComponent(this.videoType)
          + "&source=" + encodeURIComponent(this.isEspecialClass) + "&start="+encodeURIComponent(this.classDate[0].Format("yyyy-MM-dd HH:mm:ss"))
          + "&end="+encodeURIComponent(this.classDate[1].Format("yyyy-MM-dd HH:mm:ss")) + "&sheet="+encodeURIComponent(this.publishType);
        // console.log(urlNew);
        var urlOld = "http://newpms.cei.cn/OldCourseQuery/" +
          "?title=" + encodeURIComponent(this.className) + "&lecturer=" + encodeURIComponent(this.classTeacher) +
          "&key=" + encodeURIComponent(this.classKeyword) + "&type=" + encodeURIComponent(this.videoType)
          + "&source=" + encodeURIComponent(this.isEspecialClass) + "&start="+encodeURIComponent(this.classDate[0].Format("yyyy-MM-dd HH:mm:ss"))
          + "&end="+encodeURIComponent(this.classDate[1].Format("yyyy-MM-dd HH:mm:ss")) + "&sheet="+encodeURIComponent(this.publishType);
        this.$http.get(urlNew, {headers: {'Authorization': 'JWT ' + that.myToken}})
          .then(function (response) {
            if (response.status == 200) {
              // console.log(response);
              response.data.forEach(function (item) {
                item.DataType = "新课件";
                that.allTableData.push(item);
              });

              that.$http.get(urlOld, {headers: {'Authorization': 'JWT ' + that.myToken}})
                .then(function (response) {
                  // console.log(response);

                  response.data.forEach(function (item) {
                    that.allTableData.push(item);
                  });
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
      //删除检索结果中的指定课程
      handleRepeatDelete(index, row) {
        this.$confirm('确定删除该课程？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (var i = 0, n = 0; i < this.allTableData.length; i++) {
            if (this.allTableData[i] != row) {
              this.allTableData[n++] = this.allTableData[i];
            }
          }
          this.allTableData.pop();
          this.reShowTable();
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
      handleNewDelete(index, row) {
        this.$confirm('确定删除该课程？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (var i = 0, n = 0; i < this.tableDataNew.length; i++) {
            if (this.tableDataNew[i] != row) {
              this.tableDataNew[n++] = this.tableDataNew[i];
            }
          }
          this.tableDataNew.pop();

          for (var i = 0, n = 0; i < this.allTableChosenId.length; i++) {
            if (this.allTableChosenId[i] != row.CourseId) {
              this.allTableChosenId[n++] = this.allTableChosenId[i];
            }
          }
          this.allTableChosenId.pop();

          for (var i = 0, n = 0; i < this.newCourseIds.length; i++) {
            if (this.newCourseIds[i] != row.CourseId) {
              this.newCourseIds[n++] = this.newCourseIds[i];
            }
          }

          this.newCourseIds.pop();

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
      handleOldDelete(index, row) {
        this.$confirm('确定删除该课程？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (var i = 0, n = 0; i < this.tableDataOld.length; i++) {
            if (this.tableDataOld[i] != row) {
              this.tableDataOld[n++] = this.tableDataOld[i];
            }
          }
          this.tableDataOld.pop();

          for (var i = 0, n = 0; i < this.allTableChosenId.length; i++) {
            if (this.allTableChosenId[i] != row.CourseId) {
              this.allTableChosenId[n++] = this.allTableChosenId[i];
            }
          }
          this.allTableChosenId.pop();

          for (var i = 0, n = 0; i < this.oldCourseIds.length; i++) {
            if (this.oldCourseIds[i] != row.CourseId) {
              this.oldCourseIds[n++] = this.oldCourseIds[i];
            }
          }
          this.oldCourseIds.pop();

          this.oldCourseIds.pop();
          // console.log(this.allTableChosenId);

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
      //修改当前页数，列表随之改变
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

        //  添加每一项的选中状态；
        // console.log(this.allTableChosenId);
      },
      /*上传文件的操作*/
      onFileChange(file) {
        this.excelFile = file;
      },
      handleRemove(file, fileList) {
        this.excelFile = {};
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      //添加所选课程到新课旧课列表
      addSelected() {
        var that = this;

        this.multipleSelection.forEach(function (item) {
          if (that.allTableChosenId.indexOf(item.CourseId) < 0) {
            that.allTableChosen.push(item);
            that.allTableChosenId.push(item.CourseId)
          }

          if (item.DataType == '新课件') {
            if (that.newCourseIds.indexOf(item.CourseId) < 0) {
              that.tableDataNew.push(item);
              that.newCourseIds.push(item.CourseId);
            } else {
              // that.$message({
              //   message: '该选项已存在！',
              //   type: 'warning'
              // });
            }
          } else if (item.DataType == '旧课件') {

            if (that.oldCourseIds.indexOf(item.CourseId) < 0) {
              that.tableDataOld.push(item);
              that.oldCourseIds.push(item.CourseId)
            } else {
              // that.$message({
              //   message: '该选项已存在！',
              //   type: 'warning'
              // });
            }
          }
        });
      },
      //添加所有课程到新课旧课列表
      addSelectedAll() {
        var that = this;
        // console.log(that.allTableChosenId);
        this.allTableData.forEach(function (item) {
          if (that.allTableChosenId.indexOf(item.CourseId) < 0) {
            //that.allTableChosen.push(item);
            that.allTableChosenId.push(item.CourseId)
          }

          if (item.DataType == '新课件') {
            if (that.newCourseIds.indexOf(item.CourseId) < 0) {
              that.tableDataNew.push(item);
              that.newCourseIds.push(item.CourseId)
            } else {
              // that.$message({
              //   message: '已存在您的选中选项！',
              //   type: 'warning'
              // });
            }
          } else if (item.DataType == '旧课件') {

            if (that.oldCourseIds.indexOf(item.CourseId) < 0) {
              that.tableDataOld.push(item);
              that.oldCourseIds.push(item.CourseId)
            } else {
              // that.$message({
              //   message: '已存在选中选项！',
              //   type: 'warning'
              // });
            }
          }
        });
      },
      //重新显示课程列表
      reShowTable() {

        this.allPage = this.allTableData.length;

        var myCurrentShowTableData = [];
        var count = 0;
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

        this.currentShowTableData = myCurrentShowTableData;
      },
      exportNewExcel() {
        /* generate workbook object from table */
        //var wb = XLSX.utils.table_to_book(document.querySelector('#new_class_table'));
        var ws = XLSX.utils.json_to_sheet(this.tableDataNew);
        var wb = new XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* get binary string as output */
        var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});
        try {
          FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '新课列表.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout;
      },
      exportOldExcel() {
        /* generate workbook object from table */
        //var wb = XLSX.utils.table_to_book(document.querySelector('#old_class_table'));
        var ws = XLSX.utils.json_to_sheet(this.tableDataOld);
        var wb = new XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* get binary string as output */
        var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});
        try {
          FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '旧课列表.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout;
      },
      exportAllExcel() {
        /* generate workbook object from table */
        //var ws = XLSX.utils.json_to_sheet(this.allTableData, {header:["CourseId", "title", "GroupName", "lecturer_name", "lecturer_post", "TempletType", "CreateDate", "DataType", "type", "creator", "progress", "duration"]});
        var ws = XLSX.utils.json_to_sheet(this.allTableData);
        var wb = new XLSX.utils.book_new();
        //var wb;
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* get binary string as output */
        var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});
        try {
          FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '课程列表.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout;
      },
      exportAllChosenExcel() {

        /* generate workbook object from table */
        //var wb = XLSX.utils.table_to_book(document.querySelector('#all_chosen_class_table'));
        this.allTableChosen=[]
        this.allTableChosen=this.allTableChosen.concat(this.tableDataNew)
        this.allTableChosen=this.allTableChosen.concat(this.tableDataOld)
        var ws = XLSX.utils.json_to_sheet(this.allTableChosen);
        var wb = new XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* get binary string as output */
        var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});
        try {
          FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '课程列表.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout;
      },
      fileSearch() {
        this.dialogTableVisible = true;
        this.X = XLSX;
        var rAbs = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";

        var that = this;
        var f = this.excelFile.raw;
        var reader = new FileReader();
        reader.onload = function () {
          var data = event.target.result, wb;
          if (rAbs) {
            wb = that.X.read(data, {type: 'binary'});
          }
          that.excelSearchAndShowOnPage(wb.Sheets.Sheet1)
        };
        if (rAbs) {
          reader.readAsBinaryString(f)
        } else {
          reader.readAsArrayBuffer(f);
        }
      },
      excelSearchAndShowOnPage(mySheet) {
        console.log(mySheet);
        var sheetSize = Object.getOwnPropertyNames(mySheet).length / 2 - 1;
        var idArray = [];
        for (var i = 2; i <= sheetSize; i++) {
          if (idArray.indexOf(mySheet['A' + i]['v']) < 0) {
            var mySheetItem = {
              id: mySheet['A' + i]['v'],
              title: mySheet['B' + i]['v'],
              //0:搜索成功且唯一；1：搜索不存在；2：搜索重复；3:未知；
              status: 3
            };
            this.myExcel.push(mySheetItem);
          } else {
            var mySheetItem = {
              id: mySheet['A' + i]['v'],
              title: mySheet['B' + i]['v'],
              status: 2
            };
            this.myExcelRepeat.push(mySheetItem);
          }
          idArray.push(mySheet['A' + i]['v']);
        }
        this.allTableData = [];
        this.currentShowTableData = [];
        var that = this;
        var searchType = this.excelSearchType == 'A' ? 'id' : 'title';
        var myProgress = 0;
        var allProgree = this.myExcel.length * 2;
        for (var i = 0; i <= this.myExcel.length; i++) {
          var urlexcelNew = "http://newpms.cei.cn/course/FieldQueryExacted/" +
            "?field=" + searchType + "&val=" + this.myExcel[i][searchType];
          var urlexcelOld = "http://newpms.cei.cn/OldCourseQueryExacted/" +
            "?field=" + searchType + "&val=" + this.myExcel[i][searchType];
          (function () {
            var index = i;
            var hasSearchResult = 0;
            that.$http.get(urlexcelNew, {headers: {'Authorization': 'JWT ' + that.myToken}})
              .then(function (response) {
                myProgress++;
                that.searchProgress = parseInt(myProgress / allProgree * 100);
                if (response.data.length > 0) {
                  hasSearchResult++;
                  response.data.forEach(function (item) {
                    item.DataType = "新课件";
                    that.allTableData.push(item);
                  });
                  that.reShowTable();
                }

                var mySheetStatus = hasSearchResult > 0 ? 0 : 1;
                that.myExcel[index].status = mySheetStatus;
                //展示“查看错误检索”按钮
                that.showFalse = true;

                if (that.searchProgress == 100) {
                }
              })
              .catch(function (error) {
                console.log(error);
              });

            /*旧课搜索*/
            that.$http.get(urlexcelOld, {headers: {'Authorization': 'JWT ' + that.myToken}})
              .then(function (response) {
                myProgress++;
                that.searchProgress = parseInt(myProgress / allProgree * 100);
                if (response.data.length > 0) {
                  hasSearchResult++;
                  response.data.forEach(function (item) {
                    that.allTableData.push(item);
                  });
                  that.reShowTable();
                }
                var mySheetStatus = hasSearchResult > 0 ? 0 : 1;
                that.myExcel[index].status = mySheetStatus;
                //展示“查看错误检索”按钮
                that.showFalse = true;

                if (that.searchProgress == 100) {
                  that.myExcel.forEach(function (item) {
                    if (item.status == 1) {
                      that.myExcelFault.push(item);
                    }
                  })
                }

              })
              .catch(function (error) {
                console.log(error);
              });

          }())


        }

      },
      showFalseInfo() {
        this.dialogTableVisible = true;
      },

      //
      PlayCourse(row) {
        if (row.DataType == '新课件') {
          //console.log(row.SourceCourseId);
          if(row.SourceCourseId === null) {
            window.open('http://203.207.118.112/CourseFile/'+row.CourseId.slice(0,4)+'/' + row.CourseId + '/publish/index.html');
          }
          else {
            window.open('http://203.207.118.112/CourseFile/'+row.CourseId.slice(0,4)+'/' + row.CourseId + '/index.html');
          }
        }
        else if (row.DataType == '旧课件') {
          window.open('http://203.207.118.110/doc/' + row.CourseId + '/');
        }
      },

      //
      EditCourse(row) {
          var login = encodeURIComponent(this.encode64(this.userName+'_'+this.userPassword));
          console.log(this.userName+'_'+this.userPassword);
          if (row.SourceCourseId != '' && row.SourceCourseId && typeof(row.SourceCourseId)!='undefined') {
            console.log('http://newpms.cei.cn/SlideEdit/?id=' + row.SourceCourseId + '&link=' + login);
            window.open('http://newpms.cei.cn/SlideEdit/?id=' + row.SourceCourseId + '&link=' + login);
          }
          else {
            console.log();
            window.open('http://newpms.cei.cn/SlideEdit/?id=' + row.CourseId + '&link=' + login);
          }
      },

      courseFtpPublish(row) {

        var that = this;
        var urlPublish = 'http://newpms.cei.cn/edittask/';
        this.$confirm('确定发布该课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {


          var courses = new Array()
          courses[0] = row.CourseId;
          that.$axios({
            method: 'post',
            headers: {'Authorization': 'JWT ' + that.myToken},
            url: urlPublish,
            data: {
              "TaskType": "CourseFtpPublish",
              "course": courses
            }
          }).then(function (res) {
            // console.log(res);
            if (res.status == 201) {
              this.$message({
                type: 'success',
                message: '发布成功!'
              });
            }
            if (res.status == 204) {
              this.$message({
                type: 'warning',
                message: '重复操作：此课件已发布!'
              });
            }
          }).catch(function (error) {
            console.log(error);
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发布'
          });
        });
      },

      courseFtpCancel(row) {

        var that = this;
        var urlPublishCancel = 'http://newpms.cei.cn/edittask/';
        this.$confirm('确定撤回该课程的发布?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          var courses = new Array()
          courses[0] = row.CourseId;
          that.$axios({
            method: 'post',
            headers: {'Authorization': 'JWT ' + that.myToken},
            url: urlPublishCancel,
            data: {
              "TaskType": "CourseFtpCancel",
              "course": courses
            }
          }).then(function (res) {
            // console.log(res);
            if (res.status == 201) {
              this.$message({
                type: 'success',
                message: '撤销发布成功!'
              });
            }
            if (res.status == 204) {
              this.$message({
                type: 'warning',
                message: '重复操作：此课件已撤回发布!'
              });
            }
          }).catch(function (error) {
            console.log(error);
          });


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      submitNewWorkForm() {
        var that = this;

        this.newWorkFormId = this.newWorkFormId1 + '-' + this.newWorkFormNowDate + '-' + this.newWorkFormId2;
        // console.log(this.newWorkFormId);
        // console.log(this.newWorkFormUserInfo);
        // console.log(this.newWorkFormModel);
        // console.log(this.newWorkFormRatio);
        // console.log(this.newWorkFormNote);
        // console.log(this.username);
        // console.log(this.allTableChosen);

        var myNewWorkFormUrl = 'http://pms.cei.com.cn/InterFace/custom.ashx?method=insert';
        console.log(this.userName);
        var newWorkCourseTemplate ="";
        if (!that.newWorkCourseChecked)
        {
          newWorkCourseTemplate="";
        }
        else {
          newWorkCourseTemplate=that.newWorkIsTemplate;
        }
        this.$axios({
          method: 'post',
          url: myNewWorkFormUrl,
          data: {
            "id": that.newWorkFormId,
            "custom": that.newWorkFormUserInfo,
            "user": this.userName,
            "DeadLine":this.newWorkDeadLine,
            "note": that.newWorkFormNote,
            "require": {
              "template": newWorkCourseTemplate,
              "DisplaySize": that.newWorkFormRatio,
              "BitRate":that.newWorkFormBitRate,
              "IsWaterMark":that.newWorkIsWaterMark,
              "IsPic":that.newWorkIsPic,
              "PicNote":that.newWorkPicNote,
              "IsTemplate":that.newWorkIsTemplate,
              "TemplateNote":that.newWorkTemplateNote,
              //"AttText":IsInArray(that.newWorkAttachmentList,'text'),
              //"AttPPT":IsInArray(that.newWorkAttachmentList,'ppt'),
              //"AttTest":IsInArray(that.newWorkAttachmentList,'test'),
            },
            "CourseData": that.allTableChosen
          },
          withCredentials:false
        }).then(function (res) {
          // console.log(res);
          if (res.status == 201) {
            that.$message({
              type: 'success',
              message: '新建工单成功！'
            });
            that.dialogWorkFormVisible = false;
          } else if (res.status == 204) {
            that.$message({
              type: 'warning',
              message: '重复操作：此工单已存在！'
            });
            that.dialogWorkFormVisible = false;
          }
        }).catch(function (err) {
          console.log(err);
        })
        /*
        * 新建工单
        * 不需要token
        * post http://pms.cei.com.cn/InterFace/custom.ashx?method=insert
        * {
        * "id":"网页上填的id",
        * "custom":"网页上填的用户信息",
        * "user":"登录的用户名",
        * "note":"网页上填的备注",
        * "require":(网页上填的两个下拉框模板和尺寸,没有为null){"template":"b","DisplaySize":"null"},
        * "CourseData":[{"id":"1","type":"new","title":"XXX"},{"id":"2","type":"old"},{"id":"3","type":"new"}]
        * }*/
      },
      submitDealNew() {
        var that = this;
        var showFormWorkAllCourseDataIds = [];
        //this.showFormWorkAllCourseData.forEach(function (item) {
        this.tableDataNew.forEach(function (item) {
          if (item.DataType == '新课件') {
            showFormWorkAllCourseDataIds.push(item.CourseId);
          }
        });

        var myDealWorkFormTokenUrl = 'http://newpms.cei.cn/edittask/';
        var extendedData = {
          "template": that.dealWorkFormModel,
          "DisplaySize": that.dealWorkFormRatio,
          "rename": that.dealWorkFormRename
        };
        extendedData = JSON.stringify(extendedData);
        var dealNote="无";
        if(that.dealWorkFormNote){
          dealNote=that.dealWorkFormNote;
        }
        this.$axios({
          method: 'post',
          url: myDealWorkFormTokenUrl,
          headers: {'Authorization': 'JWT ' + that.myToken},
          data: {
            "TaskType": "CourseDownload",
            "TaskNote": dealNote,
            "ExtendedData": extendedData,
            "course": showFormWorkAllCourseDataIds
          }
        }).then(function (res) {
          console.log(res);
          if (res.status == 201) {
            that.$message({
              type: 'success',
              message: '任务已添加'
            });
            that.DealNewBtnState=false;
            that.DealNewBtnText='任务已添加';
          } else if (res.status == 204) {
            that.$message({
              type: 'warning',
              message: '重复操作'
            });
            //that.dialogWorkFormVisible = false;
          }
        }).catch(function (err) {
          that.$message({
            type: 'warning',
            message: '错误！'
          });
          console.log(err);
        });
      },
      submitDealProject(){
        var that = this;
        if (that.showFormWorkId) {
          var myDealWorkFormUrl = 'http://pms.cei.com.cn/InterFace/custom.ashx?method=UpdateProgress';
          this.$axios({
            method: 'post',
            url: myDealWorkFormUrl,
            data: {
              "id": that.showFormWorkId,
              "transactor": that.userName,
              "CourseData": that.showFormWorkAllCourseData,
              "note": that.dealWorkFormNote
            },
            withCredentials: false
          }).then(function (res) {
            // console.log(res);
            if (res.status == 200) {
              that.$message({
                type: 'success',
                message: '处理工单成功！'
              });
              that.DealProjectBtnState=true;
              that.dialogWorkFormVisible = false;
            } else if (res.status == 204) {
              that.$message({
                type: 'warning',
                message: '重复操作：此工单已处理！'
              });
              that.dialogWorkFormVisible = false;
            }
          }).catch(function (err) {
            console.log(err);
          })
        }
      },
      submitSendingProject(type) {
        var that = this;
        var myDealWorkFormUrl = 'http://pms.cei.com.cn/InterFace/custom.ashx?method=UpdateSending';
        this.$axios({
          method: 'post',
          url: myDealWorkFormUrl,
          data: {
            "id": that.showFormWorkId,
            "type":type
          },
          withCredentials: false
        }).then(function (res) {
          // console.log(res);
          if (res.status == 200) {
            that.$message({
              type: 'success',
              message: '处理成功！'
            });
            if (type == "help")
            {
              that.DealSendingHelpBtnState = true;
              that.DealSendingHelpBtnText='已发送';
            }
            else if (type == "pic")
            {
              that.DealSendingPicBtnState = true;
              that.DealSendingPicBtnText='已发送';
            }
            else if (type == "template")
            {
              that.DealSendingTemplateBtnState = true;
              that.DealSendingTemplateBtnText='已发送';
            }
            else { }
          } else if (res.status == 204) {
            that.$message({
              type: 'warning',
              message: ''
            });
            that.dialogWorkFormVisible = false;
          }
        }).catch(function (err) {
          console.log(err);
        })
      },
      handleRatioCommand(val) {
        var BitRatio;
        if(val=="352*288"){ BitRatio="180"; }
        else if(val=="640*360"){ BitRatio="300"; }
        else if(val=="720*576"){ BitRatio="500"; }
        else if(val=="1280*720"){ BitRatio="2000"; }
        else{ BitRatio=""; }
        this.newWorkFormBitRate=BitRatio;
        //console.log(this.newWorkAttachmentList);
      }
    }
  }
  //Date Format OP
  Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "H+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  //Date Format ED

  //
  function IsInArray(arr,val){
    var testStr=','+arr.join(",")+",";
    return testStr.indexOf(","+val+",")!=-1;
  }
  //
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .work-form-show-card {
    background-color: #e4ecf9;
    margin-bottom: 20px;
  }
  .work-form-DealNew-card {
    background-color:#e9f4e5;
    margin-bottom: 20px;
  }
  .work-form-DealOld-card {
    background-color: #f4f4e5;
    margin-bottom: 20px;
  }
  .work-form-DealProject-card {
    background-color: #e4ecf9;
    margin-bottom: 20px;
  }
  .work-form-tips {
    color: #f56c6c;
    font-size: 10px;
  }

  .clear {
    clear: both;
  }

  .search-line {
    margin-top: 20px;
    border-bottom: solid 1px #ddd;
    width: 96%;
    margin-left: 2%;
  }

  .file-upload {
    display: block;
    width: 100px;
    height: 40px;
    opacity: 0;
    z-index: 100;
  }

  .file-upload-btn {
    margin-top: -40px !important;
    position: absolute;
  }

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

  .search-table-result {
    width: 60%;
    margin-left: 2%;
    margin-top: 20px;
    float: left;
    .el-table {
      margin-top: 20px;
    }
    .el-pagination {
      margin-top: 30px;
    }
  }

  .co-table-box {
    float: left;
    margin-left: 20px;
    margin-top: 20px;
    width: 35%;
  }

  .new-class-result {
    border-top: solid 1px #ccc;
    padding-top: 20px;
    margin-top: 20px;
  }

  .old-class-result {
    margin: 20px 0;
  }

  .center-box {
    text-align: center;
    margin-top: 20px;
  }

  .search-table-head {
    span {
      float: left;
    }
    div {
      float: right;
    }
  }

  .el-table {
    width: 100%;
  }

  .search-table-head {
    margin-bottom: 50px;
  }

  .myExcelResult h4 {
    margin: 30px 0 10px 0;
  }

  .myExcelResult h4:first-child {
    margin: 0 0 10px 0 !important;
  }

  .search-fail {
    color: red;
  }

  .el-row {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .new-course-config
  {
    margin-top: 0px;
    margin-bottom: 10px;
  }

  .class-table .iconfont:hover {
    cursor: pointer;
    color: #409EFF;
  }
</style>
