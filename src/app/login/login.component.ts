import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiModule } from '../api/api';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'login-component',
    templateUrl: './login.component.html',
    styleUrls: [
        './login.component.less'
    ]
})

export class LoginComponent implements OnInit {
    _isSpinning: Boolean;
    isUserTrue = true;
    isPasswordTrue = true;
    errFlag: Boolean = true;
    isLogin: Boolean = true
    loginErrorText: String = '';
    userInfo = {
        username: '',
        password: ''
    }

    constructor (private router:Router,
                 private _message: NzMessageService
                ) {
    }

    ngOnInit() {

    }


    login () {
        this.checkLogin();
    }

    focusUser() {
        this.isUserTrue = true;
    }

    focusPass(){
        this.isPasswordTrue = true;
    }
    /*loginCheck() {
      this.checkLogin()
    }*/

    checkLogin() {
      const userRep = /^1[0-9]{10}$/;
      const passwordRep = /^[0-9A-Za-z!@#$%^&*()_/.,?=+]{6,20}$/;
      const user = this.userInfo.username;
      const password = this.userInfo.password;
      let flag = false;
      console.log(213);
      if (user && password) {
        if (userRep.test(user)) {
          this.isUserTrue = true;
        }else {
          this.isUserTrue = false;
          flag = true;
        }
        if (passwordRep.test(password)) {
          this.isPasswordTrue = true;
        } else {
          flag = true;
          this.isPasswordTrue = false;
        }
      } else {
        this.isLogin = false;
        flag = true;
      }

      if (!flag) {
        this.isLogin = false
        this._isSpinning = false;
        this.router.navigate(['index/waitPending'])
        this._message.success(`登录成功!`);
      }
    }
}
