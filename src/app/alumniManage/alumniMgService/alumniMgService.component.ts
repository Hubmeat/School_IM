
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
     * 校友公共功能接口
     */
    public provinceCodeSubject = new Subject<any>();

    public getProvinceList ():void {
        var formData = {
            "type": "province"
        }
        this.$http
            .post(this.$HOST.host + '/util/location/get', formData)
            .subscribe(
                res => {
                    this.provinceCodeSubject.next({province: res});
                },
                err => {
                    this.provinceCodeSubject.next({province: err});
                }
            )
    }

    // public cityCodeSubject = new Subject<any>();
    public getCityList (code):void {
        var formData = {
            "type": "city",
            "code": code
        }
        this.$http
            .post(this.$HOST.host + '/util/location/get', formData)
            .subscribe(
                res => {
                    this.provinceCodeSubject.next({city: res});
                },
                err => {
                    this.provinceCodeSubject.next({city: err});
                }
            )
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
    public getSchoolFwData(
        education,
        page,
        marjorId,
        collegeId,
        registerBeginTime,
        registerEndrTime,
        joinBeginTime,
        joinEndrTime,
        userName,
        IDcard,
        phone,
        status,
        provinceCode,
        cityCode
    ):void {
        var formData = {
            "education": education,
            "page": page,
            "profession_id": marjorId,
            "academy_id": collegeId,
            "registe_start": registerBeginTime === null?'':moment(registerBeginTime).valueOf(),
            "registe_end": registerEndrTime === null?'':moment(registerEndrTime).valueOf(),
            "academic_start": joinBeginTime === null?'':moment(joinBeginTime).valueOf(),
            "academic_end": joinEndrTime === null?'':moment(joinEndrTime).valueOf(),
            "user_name": userName,
            "id_number": IDcard,
            "contact_phone": phone,
            "c_data_state":  status,
            "province_code": provinceCode,
            "city_code": cityCode
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
        .post(this.$HOST.host + '/a/freeze_state/change', formData)
        .subscribe(
            res => {
                this.handleFreezeSubject.next(res)
            },
            err => {
                this.handleFreezeSubject.next(err)
            }
        )
    }

    // 校友编辑, 详情页
    public schoolFwDeatilSubject = new Subject<any>();

    public getSchoolFwDetail (id) {
        var formData = {
            "id": id
        };

        this.$http
            .post(this.$HOST.host + '/a/user/clientdetail', formData)
            .subscribe(
                res => {
                    this.schoolFwDeatilSubject.next(res)
                },
                err => {
                    this.schoolFwDeatilSubject.next(err)
                }
            )
    }

    public schoolFwEditSubject = new Subject<any>();

    public updatedSchoolFw (object) {
        var formData = Object.assign({}, object, true);

        this.$http
            .post(this.$HOST.host + '/a/user/clientupdate', formData)
            .subscribe(
                res => {
                    this.schoolFwEditSubject.next(res)
                },
                err => {
                    this.schoolFwEditSubject.next(err)
                }
            )
    }


    // 获取行业列表
    public industrySubject = new Subject<any>();

    public getIndustryList () {
        var formData = {};

        this.$http
            .post(this.$HOST.host + '/util/industry/dropbox', formData)
            .subscribe(
                res => {
                    this.industrySubject.next(res)
                },
                err => {
                    this.industrySubject.next(err)
                }
            )
    }

    // 批量导出
    public exportSubject = new Subject<any>();

    public exportData (
        education,
        page,
        marjorId,
        collegeId,
        registerBeginTime,
        registerEndrTime,
        joinBeginTime,
        joinEndrTime,
        userName,
        IDcard,
        phone,
        status,
        provinceCode,
        cityCode
        ) {
        var formData = {
            "education": education,
            "page": page,
            "profession_id": marjorId,
            "academy_id": collegeId,
            "registe_start": registerBeginTime === null?'':moment(registerBeginTime).valueOf(),
            "registe_end": registerEndrTime === null?'':moment(registerEndrTime).valueOf(),
            "academic_start": joinBeginTime === null?'':moment(joinBeginTime).valueOf(),
            "academic_end": joinEndrTime === null?'':moment(joinEndrTime).valueOf(),
            "user_name": userName,
            "id_number": IDcard,
            "contact_phone": phone,
            "c_data_state":  status,
            "province_code": provinceCode,
            "city_code": cityCode
        }

        this.$http
        .post(this.$HOST.host + '/a/user_info/export', formData)
        .subscribe(
            res => {
                this.exportSubject.next(res)
            },
            err => {
                this.exportSubject.next(err)
            }
        )
    }

    // 批量上传
    public uploadSubject = new Subject<any>();

    public uploadFileList (id, file) {
        var formData = {
            unique_identification: id,
            header_index: 1,
            file: file
        }

        this.$http
        .post(this.$HOST.host + '/a/freeze_state/change', formData)
        .subscribe(
            res => {
                this.uploadSubject.next(res)
            },
            err => {
                this.uploadSubject.next(err)
            }
        )
    }



    /**
     * 群组管理，解散群，新建群
     */
      tid: any; // 群id
     public groupManageSubject = new Subject<any>();

     // list
     public getGroupData(page, tname, start_time, end_time):void {
        var formData = {
            "page": page,
            "tname": tname,
            "start_time": start_time === null?'':moment(start_time).valueOf(),
            "end_time": end_time === null?'':moment(end_time).valueOf()
        }

        this.$http
        .post(this.$HOST.host + '/a/group/list', formData)
        .subscribe(
            res => {
                this.groupManageSubject.next(res)
            },
            err => {
                this.groupManageSubject.next(err)
            }
        )
     }

    // 创建群
    public AddGroupSubject = new Subject<any>();

    public postAddGroup(
      members,
      custom,
      tname,
      uid,
      intro,
      icon
    ) {
      const formData = {
        members: [
          1705948746940446
        ],
        // members: members,
        custom: custom,
        tname: tname,
        uid: uid,
        intro: intro,
        icon: icon
      }
      this.$http
        .post(this.$HOST.host + '/a/group/new', formData)
        .subscribe(res => {
          this.AddGroupSubject.next(res);
        })
    }

    public updataGroupSubject = new Subject<any>();
    // 编辑
    public updataGroupInfo(
      members,
      custom,
      tname,
      uid,
      id,
      tid,
      intro,
      icon
    ): void {
        const formData = {
          members: members,
          custom: custom,
          tname: tname,
          uid: uid,
          id: id,
          tid: tid,
          intro: intro,
          icon: icon
        }
        this.$http
        .post(this.$HOST.host + '/a/group/update', formData)
        .subscribe(
            res => {
                this.updataGroupSubject.next(res)
            },
            err => {
                this.updataGroupSubject.next(err)
            }
        )
    }


    public MemberServiceSubject = new Subject<any>();
    // 踢出群
    public deleteMember(member_id, tid, uid, id) {
      const formData = {
        member_id: member_id,
        tid: tid,
        uid: uid,
        id: id
      }
      this.$http
        .post(this.$HOST.host + '/a/group/kickuser', formData)
        .subscribe(res => {
          this.MemberServiceSubject.next({delmsg: res})
        })
    }

    // 获取成员list
    public getmemberList(
      user_name,
      contact_phone,
      gender,
      province_code,
      city_code,
      area_code,
      page
    ) {
      const formData = {
        tid: this.tid,
        user_name: user_name,
        contact_phone: contact_phone,
        gender: gender,
        province_code: province_code,
        city_code: city_code,
        area_code: area_code,
        page: page
      }
      this.$http
        .post(this.$HOST.host + '/a/group/userlist', formData)
        .subscribe(res => {
          this.MemberServiceSubject.next({dataList: res})
        })
    }

    // 成员详情
    public getMemberDetails() {

    }

    // 解散群
    public groupRemove(uid, id, tid) {
      const formData = {
        uid: uid,
        id: id,
        tid: tid
      }
      this.$http
        .post(this.$HOST.host + '/a/group/remove', formData)
        .subscribe(res => {
          this.MemberServiceSubject.next({removemsg: res})
        })
    }

    // 获取可添加成员列表
    public getAddMemberDataList(
      tid,
      education,
      page,
      profession_id,
      academy_id,
      academic_start,
      academic_end,
      user_name,
      contact_phone,
      province_code,
      city_code,
      area_code,
      gender,
      nation,
      industry_involved_id
    ) {
      const formData = {
        tid: tid,
        education: education,
        page: page,
        profession_id: profession_id,
        academy_id: academy_id,
        academic_start: academic_start,
        academic_end: academic_end,
        user_name: user_name,
        contact_phone: contact_phone,
        province_code: province_code,
        city_code: city_code,
        area_code: area_code,
        gender: gender,
        nation: nation,
        industry_involved_id: industry_involved_id
      }
      this.$http
        .post(this.$HOST.host + '/a/group/adduserlist', formData)
        .subscribe(res => {
          this.MemberServiceSubject.next({addDataList: res})
        })
    }
}
