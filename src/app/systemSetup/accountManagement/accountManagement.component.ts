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

  page = 1;
  user_name = '';
  contact_phone = '';
  a_data_state = '';

  stateSubscription: Subscription;
  editPassWordSubscription: Subscription;
  dataList = {};
  isShowTable: boolean = true;

  state: number;

  userPhone: string = '';
  firstPassword: string = '';
  lastPassword: string = '';
  radioState: string = 'start';
  selectedOption;
  newUserName
  uid


  _dataSet: any = [];
  options: any = [
    {
      label: '全部',
      option: false,
      a_data_state: '',
      disabled: false
    },
    {
      label: '可用',
      option: true,
      a_data_state: 1,
      disabled: false
    },
    {
      label: '不可用',
      option: false,
      a_data_state: 2,
      disabled: false
    }
  ]
  isVisible = false;

  constructor(
    private service: SystemSetupService,
    private _message: NzMessageService
  ) {}

  ngOnInit() {
    this.loadData()
  }
  loadData() {
    this.service.getListData(
      this.page,
      this.user_name,
      this.contact_phone,
      this.selectedOption
    )
    this.service.SystemListDataSubject.subscribe(res => {
      console.log(res);
      if (res.dataList === undefined) {
        return;
      }
      if (res.dataList.error_code === 0) {
        this._dataSet = res.dataList.result;
        if (this._dataSet.length < 1) {
          this.isShowTable = false;
        }
      }
    })
  }


  showModal = (username, uid) => {
    this.UserName = username;
    this.uid = uid;
    this.isVisible = true;

  }
  // 重置密码
  handleOk = () => {
    if (this.newUserPassword === '' || this.newUserPassword === '') {
      this._message.warning('密码不能为空');
    }
    if (this.newUserPassword === this.repeatPassword) {
      this._message.warning('新旧密码重复');
      return;
    }
    this.service.resetPassword(
      this.uid,
      this.newUserPassword,
      this.repeatPassword
    )
    this.editPassWordSubscription = this.service.SystemResetPasswordSubject.subscribe(res => {
        if (res.editpassword === undefined) {
          return;
        }
        if (res.editpassword.error_code === 0) {
          this._message.success('修改成功');
          this.isVisible = false;
          this.editPassWordSubscription.unsubscribe();
        }else {
          this._message.warning(res.editpassword.error_msg);
          this.editPassWordSubscription.unsubscribe();
        }
    })
  }

  // 切换帐号状态
  toggle(id, state) {
    this.state = state === 1 ? 2 : 1;
    this.service.toggleAccounts(id, this.state);
    this.stateSubscription = this.service.SystemListDataSubject.subscribe(res => {
      console.log(res);
      if (res.state === undefined) {
        return;
      }
      if (res.state.error_code === 0) {
        this.stateSubscription.unsubscribe();
        this.loadData()
      }
    })
  }

  // 编辑
  editData(id, username, state) {
    this.service.userUpData(
      id,
      username,
      state
    )
    this.service.SystemUpDataSubject.subscribe(res => {
       console.log(res);
       if (res.error_code === 0) {
         this._message.success('编辑完成');
       }
    })
  }

  pageChange(page) {
    console.log(page)
    this.page = page;
    this.loadData();
  }

  handleCancel = (e) => {
    console.log(e);
    this.isVisible = false;
  }
  _console() {
    // ..
  }
}
