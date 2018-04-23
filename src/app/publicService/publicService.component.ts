import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiModule } from '../api/api';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/retry';

@Injectable()

export class publicService {
    status: boolean = false;
    alumniManagementListOpen: boolean = true;
    contactAdminOpen: boolean;
    noticeAdministrationOpen: boolean;
    liveAdministrationOpen: boolean;
    dataSettingOpen: boolean;
    systemSetupOpen: boolean;


    constructor (
        private $http: HttpClient,
        private $HOST: ApiModule) {}


    // 登录的方法
    public LoginSubject = new Subject<any>();

    public getUserInfo(contact_phone, password) {

        const data = {
          contact_phone: contact_phone,
          // 'contact_phone': '18333608300',
          password: password
          // 'password': '123456'
        };
        const val = this.$HOST.host;
        this.$http
            .post(`${val}/a/user/login`, data)
            .retry(3)
            .subscribe(
              res => {
                this.LoginSubject.next(res)
            },
              err => {
                this.LoginSubject.next(err)
              });
    }

    // 忘记密码

    public PassWordForgetSubject = new Subject<any>();

    public postNewPassword(account_number, captcha, new_password): any {
      const formData = {
        account_number: account_number,
        captcha: captcha,
        new_password: new_password
      }
      return this.$http
        .post(this.$HOST.host + '/a/user/forget_password', formData);
    }


    //  退出的方法
    public signOut ():void {
        // ajax
        console.log('this signOut', this)
        this.LoginSubject = new Subject<any>();
    }

    public EditPasswordSubject = new Subject<any>();

    public editPassword(uid, old_password, new_password) {
      const formData = {
        uid: uid,
        old_password: old_password,
        new_password: new_password,
      }
      this.$http
        .post(this.$HOST.host + '/a/user/change_password', formData)
        .subscribe(res => {
          this.EditPasswordSubject.next(res);
        })
    }
}






