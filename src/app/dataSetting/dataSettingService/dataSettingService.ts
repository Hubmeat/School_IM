
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/retry';
import {ApiModule} from '../../api/api';

@Injectable()

export class DataSettingService {
    constructor(
      private $HOST: ApiModule,
      private $http: HttpClient
    ) {}

  /**
   *学院信息
   */
  public DataSettingDepartmentsSubject = new Subject<any>();
    // 搜索/查询list
    public getDepartmentsList(page, searchParam) {
      const formData = {
        page: 1,
        searchParam: '电'
      }
      this.$http
        .post(this.$HOST.host + '/a/academy/list', formData)
        .subscribe(res => {
          this.DataSettingDepartmentsSubject.next({'dataList': res})
        })
    }

    // 添加学院信息
    public addDepartments(uid, academy_name) {
      const formData = {
        uid: 1646334584094728,
        academy_name: academy_name
      }
      this.$http
        .post(this.$HOST.host + '/a/academy/new', formData)
        .subscribe(res => {
          this.DataSettingDepartmentsSubject.next({addmsg: res})
        })
    }

    // 删除学院信息
    public deleteDepartments(id) {
      const formData = {
        id: 123131
      };
      this.$http
        .post(this.$HOST.host + '/a/academy/remove', formData)
        .subscribe(res => {
          this.DataSettingDepartmentsSubject.next({delmsg: res})
        })
    }
}
