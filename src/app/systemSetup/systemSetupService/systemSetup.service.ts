import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiModule } from '../../api/api';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/retry';

@Injectable()

export class SystemSetupService {
    constructor(
      private $HOST: ApiModule,
      private $http: HttpClient
    ) {

    }

    // 创建新用户
    public SystemAddNewUserSubject = new Subject<any>();
    public addNewUser(contact_phone, password, user_name, state) {
      const formData = {
        contact_phone: contact_phone,
        password: password,
        user_name: user_name,
        a_data_state: state
      }
      this.$http
        .post(this.$HOST.host + '/a/user/new', formData)
        .subscribe(res => {
          this.SystemAddNewUserSubject.next({addUser: res});
        })
    }

    // 重置
    public SystemResetPasswordSubject = new Subject<any>();
    public resetPassword(uid, new_password) {
      const formData = {
        uid: uid,
        new_password: new_password
      }
      this.$http
        .post(this.$HOST.host + '/a/user/reset_password', formData)
        .subscribe(res => {
            this.SystemResetPasswordSubject.next({editpassword: res});
        })
    }


    public SystemListDataSubject = new Subject<any>()
    // 获取list
    public getListData(page, user_name, contact_phone, a_data_state) {
        const formData = {
          page: page,
          user_name: user_name,
          contact_phone: contact_phone,
          a_data_state: a_data_state
        }
        this.$http
          .post(this.$HOST.host + '/a/user/adminlist', formData)
          .subscribe(res => {
             this.SystemListDataSubject.next({dataList: res})
          })
    }

    // 切换帐号状态
    public toggleAccounts(id, state) {
      const formData = {
        id: id,
        a_data_state: state
      }
      this.$http
        .post(this.$HOST.host + '/a/user_state/change', formData)
        .subscribe(res => {
          this.SystemListDataSubject.next({state: res})
        })
    }

    public editData: any = {
      id: null,
      username: null,
      state: null,
      contact_phone: null
    }
    public editFlag = false;
    public SystemUpDataSubject = new Subject<any>();
    // 编辑
    public userUpData(id, username, state, contact_phone) {
      const formData = {
        id: id,
        user_name: username,
        a_data_state: state,
        contact_phone: contact_phone
      };
      this.$http
        .post(this.$HOST.host + '/a/user/adminupdate', formData)
        .subscribe(res => {
          this.SystemListDataSubject.next(res);
        })
    }

}
