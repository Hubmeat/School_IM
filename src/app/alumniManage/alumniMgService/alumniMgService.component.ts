
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiModule } from '../../api/api';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/retry';
import * as moment from 'moment';

@Injectable()

export class AMService {    
    constructor (
        private $HOST: ApiModule,
        private $http: HttpClient
    ) {
        
    }

    /**
     * 校友管理模块
     */


    // 校友管理待审核subject
    public WaitPendingSubject = new Subject<any>();

    public getPendingData(
        list_type, 
        majorSelected,
        educationSelected,
        collegeSelected,
        registerBeginTime,
        registeEndrTime,
        joinBeginTime,
        joinEndrTime,
        userName,
        IDcard,
        phone,
        currentPage,
        auditStatusSelected
    ):void {
        var formData = {
            "list_type": list_type,
            "education": educationSelected,
            "page": currentPage,
            "profession_id": majorSelected,
            "academy_id": collegeSelected,
            "registe_start": registerBeginTime === null?'':moment(registerBeginTime).valueOf(),
            "registe_end": registeEndrTime === null?'':moment(registeEndrTime).valueOf(),
            "academic_start": joinBeginTime === null?'':moment(joinBeginTime).valueOf(),
            "academic_end": joinEndrTime === null?'':moment(joinEndrTime).valueOf(),
            "user_name": userName,
            "id_number": IDcard,
            "contact_phone": phone,
            "examine_state": auditStatusSelected
        };

        this.$http
            .post(this.$HOST.host + '/a/user/examinelist', formData)
            .subscribe(
                res => {
                    this.WaitPendingSubject.next(res)
                },
                err => {
                    this.WaitPendingSubject.next(err)
                }
            )
    }

    // 校友管理待审核，下拉框subject
    public waitPendingOfSelectSubject = new Subject<any>();

    public getCollegeSelectData():void {        
        // 获取 学院 下拉框相关数据
        this.$http
            .post(this.$HOST.host + '/util/academy/dropbox', {})
            .subscribe(
                res => {
                    this.waitPendingOfSelectSubject.next({college: res})
                },
                err => {
                    this.waitPendingOfSelectSubject.next({college: err})
                }
            )
    }

    public getMajorSelectData(value):void {
        // 获取 专业 下拉框相关数据
        var formData = {
            academy_id: value
        }

        this.$http
            .post(this.$HOST.host + '/util/major/dropbox', formData)
            .subscribe(
                res => {
                    this.waitPendingOfSelectSubject.next({major: res})
                },
                err => {
                    this.waitPendingOfSelectSubject.next({major: err})
                }
            )
    }

    public pendingAuditSubject = new Subject<any>();

    public handerAudit(id, status):void {
        var formData = {
            "id": id,
            "examine_state": status,
            "examine_user": window.localStorage.getItem('userName')
        }
        
        this.$http
        .post(this.$HOST.host + '/a/examine_state/change', formData)
        .subscribe(
            res => {
                this.pendingAuditSubject.next(res)
            },
            err => {
                this.pendingAuditSubject.next(err)
            }
        )       
    }

    /**
     * 校友列表相关的方法，编辑功能，解冻/冻结功能，查询分页功能
     */

    public schoolFWSubject = new Subject<any>();

    // 获取校友列表表
    public getSchoolFwData():void {
        var formData = {
            "education": "专科",
            "page": 1,
            "profession_id": 1705616188964869,
            "academy_id": 1705577148383233,
            "registe_start": 1521724069159,
            "registe_end": 1521724069159,
            "academic_start": 1521705972777,
            "academic_end": 1521705972777,
            "user_name": "小明",
            "id_number": "140332122333233321",
            "contact_phone": "18333608366",
            "c_data_state":1,
            "province_code":"11",
            "city_code":"1101"
        }
        
        this.$http
        .post(this.$HOST.host + '/a/user/clientlist', formData)
        .subscribe(
            res => {
                this.schoolFWSubject.next(res)
            },
            err => {
                this.schoolFWSubject.next(err)
            }
        )       
    }

    // 处理解冻 / 冻结
    public handleFreezeSubject = new Subject<any>();

    public dealFreeze (id, status) {
        var formData = {
            id: id,
            c_data_state: status
        };

        this.$http
        .post(this.$HOST.host + '/a/user/clientlist', formData)
        .subscribe(
            res => {
                this.handleFreezeSubject.next(res)
            },
            err => {
                this.handleFreezeSubject.next(err)
            }
        )       
    }

    // 校友列表编辑
}
