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
          this.SystemAddNewUserSubject.next(res);
        })
    }

    // 重置/修改密码
    public SystemResetPasswordSubject = new Subject<any>();
    public resetPassword(uid, old_password, new_password) {
      const formData = {
        uid: 1705835349737499,
        old_password: old_password,
        new_password: new_password
      }
      this.$http
        .post(this.$HOST.host + '/a/user/reset_password', formData)
        .subscribe(res => {
            this.SystemResetPasswordSubject.next(res);
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
             this.SystemListDataSubject.next(res)
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


}
