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
        private HOST: ApiModule) {}

    // 事件案例分析模块，总览数据
    overViewData:any = []

    // 用户信息
    userInfo = {
        uid :'123',
        username :'1111',
        email: ''
    }

    // 产品名称
    productName:any = '';

    // 登录的方法
    public LoginSubject = new Subject<any>();

    public getUserInfo(name, pwd):void {

        var data = {"username":name,"password":pwd};
        var val = this.HOST.host;
        this.$http
            .post(`${val}/login`, data)
            .retry(3)
            .subscribe( res => {
                this.LoginSubject.next(res)
            });
    }


    //  退出的方法
    public signOut ():void {
        // ajax
        console.log('this signOut', this)
        this.LoginSubject = new Subject<any>();
    }
}






