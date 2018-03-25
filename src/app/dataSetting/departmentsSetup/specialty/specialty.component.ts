import { Component, OnInit } from '@angular/core';
import {DataSettingService} from '../../dataSettingService/dataSettingService';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'specialty-component',
  templateUrl: './specialty.component.html',
  styleUrls: [
    './specialty.component.less'
  ]
})

export class SpecialtyComponent implements OnInit {
  _dataSet = [];
  schoolName = '';
  isVisible = false;
  isVisible1= false;
  isEditVisible= false;
  page: 1;
  searchParam: '';
  editName: '';

  academy_name: string = ''; // 学院名
  msg: string = '';
  constructor(
    private service: DataSettingService,
    private _message: NzMessageService,
  ) {}
  ngOnInit() {
    for (let i = 0; i < 46; i++) {
      this._dataSet.push({
        key    : i,
        name   : `Edward King ${i}`,
        age    : 32,
        address: `London, Park Lane no. ${i}`,
      });
    }

    // this.search()
  }

  search() {
    this.service.getDepartmentsList(
      this.page,
      this.searchParam
    );
    this.service.DataSettingDepartmentsSubject.subscribe(res => {
      console.log(res);
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
      if (res.addmsg.error_code !== 0) {
        this.msg = res.addmsg.error_msg;
        this._message.success(this.msg || '添加失败');
      }else {
        this._message.success(`添加成功!`);
        this.isVisible = false;
      }
    })
  }

  // 删除学院信息
  deleteDepartments(id) {
    console.log('123213')
    this.service.deleteDepartments(
      id
    );
    this.service.DataSettingDepartmentsSubject.subscribe(res => {
      console.log(res);
      if (res.delmsg.error_code !== 0) {
        this._message.warning('删除失败');
      } else {
        this._message.success('删除成功');
      }
    })
  }

  // 编辑学院信息
  editDepartments(id, name) {
    this.service.editDepartments(
      id,
      name
    )
    this.service.DataSettingDepartmentsSubject.subscribe(res => {
      console.log(res);
      if (res.editmsg.error_code !== 0) {
        this._message.warning('编辑失败');
      } else {
        this._message.success('编辑成功');
        this.isEditVisible = false;
      }
    })
  }

  showEditModal(name) {
    this.msg = '';
    this.editName = name;
    this.isEditVisible = true;
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
