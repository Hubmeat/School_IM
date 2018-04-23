import { Component, OnInit } from '@angular/core';
import {DataSettingService} from '../dataSettingService/dataSettingService';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'industrySetup-component',
  templateUrl: './industrySetup.component.html',
  styleUrls: [
    './industrySetup.component.less'
  ]
})

export class IndustrySetupComponent implements OnInit {
  _dataSet = [];
  isVisible = false;
  isVisible1= false;
  editVisible = false;
  uid = '';
  page = 1 ;
  totalPage = 0;
  industry_name: string;
  addindustry_name: string;
  editindustry_name: string;
  id: ''; // 记录当前选中id
  dataList = [];

  fileList = [];
  // beforeUpload;
  progressFlag;
  progressValue:number = 0;
  uploadVisible;
  downLoading = false;
  api

  uploadSubscription: Subscription;
  recordInfo: any = false;
  isShowResult: boolean = false;
  upload: any = {
    success: 0,
    defeat: 0
  };
  unique_identification: string = ''; // 上传数据唯一标识
  downRecordInfoApi: any; // 下载记录地址

  constructor(
    private service: DataSettingService,
    private _message: NzMessageService
  ) {}
  ngOnInit() {
    this.api = this.service.industryApi;
    this.uid = window.localStorage.getItem('uid');
    this.getDataList()
  }

  getDataList() {
    console.log('获取list');
    this.service.getIndustryList(
      this.page,
      this.industry_name
    )
    this.service.IndustrySetupSubject.subscribe(res => {
      console.log(res);
      res = res.dataList;
      if (res !== undefined && res.error_code === 0) {
        this.dataList = res.result;
        this.totalPage = res.total_count;
        // this.service.IndustrySetupSubject.unsubscribe();
      } else {
        this.dataList = [];
      }
    })
  }

  addModal = () => {
    this.isVisible = true;
    this.addindustry_name = '';
  }
  addIndustry = () => {
    this.service.addIndustry(
      this.uid,
      this.addindustry_name
    )
    this.service.IndustrySetupSubject.subscribe(res => {
      console.log(res);
      if (res.addmsg === undefined) {
        return;
      }
      if (res !== undefined && res.addmsg.error_code === 0) {
        this._message.success('添加成功');
        this.addindustry_name = '';
        this.isVisible = false;
        this.getDataList();
      } else {
        this._message.warning(res.error_msg || '添加失败');
      }
    })
    this.isVisible1 = false;
  };

  editModal = (id, editName) => {
    this.editVisible = true;
    console.log(id, editName);
    this.id = id;
    this.editindustry_name = editName;
  }
  editIndustry() {
    this.service.editIndustry(
      this.id,
      this.editindustry_name
    )
    this.service.IndustrySetupSubject.subscribe(res => {
      console.log(res);
      if (res.editmsg === undefined) {
        return;
      }
      res = res.editmsg;
      if (res !== undefined && res.error_code === 0) {
        this._message.success('更改成功');
        this.editVisible = false;
        this.getDataList()
      }else {
        this._message.warning(res.error_msg !== undefined ? res.error_msg : '更改失败');
      }
    })
  }

  deleteConfirm(id) {
    this.id = id;
    this.service.deleteIndustry(
      this.id
    )
    this.service.IndustrySetupSubject.subscribe(res => {
      console.log(res);
      if (res.delmsg === undefined) {
        return;
      }
      res = res.delmsg;
      if (res !== undefined && res.error_code === 0) {
        this._message.success('更改成功');
        this.editVisible = false;
        this.getDataList()
      }else {
        this._message.warning('更改失败');
      }
    })
  }
  deletecancel() {

  }
  showModal1 = () => {
    this.isVisible1 = true;
  }
  // 下载
  downloadTemplate() {
    // this.service.downTemplate()

  }
  // 上传
  beforeUpload = (file: UploadFile): boolean => {
    console.log('file', file);
    this.fileList.push(file);
    console.log('fileList', this.fileList)
    return false;
  }

  UploadSubmit() {
    const formData = new FormData();
    this.progressFlag = true;
    this.fileList.forEach((file: any) => {
      formData.append('unique_identification', file.uid);
      formData.append('header_index', '1');
      formData.append('file', file);
      this.unique_identification = file.uid;
    });
    console.log('formData', formData)
    this.service.uploadFileList(formData);
    this.uploadSubscription = this.service.IndustrySetupSubject.subscribe(res => {
      var timer = setInterval( () => {
        this.progressValue += 5;
        if (this.progressValue >= 100) {
          clearInterval(timer);
          if (res.updata && res.updata.error_code === 0) {
            this.upload = res.updata.return;
            this._message.success('上传成功！')
          }
          this.progressFlag = false;
          this.progressValue = 0;
          this.fileList = [];
          setTimeout( () => {
            this.isVisible1 = false;
            this.getDataList()
            this.isShowResult = true;
          }, 1500)
          this.uploadSubscription.unsubscribe();
        }
      }, 50)
    })
  }

  handleCancel = (e) => {
    console.log(e);
    this.isVisible = false;
    this.isVisible1 = false;
    this.editVisible = false;
    this.isShowResult = false;
  }
  handleOk = (e) => {

  }

  getDownRecord() {
      $("#downloadform").remove();
      var form = $("<form>"); //定义一个form表单
      form.attr("id", "downloadform");
      form.attr("style", "display:none");
      form.attr("target", "");
      form.attr("method", "post");
      // form.attr("unique_identification", this.unique_identification);
      form.attr("action", this.service.industryRecordApiApi);
      var input1 = $("<input>");
      input1.attr("type", "hidden");
      input1.attr("name", "unique_identification");
      input1.attr("value", this.unique_identification);
      form.append(input1);
      $("body").append(form); //将表单放置在web中
      form.submit(); //表单提交
  }
}
