import { Component, OnInit } from '@angular/core';
import {DataSettingService} from '../dataSettingService/dataSettingService';
import {NzMessageService} from 'ng-zorro-antd';

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
  industry_name: string;
  addindustry_name: string;
  editindustry_name: string;
  id: ''; // 记录当前选中id
  dataList = [];

  fileList = [];
  beforeUpload;
  progressFlag;
  progressValue:number = 0;
  uploadVisible;
  downLoading = false;

  constructor(
    private service: DataSettingService,
    private _message: NzMessageService
  ) {}
  ngOnInit() {
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
    this.service.downTemplate()
    this.service.IndustrySetupSubject.subscribe(res => {
      // console.log(res);
    })
  }
  // 上传
  UploadSubmit() {
    const formData = new FormData();
    this.progressFlag = true;
    this.fileList.forEach((file: any) => {
      console.log('file', file);
      this.service.uploadFileList(this.fileList[0].uid, this.uid, this.fileList[0]);
      var timer = setInterval( () => {
        this.progressValue += 5;
        if (this.progressValue >= 100) {
          this.service.IndustrySetupSubject.subscribe(res => {
            console.log(res);
              if (res.error_code) {

              }
            }
          )
          this.progressFlag = false;
          this.progressValue = 0;
          clearInterval(timer);
          this._message.success('上传成功！')
          this.fileList = [];
          setTimeout( () => {
            this.isVisible1 = false;
          }, 1500)
        }
      }, 50)
      formData.append('files[]', file);
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.isVisible = false;
    this.isVisible1 = false;
    this.editVisible = false;
  }
  handleOk = (e) => {

  }
}
