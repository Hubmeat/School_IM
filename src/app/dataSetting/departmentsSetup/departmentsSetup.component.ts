import { Component, OnInit } from '@angular/core';
import {DataSettingService} from '../dataSettingService/dataSettingService';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription'

@Component({
  selector: 'departmentsSetup-component',
  templateUrl: './departmentsSetup.component.html',
  styleUrls: [
    './departmentsSetup.component.less'
  ]
})

export class DepartmentsSetupComponent implements OnInit {
  dataList = [];
  schoolName = '';
  isVisible = false;
  isVisible1= false;
  isEditVisible= false;

  page: number = 1;
  searchParam:string = '';
  editName: '';
  editId: string = ''
  api
  downLoading

  progressFlag: boolean = false;
  fileList: any = [];
  progressValue: number = 0;
  fileUid = '';

  academy_name: string = ''; // 学院名
  msg: string = '';
  uploadSubscription: Subscription;
  recordInfo: any = false;
  isShowResult: boolean = false;
  upload: any = {
    success: 0,
    defeat: 0
  };
  unique_identification: string = '';
  constructor(
    private service: DataSettingService,
    private _message: NzMessageService,
    private router: Router
  ) {
  }
  ngOnInit() {
    this.api = this.service.departmentsApi;
    this.search()
  }

  search() {
    this.service.getDepartmentsList(
      this.page,
      this.searchParam
    );
    this.service.DataSettingDepartmentsSubject.subscribe(res => {
      console.log(res);
      res = res.dataList
      if (res !== undefined && res.error_code === 0) {
        this.dataList = res.result;
      } else {
        this.dataList = [];
      }
    })
  }

  // 添加学院信息
  addDepartments() {
    console.log(this.academy_name);
    if (this.academy_name  === '') {
      this._message.warning(`学院名称为空!`);
      return;
    }
    const uid = window.localStorage.getItem('id');
    this.service.addDepartments(
      uid,
      this.academy_name
    );
    this.service.DataSettingDepartmentsSubject.subscribe(res => {
      console.log(res);
      if (res.addmsg === undefined) {
        return;
      }
      if (res.addmsg.error_code !== 0) {
        this.msg = res.addmsg.error_msg;
        this._message.success(this.msg || '添加失败');
      }else {
        this._message.success(`添加成功!`);
        this.isVisible = false;
        this.academy_name = '';
        this.search();
      }
    })
  }

  // 删除学院信息
  deleteDepartments(id) {
    this.service.deleteDepartments(
      id
    );
    this.service.DataSettingDepartmentsSubject.subscribe(res => {
      console.log(res);
      if (res.delmsg === undefined) {
        return;
      }
      if (res.delmsg.error_code !== 0) {
        this._message.warning('删除失败');
      } else {
        this._message.success('删除成功');
        this.search()
      }
    })
  }

  // 编辑学院信息
  editDepartments() {
    this.service.editDepartments(
      this.editId,
      this.editName
    )
    this.service.DataSettingDepartmentsSubject.subscribe(res => {
       console.log(res);
      if (res.editmsg === undefined) {
        return;
      }
      if (res.editmsg.error_code !== 0) {
        this._message.warning('编辑失败');
      } else {
        this._message.success('编辑成功');
        this.isEditVisible = false;
        this.search()
      }
    })
  }

  showEditModal(name, id) {
    this.msg = '';
    this.editName = name;
    this.editId = id;
    this.isEditVisible = true;
  }

  goMajor(id) {
    this.service.academy_id = id;
    this.router.navigate(['/index/specialty']);
  }

  deletecancel = () => {

  }
  showModal = () => {
    this.msg = '';
    this.isVisible = true;
  }
  showModal1 = () => {
    this.isVisible1 = true;
  }

  handleOk = (e) => {
    console.log('点击了确定');
    this.isVisible = false;
    this.isVisible1 = false;
  }

  handleCancel = (e) => {
    console.log(e);
    this.isVisible = false;
    this.isVisible1 = false;
    this.isEditVisible = false;
    this.isShowResult = false;
  }

  // 上传
  beforeUpload = (file: UploadFile): boolean => {
    console.log('file', file);
    this.fileList.push(file);
    console.log('fileList', this.fileList)
    this.fileUid = this.fileList[0].uid; // 文件唯一标识
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
    this.service.uploadacademyFileList(formData);
    this.uploadSubscription = this.service.DataSettingDepartmentsSubject.subscribe(res => {
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
            this.search()
            this.isShowResult = true;
          }, 1000)
          this.uploadSubscription.unsubscribe();
        }
      }, 50)
    })
  }

  getDownRecord() {
    $("#downloadform").remove();
    var form = $("<form>"); //定义一个form表单
    form.attr("id", "downloadform");
    form.attr("style", "display:none");
    form.attr("target", "");
    form.attr("method", "post");
    // form.attr("unique_identification", this.unique_identification);
    form.attr("action", this.service.departmentsRecordApiApi);
    var input1 = $("<input>");
    input1.attr("type", "hidden");
    input1.attr("name", "unique_identification");
    input1.attr("value", this.unique_identification);
    form.append(input1);
    $("body").append(form); //将表单放置在web中
    form.submit(); //表单提交
  }
}
