import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {SystemSetupService} from '../systemSetupService/systemSetup.service';
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

  dataList = {};
  isShowTable: boolean = false;

  state: number;

  userPhone: string = '';
  firstPassword: string = '';
  lastPassword: string = '';
  radioState: string = 'start';
  selectedOption;


  _dataSet: any = [];
  options: any = [
    {
      label: '可用',
      option: true,
      disabled: false
    },
    {
      label: '不可用',
      option: false,
      disabled: false
    }
  ]
  isVisible = false;

  constructor(
    private service: SystemSetupService,
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
    const page = 1;
    const user_name = '小';
    const contact_phone = '18333608367';
    const a_data_state = 1;

    this.service.getListData(
      page,
      user_name,
      contact_phone,
      a_data_state
    )
    this.service.SystemListDataSubject.subscribe(res => {
        console.log(res);
        this.dataList = res;
        /*if (this.dataList.total_count === 0 || this.dataList.result.length < 1) {
          this.isShowTable = false;
        }else {
          this.isShowTable = true;
        }*/
    })
  }



  showModal = () => {
    this.isVisible = true;
  }
  // 重置密码
  handleOk = (username, uid) => {
    this.UserName = username;
    this.service.resetPassword(
      uid,
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
    this.service.toggleAccounts(id, this.state);
    this.service.SystemListDataSubject.subscribe(res => {
      console.log(res);
      // this.state = res.result.a_data_state;
    })
  }

  handleCancel = (e) => {
    console.log(e);
    this.isVisible = false;
  }
  _console() {
    // ..
  }
}
