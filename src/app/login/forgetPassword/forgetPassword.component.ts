import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import * as $ from 'jquery';
import {publicService} from '../../publicService/publicService.component';

@Component({
  selector: 'forgetPassword-component',
  templateUrl: './forgetPassword.component.html',
  styleUrls: [
    './forgetPassword.component.less'
  ]
})

export class ForgetPasswordComponent implements OnInit {
  username: string = '';
  validateCode: string = '';
  newpassword: string = '';
  isPasswordTrue
  _isSpinning: boolean = false;
  isUserTrue
  error_msg: string = '';
  loginErrorText

  timeOutFlag: boolean = false;
  timeOut: number = 60;
  getValCodeBtnFlag: boolean = false;

  userflag: boolean = false;
  passflag: boolean = false;
  vcodeflag: boolean = false;

  usererror_msg: string = '';
  vcodeerror_msg: string = '';
  passerror_msg: string = '';
  showCode: any;
  userRep = /^1[0-9]{10}$/;


  // userRex: any = /^1[0-9]{10}$/;
  // passwordRex: any = /^[0-9A-Za-z!@#$%*_+=/?]{6-20}$/;
  checksub: boolean = false;
  constructor(
    private router: Router,
    private _message: NzMessageService,
    private service: publicService
  ) {}
  ngOnInit() {

  }

  getvalidateCode() {
    if (this.username === '' || !this.userRep.test(this.username)) {
      this._message.warning('请填写正确手机号');
      return;
    }
    this.getValCodeBtnFlag = true;
    this.timeOutFlag = true;
    const _this = this;
    this.getVCode();
    const timer = window.setInterval(function () {
      if (_this.timeOut > 0) {
        _this.timeOut--;
      } else {
        _this.getValCodeBtnFlag = false;
        _this.timeOutFlag = false;
        clearInterval(timer);
        _this.timeOut = 60;
      }
    }, 1000)
  }

  focusUser(type) {
    const passwordRep = /^[0-9A-Za-z!@#$%^&*()_/.,?=+]{6,20}$/;
    const user = this.username.replace(/ /g,'');
    const password = this.newpassword.replace(/ /g,'');
    const validateCode = this.validateCode.replace(/ /g,'');
    if (type === 'username') {
      if (!this.userRep.test(user)) {
        this._isSpinning = true;
        this.usererror_msg = '请确认手机号';
        this.userflag = false;
      } else {
        this.userflag = true;
        this.usererror_msg = '';
      }
    }

    if (type === 'validateCode') {
      // if (validateCode !== this.validateCode) {
      //   this._isSpinning = true;
      //   this.vcodeerror_msg = '验证码不正确';
      //   this.vcodeflag = false;
      // } else {
      //   this.vcodeflag = true;
      //   this.vcodeerror_msg = '';
      // }
      if (validateCode !== '') {
        this.vcodeflag = true;
      }
    }

    if (type === 'newpassword') {
      if (!passwordRep.test(password)) {
        this._isSpinning = true;
        this.passerror_msg = '请设置符合规范的密码';
        this.passflag = false;
      } else {
        this.passflag = true;
        this.passerror_msg = '';
      }
    }

    const msgTextArr = [this.usererror_msg, this.vcodeerror_msg, this.passerror_msg];
    var flag = true;
    for (let i in msgTextArr) {
      if (msgTextArr[i] !== '') {
        flag = false;
        this.error_msg = msgTextArr[i];
      }
    }
    if (flag) {
      this._isSpinning = false;
      this.error_msg = '';
    }
  }

  checkSub() {
    if (this.userflag && this.vcodeflag && this.passflag) {
      this._isSpinning = false;
      this.error_msg = '';
      return true
    }
  }

  submit() {
    const checksub = this.checkSub();
    const checkVcode = this.checkVCode();
    if (checksub && checkVcode) {
      this.service.postNewPassword(
        this.username,
        this.validateCode,
        this.newpassword
      ).subscribe(res => {
        if (res.error_code === 0) {
          this._message.success('重置成功!');
          this.router.navigate(['/login'])
        } else {
          this._message.warning(res.error_msg || '重置失败');
        }
      })
    }
  }

  // 获取验证码
  getVCode() {
    this.service.getValidateCode(this.username).subscribe(res => {
      console.log(res);
      if (res.error_code === 0) {
        this._message.success('验证码已发送到手机');
      } else {
        this._message.warning(res.error_msg || '请确认手机号');
      }
    })
  }

  checkVCode() {
    this.service.checkValidateCode(this.username, this.validateCode).subscribe(res => {
      console.log(res);
      if (res.error_code === 0) {
        return res.result || true;
      } else {
        this._message.warning(res.error_msg || '验证码有误');
        return false
      }
    })
  }
}
