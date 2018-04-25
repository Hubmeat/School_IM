import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NoticeAdminService} from '../noticeAdministrationService/noticeAdmin.service';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {Subscription} from 'rxjs/Subscription'

import * as $ from 'jquery';

import {CKEditorModule} from 'ng2-ckeditor';



@Component({
  selector: 'addNotice-component',
  templateUrl: './addNotice.component.html',
  styleUrls: [
    './addNotice.component.less'
  ]
})

export class AddNoticeComponent implements OnInit  {
  affiche_title: string = '';
  affiche_pic
  affiche_type: number = 1;
  affiche_state: number = 1;
  article_url
  article_intr
  article_content

  loading = false;
  avatarUrl: string;

  file: any;
  fileType: any = 'image';

  isVisible = false
  isVisible1= false

  beforeUploadUrl
  addSubscription: Subscription;
  editSubscription: Subscription;
  upImgSubscription: Subscription;

  id;
  editFlag: boolean;
  editData: any;

  editor
  fileList: any = [];
  constructor(
    private router: Router,
    private service: NoticeAdminService,
    private _message: NzMessageService,
    // private wangeditor: WangEditor
  ) {}
  ngOnInit() {
    this.editFlag = this.service.editFlag;
    console.log(this.service.editFlag);
    if (!this.editFlag && this.editFlag !== undefined) {
      this.editData = this.service.editData;
        this.id = this.editData.id;
        this.affiche_title = this.editData.affiche_title;
        this.affiche_pic = this.editData.affiche_pic;
        this.avatarUrl = this.editData.affiche_pic
        this.affiche_type = this.editData.affiche_type;
        this.affiche_state = this.editData.affiche_state;
        this.article_url = this.editData.article_url;
        this.article_intr = this.editData.article_intr;
        this.article_content = this.editData.article_content;
    }
  }
  addNoticeSubmit() {
    const uid = window.localStorage.getItem('uid');
    const user_name = window.localStorage.getItem('userName');
    this.service.addNotice(
      uid,
      user_name,
      this.affiche_title,
      this.affiche_pic,
      this.affiche_type,
      this.affiche_state,
      this.article_url,
      this.article_intr,
      this.article_content
    );
    this.addSubscription = this.service.NoticeAdminSubject.subscribe(res => {
      if (res.addmsg === undefined) {
        return;
      }
      if (res.addmsg.error_code === 0) {
        this._message.success('添加成功');
        this.addSubscription.unsubscribe();
        this.router.navigate(['/index/noticeAdmin']);
      }
    })

  }

  handleOk = (e) => {
    console.log('点击了确定');
    this.isVisible = false;
    this.isVisible1 = false;
  }

  handleCancel = (e) => {
    console.log(e);
    this.isVisible = false;
    this.isVisible1 = false;
  }
  editSubmit() {
    this.service.editNotice(
      this.id,
      this.affiche_title,
      this.affiche_pic,
      this.affiche_type,
      this.affiche_state,
      this.article_url,
      this.article_intr,
      this.article_content
    )
    this.editSubscription = this.service.NoticeAdminSubject.subscribe(res => {
      if (res.editmsg) {
        if (res.editmsg.error_code === 0) {
          this._message.success('编辑成功');
          this.router.navigate(['/index/noticeAdmin']);
        } else {
          this._message.warning('编辑失败');
        }
        this.editSubscription.unsubscribe();
      }
    })
  }
  goback() {
    this.router.navigate(['/index/noticeAdmin']);
  }


  // 上传
  beforeUpload = (file: UploadFile) => {
    this.fileList.push(file);
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      console.log(file)
      formData.append('type', 'image');
      formData.append('file', file);
    });
    this.service.upFile(formData);
    this.upImgSubscription = this.service.NoticeAdminSubject.subscribe(res => {
      console.log(res);
      this.avatarUrl = res.file.original_pic;
      this.affiche_pic = res.file.original_pic;
      this.upImgSubscription.unsubscribe();
    })
  }

  handleChange(info: { file: UploadFile }) {
      const file = info.file;
      console.log(file)
      const isJPG = file.type === 'image/jpeg' || 'png' || 'jpg' || 'jpeg';
      if (isJPG) {
        this.fileType = 'image';
      }else {
        this.fileType = 'file';
      }
      if (!isJPG) {
        this._message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this._message.error('Image must smaller than 5MB!');
      }
      return isJPG && isLt2M;
  }

  contentChange(e) {
      console.log(e);
      this.article_content = e;
  }
}
