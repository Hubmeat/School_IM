import { Component, OnInit } from '@angular/core';
import {DataSettingService} from '../../dataSettingService/dataSettingService';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'specialty-component',
  templateUrl: './specialty.component.html',
  styleUrls: [
    './specialty.component.less'
  ]
})

export class SpecialtyComponent implements OnInit {
  dataList = [];
  majorName = '';
  isAddVisible = false;
  isVisible1= false;
  isEditVisible= false;
  page: 1;

  addMajorName: string = ''; // 学院名
  editMajorName: string = '';
  editId;
  msg: string = '';
  fileList = [];
  progressFlag: boolean = false;
  progressValue: number = 0;
  api
  downLoading

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
    private router: Router,
    private _message: NzMessageService,
  ) {}
  ngOnInit() {
    this.api = this.service.specialtyApi;
    if (this.service.academy_id === '') {
      this.goback();
    }

    this.search()
  }

  // 搜索/获取list
  search() {
    const academy_id = this.service.academy_id;
    this.service.getSpecialtyList(
      this.page,
      this.majorName,
      academy_id
    );
    this.service.SpecialtySetupSubject.subscribe(res => {
      console.log(res);
      if (res.dataList === undefined) {
        return;
      }
      if (res.dataList.error_code === 0) {
        this.dataList = res.dataList.result;
      }
    })
  }
  // 添加专业
  addmajor = (e) => {
    const uid = window.localStorage.getItem('uid');
    const academy_id = this.service.academy_id;
    this.service.addSpecialty(
      uid,
      this.addMajorName,
      academy_id
    )
    this.service.SpecialtySetupSubject.subscribe(res => {
       if (res.addmsg === undefined) {
         return;
       }
       if (res.addmsg.error_code === 0) {
         this._message.success('添加成功');
         this.isAddVisible = false;
         this.isVisible1 = false;
         this.search()
       } else {
         this._message.warning('添加失败');
       }
    })
    this.isAddVisible = false;
    this.isVisible1 = false;
  }

  // 删除专业
  deleteconfirm(id) {
    this.service.deleteSpecialty(
      id
    )
    this.service.SpecialtySetupSubject.subscribe(res => {
      console.log(res);
      if (res.delmsg === undefined) {
        return;
      }
      if (res.delmsg.error_code === 0) {
        this._message.success('删除成功');
        this.search()
      } else {
        this._message.warning('删除失败');
      }
    })
  }

  // 编辑专业
  editMajor() {
    const id = this.editId;
    const major_name = this.editMajorName;
    this.service.editSpecialty(
      id,
      major_name
    )
    this.service.SpecialtySetupSubject.subscribe(res => {
      console.log(res);
      if (res.editmsg === undefined) {
        return;
      }
      if (res.editmsg.error_code === 0) {
        this._message.success('修改成功');
        this.isEditVisible = false;
        this.search();
      } else {
        this._message.warning('修改失败 ');
      }
    })
  }
  goback() {
    this.router.navigate(['/index/departmentsSetup']);
  }
  editshowModal = (major_name, id) => {
    this.msg = '';
    this.editMajorName = major_name;
    this.editId = id;
    this.isEditVisible = true;
  }
  showModal1 = () => {
    this.isVisible1 = true;
  }
  addshowModal = () => {
    this.isAddVisible = true;
    this.addMajorName = '';
  }

  handleCancel = (e) => {
    console.log(e);
    this.isAddVisible = false;
    this.isVisible1 = false;
    this.isEditVisible = false;
    this.isShowResult = false;
  }
  cancel = () => {

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
    this.service.uploadmajorFileList(formData);
    this.uploadSubscription = this.service.SpecialtySetupSubject.subscribe(res => {
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
          }, 1500)
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
    form.attr("unique_identification", this.unique_identification);
    form.attr("action", this.service.specialtyRecordApiApi);
    var input1 = $("<input>");
    input1.attr("type", "hidden");
    input1.attr("name", "fileName");
    input1.attr("value", "threeBody.txt");
    form.append(input1);
    $("body").append(form); //将表单放置在web中
    form.submit(); //表单提交
  }
}
