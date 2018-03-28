import { Component, OnInit } from '@angular/core';
import {DataSettingService} from '../dataSettingService/dataSettingService';
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';

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

  academy_name: string = ''; // 学院名
  msg: string = '';
  constructor(
    private service: DataSettingService,
    private _message: NzMessageService,
    private router: Router
  ) {}
  ngOnInit() {
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
  }
}
