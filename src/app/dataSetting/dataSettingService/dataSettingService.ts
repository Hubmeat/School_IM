
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
   * 学院信息
   */
  public DataSettingDepartmentsSubject = new Subject<any>();
    // 搜索/查询list
    public getDepartmentsList(page, searchParam) {
      const formData = {
        page: page,
        searchParam: searchParam
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
        uid: uid,
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
        id: id
      };
      this.$http
        .post(this.$HOST.host + '/a/academy/remove', formData)
        .subscribe(res => {
          this.DataSettingDepartmentsSubject.next({delmsg: res})
        })
    }

    // 编辑学院信息
    public editDepartments(id, name) {
      const formData = {
        id: id,
        academy_name: name
      }
      this.$http
        .post(this.$HOST.host + '/a/academy/update', formData)
        .subscribe(res => {
          this.DataSettingDepartmentsSubject.next({editmsg: res})
        })
    }

    // 查看学院详情
    public detailsDepartments(id) {
      const formData = {
        id: id
      }
      this.$http
        .post(this.$HOST.host + '/a/academy/detail', formData)
        .subscribe(res => {
          this.DataSettingDepartmentsSubject.next({detail: res})
        })
    }

    // 查看专业列表
    public examineOptions() {
      this.$http
        .post(this.$HOST.host + '/a/academy_major/list', '')
        .subscribe(res => {
          this.DataSettingDepartmentsSubject.next({options: res});
        })
    }

  /**
   * 专业信息
   */
  public  SpecialtySetupSubject = new Subject<any>();

    // 专业新增
    public addSpecialty(uid, major_name, academy_id) {
      const formData = {
        uid: uid,
        major_name: major_name,
        academy_id: academy_id
      }
      this.$http
        .post(this.$HOST.host + '/a/major/new', formData)
        .subscribe(res => {
          this.SpecialtySetupSubject.next({addmsg: res})
        })
    }

    // 专业详情
    public detailsSpecialty(id) {
      const formData = {
        id: id
      }
      this.$http
        .post(this.$HOST.host + '/a/major/detail', formData)
        .subscribe(res => {
          this.SpecialtySetupSubject.next({detaile: res})
        })
    }

    // 专业编辑
    public editSpecialty(id, major_name) {
      const formData = {
        id: id,
        major_name: major_name
      }
      this.$http
        .post(this.$HOST.host + '/a/major/update', formData)
        .subscribe(res => {
          this.SpecialtySetupSubject.next({editmsg: res})
        })
    }

    // 专业删除
    public deleteSpecialty(id) {
      const formData = {
        id: id
      }
      this.$http
        .post(this.$HOST.host + '/a/major/remove', formData)
        .subscribe(res => {
          this.SpecialtySetupSubject.next({delmsg: res})
        })
    }

    // 专业列表
    public getSpecialtyList(page, searchParam) {
      const formData = {
        page: page,
        searchParam: searchParam
      }
      this.$http
        .post(this.$HOST.host + '/a/major/list', formData)
        .subscribe(res => {
          this.SpecialtySetupSubject.next({dataList: res})
        })
    }


  /**
   * 行业信息
   */
  public IndustrySetupSubject = new Subject<any>();

    // 行业新增
    public addIndustry(uid, industry_name) {
      const formData = {
        uid: uid,
        industry_name: industry_name
      }
      this.$http
        .post(this.$HOST.host + '/a/industry/new', formData)
        .subscribe(res => {
          this.IndustrySetupSubject.next({addmsg: res})
        })
    }

    // 行业详情
    public detailsIndustry(id) {
      const formData = {
        id: id
      }
      this.$http
        .post(this.$HOST.host + '/a/industry/detail', formData)
        .subscribe(res => {
          this.IndustrySetupSubject.next({detaile: res})
        })
    }

    // 行业编辑
    public editIndustry(uid, industry_name) {
      const formData = {
        id: uid,
        industry_name: industry_name
      }
      this.$http
        .post(this.$HOST.host + '/a/industry/update', formData)
        .subscribe(res => {
          this.IndustrySetupSubject.next({editmsg: res})
        })
    }

    // 行业删除
    public deleteIndustry(id) {
      const formData = {
        id: id
      }
      this.$http
        .post(this.$HOST.host + '/a/industry/remove', formData)
        .subscribe(res => {
          this.IndustrySetupSubject.next({delmsg: res})
        })
    }

    // 行业列表
    public getIndustryList(page, searchParam) {
      const formData = {
        page: page,
        searchParam: searchParam
      }
      this.$http
        .post(this.$HOST.host + '/a/industry/list', formData)
        .subscribe(res => {
          this.IndustrySetupSubject.next({dataList: res})
        })
    }

}
