import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {SystemSetupService} from '../../systemSetupService/systemSetup.service';



@Component({
  selector: ' addNewUser-component',
  templateUrl: './addNewUser.component.html',
  styleUrls: [
    './addNewUser.component.less'
  ]
})

export class AddNewUserComponent implements OnInit  {
  UserName: string = '';
  UserPhone: string = '';
  initPassword: string = '';
  confirmPassword: string = '';
  radioValue: number;
  msg: string;

  constructor(
    private router: Router,
    private _message: NzMessageService,
    private servive: SystemSetupService
  ) {

  }
  ngOnInit() {
    this.radioValue = 1; // 默认帐号状态 ‘可用’
  }
  goback(): void {
    this.router.navigate(['/index/accountManagement'])
  }
  previewSubmit(): void {
    const phoneTest = /^1[0-9]{10}$/;
    const initPasswordTest = /^[a-zA-Z0-9!@#$%^&*(),.?/]{6,20}$/;
    console.log('213131')
    let flag = false;
    if (this.UserPhone === '' ||
        this.initPassword === '' ||
        this.UserName === '' ||
        this.confirmPassword === '')
    {
      this.msg = '请填写完整信息';
      return;
    } else {
      if (!phoneTest.test(this.UserPhone)) {
        this.msg = '请输入正确11位手机号';
        return
      }
      if (!initPasswordTest.test(this.initPassword)) {
        this.msg = '请输入合法密码';
        return
      }

      if (this.initPassword !== this.confirmPassword) {
        this.msg = '确认密码与密码不符';
        return
      }
      flag = true;
    }

    if (flag) {
      this.msg = '';
      this.servive.addNewUser(
        this.UserPhone,
        this.initPassword,
        this.UserName,
        this.radioValue
      )
      this.servive.SystemAddNewUserSubject.subscribe(res => {
        console.log(res);
      })
      this.router.navigate(['/index/accountManagement'])
      this._message.success(`创建成功!`);
    }
  }
}
