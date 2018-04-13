import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {SystemSetupService} from '../../systemSetupService/systemSetup.service';
import {Subscription} from 'rxjs/Subscription';


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
  editId;
  editState;
  editFlag: boolean = false;
  radioValue: number;
  msg: string;
  addSubscription: Subscription;
  editSubscription: Subscription;

  constructor(
    private router: Router,
    private _message: NzMessageService,
    private service: SystemSetupService
  ) {

  }
  ngOnInit() {
    this.radioValue = 1; // 默认帐号状态 ‘可用’
    if (this.service.editFlag) {
      this.editFlag = this.service.editFlag;
      this.UserName = this.service.editData.username;
      this.UserPhone = this.service.editData.contact_phone;
      this.editId = this.service.editData.id;
      this.radioValue = this.service.editData.state;
    }
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
      this.service.addNewUser(
        this.UserPhone,
        this.initPassword,
        this.UserName,
        this.radioValue
      )
      this.addSubscription = this.service.SystemAddNewUserSubject.subscribe(res => {
        console.log(res);
        if (res.addUser === undefined) {
          return;
        }
        if (res.addUser.error_code === 0) {
          this._message.success(`创建成功!`);
          this.addSubscription.unsubscribe();
          this.router.navigate(['/index/accountManagement'])
        } else {
          this._message.warning(res.addUser.error_msg);
          this.addSubscription.unsubscribe();
        }
      })
    }
  }

  editData() {
    this.service.userUpData(
      this.editId,
      this.UserName,
      this.radioValue
    )
    this.editSubscription = this.service.SystemUpDataSubject.subscribe(res => {
      console.log(res);
      if (res.error_code === 0) {
        this._message.success('编辑完成');
      }
      this.editSubscription.unsubscribe();
    })
  }
}
