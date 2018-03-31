import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {SystemSetupService} from '../systemSetupService/systemSetup.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Subscription} from 'rxjs/Subscription'
@Component({
  selector: 'accountManagement-component',
  templateUrl: './accountManagement.component.html',
  styleUrls: [
    './accountManagement.component.less'
  ]
})

export class AccountManagementComponent implements OnInit {
  UserName: string = '';
  newUserPassword: string = '';
  repeatPassword: string = '';

  dataList = [];
  isShowTable: boolean = true;

  state: number;

  userPhone: string = '';
  firstPassword: string = '';
  lastPassword: string = '';
  radioState: string = 'start';
  selectedOption;
  newUserName
  uid
  stateSubscription: Subscription;

  page: 1;
  user_name: string;
  contact_phone: string;
  a_data_state;

  editId;
  editUsername;
  editState;


  options: any = [
    {
      label: '可用',
      value: 1,
      option: true,
      disabled: false
    },
    {
      label: '不可用',
      value: 2,
      option: false,
      disabled: false
    }
  ]
  isVisible = false;
  isEditVisible = false;

  constructor(
    private service: SystemSetupService,
    private _message: NzMessageService
  ) {}

  ngOnInit() {
    this.locdData();
  }

  locdData() {
    this.service.getListData(
      this.page,
      this.user_name,
      this.contact_phone,
      this.a_data_state
    )
    this.service.SystemListDataSubject.subscribe(res => {
      console.log(res);
      if (res.dataList === undefined) {
        return;
      }
      if (res.dataList.error_code === 0) {
        this.dataList = res.dataList.result;
      } else {
        this.dataList = [];
      }

      /*if (this.dataList.total_count === 0 || this.dataList.result.length < 1) {
        this.isShowTable = false;
      }else {
        this.isShowTable = true;
      }*/
    })
  }

  showModal = (username, uid) => {
    this.UserName = username;
    this.uid = uid;
    this.isVisible = true;
  }
  editShowModal(id, username, state) {
    this.isEditVisible = true;
    this.editId = id;
    this.editUsername = username;
    this.editState = state;
  }
  // 重置密码
  handleOk = (e) => {
    this.service.resetPassword(
      this.uid,
      this.newUserPassword,
      this.repeatPassword
    )
    this.service.SystemResetPasswordSubject.subscribe(res => {
        console.log(res);
    })
    console.log('点击了确定');
    this.isVisible = false;
  }

  // 切换帐号状态
  toggle(id, state) {
    this.state = state;
    this.state = this.state === 1 ? 2 : 1;
    console.log(state, this.state);
    this.service.toggleAccounts(id, this.state);
    this.stateSubscription = this.service.SystemListDataSubject.subscribe(res => {
      console.log(res);
      if (res.state === undefined) {
        return;
      }
      if (res.state.error_code === 0) {
        this.locdData();
        this.stateSubscription.unsubscribe();
      }
      // this.state = res.result.a_data_state;
    })
  }

  // 编辑
  editData() {
    this.service.userUpData(
      this.editId,
      this.editUsername,
      this.editState
    );
    this.service.SystemUpDataSubject.subscribe(res => {
       console.log(res);
       if (res.error_code === 0) {
         this._message.success('编辑完成');
       }
    })
  }

  handleCancel = (e) => {
    console.log(e);
    this.isVisible = false;
    this.isEditVisible = false;
  }
  _console() {
    // ..
  }
}
