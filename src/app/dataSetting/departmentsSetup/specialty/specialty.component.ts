import { Component, OnInit } from '@angular/core';
import {DataSettingService} from '../../dataSettingService/dataSettingService';
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';

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
  isVisible = false;
  isVisible1= false;
  isEditVisible= false;
  page: 1;
  searchParam: '';

  addMajorName: string = ''; // 学院名
  editMajorName: string = '';
  editId;
  msg: string = '';
  fileList
  constructor(
    private service: DataSettingService,
    private router: Router,
    private _message: NzMessageService,
  ) {}
  ngOnInit() {
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
      this.searchParam,
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
         this.isVisible = false;
         this.isVisible1 = false;
         this.search()
       } else {
         this._message.warning('添加失败');
       }
    })
    this.isVisible = false;
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
  showModal = (major_name, id) => {
    this.msg = '';
    this.editMajorName = major_name;
    this.editId = id;
    this.isEditVisible = true;
  }
  showModal1 = () => {
    this.isVisible1 = true;
  }
  showModal2 = () => {}

  handleCancel = (e) => {
    console.log(e);
    this.isVisible = false;
    this.isVisible1 = false;
    this.isEditVisible = false;
  }
  cancel = () => {

  }
}