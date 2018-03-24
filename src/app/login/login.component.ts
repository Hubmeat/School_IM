import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiModule } from '../api/api';
import {NzMessageService} from 'ng-zorro-antd';
import {publicService} from '../publicService/publicService.component';
import {Subject} from 'rxjs/Subject';

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
    error_msg: String = '';
    userInfo = {
        username: '',
        password: ''
    }
    subject = Subject;

    constructor (private router: Router,
                 private _message: NzMessageService,
                 private service: publicService
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
      const user = this.userInfo.username.replace(/ /g,'');
      const password = this.userInfo.password.replace(/ /g,'');
      let flag = false;
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
        this.isUserTrue = false;
        this.isLogin = false;
        this.error_msg = '帐号或密码不能为空';
        flag = true;
      }

      if (!flag) {
        this.isLogin = false
        this._isSpinning = false;
        this.service.getUserInfo(
          this.userInfo.username,
          this.userInfo.password
        );
        this.service.LoginSubject.subscribe( 
          res => {
              console.log(res);
              if (res.error_code === 0) {
                this.router.navigate(['index/waitPending'])
                this._message.success(`登录成功!`);
              } else {
                this.error_msg = res.error_msg;
                this.isUserTrue = false;
              }
          })


      }
    }
}
