import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NoticeAdminService} from '../noticeAdministrationService/noticeAdmin.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Subscription} from 'rxjs/Subscription'


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
  affiche_type: string = '1';
  affiche_state: string = '1';
  article_url
  article_intr
  article_content
  options = [
    {
      label: '全部'
    },
    {
      label: '显示'
    },
    {
      label: '隐藏'
    }
  ]
  selectedOption = this.options[0]
  isVisible = false
  isVisible1= false
  newUserName
  radioValue
  avatarUrl
  beforeUpload
  addSubscription: Subscription;
  constructor(
    private router: Router,
    private service: NoticeAdminService,
    private _message: NzMessageService
  ) {}
  ngOnInit() {

  }

  addNoticeSubmit() {
    const uid = window.localStorage.getItem('uid');
    const user_name = window.localStorage.getItem('user_name');
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
  goback() {
    this.router.navigate(['/index/noticeAdmin']);
  }
  previewSubmit(){}
  handleChange(e){}
}
