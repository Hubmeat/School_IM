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
          // contact_phone: contact_phone,
          'contact_phone': '18333608300',
          // password: password
          'password': '123456'
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


    //  退出的方法
    public signOut ():void {
        // ajax
        console.log('this signOut', this)
        this.LoginSubject = new Subject<any>();
    }
}






