import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiModule } from '../../api/api';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/retry';
import * as moment from 'moment';

@Injectable()

export class LiveAdministrationService {
    constructor(
      private $HOST: ApiModule,
      private $http: HttpClient
    ) {}

    public LivePreSubject = new Subject<any>();

    // 预告列表
    public geiLivePreDataList(searchParam, live_title, page) {
      const formData = {
        searchParam: searchParam,
        live_title: live_title,
        page: page
      };
      this.$http
        .post(this.$HOST.host + '/a/live_foreshow/list', formData)
        .subscribe(res => {
          this.LivePreSubject.next({dataList: res})
        })
    }

    // 预告新增
    public addLivePre(
      uid,
      live_title,
      live_pic,
      live_person_id,
      live_person,
      live_person_gender,
      foreshow_intro,
      live_state,
      live_time,
      live_end_time
    ) {
      const formData = {
        uid: uid,
        live_title: live_title,
        live_pic: live_pic,
        live_person_id: live_person_id,
        live_person: live_person,
        live_person_gender: live_person_gender,
        foreshow_intro: foreshow_intro,
        live_state: live_state,
        live_time: live_time === null ? '' : moment(live_time).valueOf(),
        live_end_time: live_end_time === null ? '' : moment(live_end_time).valueOf(),
      };
      this.$http
        .post(this.$HOST.host + '/a/live_foreshow/new', formData)
        .subscribe(res => {
          this.LivePreSubject.next({addmsg: res})
        })
    }

    public LiveListSubject = new Subject<any>();
    // 直播列表
    public geiLiveListDataList(searchParam, live_title, page, video_type) {
    const formData = {
      searchParam: searchParam,
      live_title: live_title,
      page: page,
      video_type: video_type
    };
    this.$http
      .post(this.$HOST.host + '/a/live/list', formData)
      .subscribe(res => {
        this.LiveListSubject.next({dataList: res})
      })
  }
    // 添加直播
    public addLiveList(
      uid,
      live_title,
      live_pic,
      live_person_id,
      live_person,
      live_person_gender,
      live_state,
      video_url,
      video_type
    ) {
      const formData = {
        uid: uid,
        live_title: live_title,
        live_pic: live_pic,
        live_person_id: live_person_id,
        live_person: live_person,
        live_person_gender: live_person_gender,
        live_state: live_state,
        video_url: video_url,
        video_type: video_type
      };
      this.$http
        .post(this.$HOST.host + '/a/live/new', formData)
        .subscribe(res => {
          this.LiveListSubject.next({addmsg: res})
        })
    }

    public LiveServiceSubject = new Subject<any>();

    // 详情
    public geiLivePreDetail(id) {
      const formData = {
        id: id
      };
      this.$http
        .post(this.$HOST.host + '/a/live/detail', formData)
        .subscribe(res => {
          this.LiveServiceSubject.next({detail: res})
        })
    }

    // 编辑
    editData: any = {};
    editFlag: boolean = true;
    public editLivePre(
      id,
      live_title,
      live_pic,
      live_person_id,
      live_person,
      live_person_gender,
      foreshow_intro,
      live_state,
      video_url,
      video_type,
      live_time,
      live_end_time
    ) {
      const formData = {
        id: id,
        live_title: live_title,
        live_pic: live_pic,
        live_person_id: live_person_id,
        live_person: live_person,
        live_person_gender: live_person_gender,
        foreshow_intro: foreshow_intro,
        live_state: live_state,
        video_url: video_url,
        video_type: video_type,
        live_time: live_time === null ? '' : moment(live_time).valueOf(),
        live_end_time: live_end_time === null ? '' : moment(live_end_time).valueOf(),
      };
      this.$http
        .post(this.$HOST.host + '/a/live/update', formData)
        .subscribe(res => {
            this.LiveServiceSubject.next({editmsg: res})
        })
    }

    // 删除
    public deleteLivePre(id) {
      const formData = {
        id: id
      };
      this.$http
        .post(this.$HOST.host + '/a/live/remove', formData)
        .subscribe(res => {
          this.LiveServiceSubject.next({delmsg: res})
        })
    }

    // 状态改变
    public LivePreState(live_state, id) {
      const formData = {
        live_state: live_state,
        id: id
      };
      this.$http
        .post(this.$HOST.host + '/a/live_state/change', formData)
        .subscribe(res => {
          this.LiveServiceSubject.next({statemsg: res})
        })
    }

    // 直播人搜索
    public LiveUserList(searchParam) {
      const formData = {
        searchParam: searchParam
      };
      this.$http
        .post(this.$HOST.host + '/a/live/userlist', formData)
        .subscribe(res => {
          this.LiveServiceSubject.next({userlist: res})
        })
    }

    // 上传
    public upFile(formData) {
      // console.log(file);
      // const formData = formData
      this.$http
        .post(this.$HOST.host + '/util/qiniu/upload', formData)
        .subscribe(res => {
          this.LivePreSubject.next({file: res})
        })
    }
    public getLivePersonsList(searchParam) {
      const formData = {
        searchParam: searchParam
      }
      this.$http
        .post(this.$HOST.host + '/a/live/userlist', formData)
        .subscribe(res => {
          this.LiveServiceSubject.next({personList: res})
        })
    }
}
