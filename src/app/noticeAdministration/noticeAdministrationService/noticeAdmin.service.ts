import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiModule } from '../../api/api';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/retry';

@Injectable()

export class NoticeAdminService {
    constructor(
      private $HOST: ApiModule,
      private $http: HttpClient
    ) {}

    public NoticeAdminSubject = new Subject<any>();
    // 获取列表
    public getNoticeList(page, affiche_state, affiche_title) {
      const formData = {
        page: 1,
        affiche_state: affiche_state,
        affiche_title: affiche_title
      };
      this.$http
        .post(this.$HOST.host + '/a/affiche/list', formData)
        .subscribe(res => {
          this.NoticeAdminSubject.next({dataList: res})
        })
    }

    // 详情
    public getNoticedetail(id) {
      const formData = {
        id: id
      };
      this.$http
        .post(this.$HOST.host + '/a/affiche/detail', formData)
        .subscribe(res => {
          this.NoticeAdminSubject.next({detailmsg: res})
        })
    }

    // 添加
    public addNotice(
      uid,
      user_name,
      affiche_title,
      affiche_pic,
      affiche_type,
      affiche_state,
      article_url,
      article_intr,
      article_content
    ) {
      const formData = {
        uid: uid,
        user_name: user_name,
        affiche_title: affiche_title,
        affiche_pic: affiche_pic,
        affiche_type: affiche_type,
        affiche_state: affiche_state,
        article_url: article_url,
        article_intr: article_intr,
        article_content: article_content
      };
      this.$http
        .post(this.$HOST.host + '/a/affiche/new', formData)
        .subscribe(res => {
          this.NoticeAdminSubject.next({addmsg: res})
        })
    }

    editFlag: boolean;
    editData: any;
    // 编辑
    public editNotice(
      id,
      affiche_title,
      affiche_pic,
      affiche_type,
      affiche_state,
      article_url,
      article_intr,
      article_content
    ) {
      const formData = {
        id: id,
        affiche_title: affiche_title,
        affiche_pic: affiche_pic,
        affiche_type: affiche_type,
        affiche_state: affiche_state,
        article_url: article_url,
        article_intr: article_intr,
        article_content: article_content
      };
      this.$http
        .post(this.$HOST.host + '/a/affiche/update', formData)
        .subscribe(res => {
          this.NoticeAdminSubject.next({editmsg: res})
        })
    }

    // 删除
    public deleteNotice(id) {
      const formData = {
        id: id
      };
      this.$http
        .post(this.$HOST.host + '/a/affiche/remove', formData)
        .subscribe(res => {
          this.NoticeAdminSubject.next({delmsg: res})
        })
    }

    public toggleState(id, affiche_state) {
      const formData = {
        id: id,
        affiche_state: affiche_state
      };
      this.$http
        .post(this.$HOST.host + '/a/affiche_state/change', formData)
        .subscribe(res => {
          this.NoticeAdminSubject.next({togglemsg: res})
        })
    }

    // 上传
    public upFile(file, type) {
      console.log(file);
      const formData = {
        file: file,
        type: type
      }
      this.$http
        .post(this.$HOST.host + '/util/qiniu/upload', formData)
        .subscribe(res => {
          this.NoticeAdminSubject.next({file: res})
        })
    }
}
