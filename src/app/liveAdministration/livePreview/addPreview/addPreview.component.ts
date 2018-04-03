import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {LiveAdministrationService} from '../../liveAdministrationService/liveAdministration.service';
import {Subscription} from 'rxjs/Subscription'


@Component({
  selector: ' addPreview-component',
  templateUrl: './addPreview.component.html',
  styleUrls: [
    './addPreview.component.less'
  ]
})

export class AddPreviewComponent implements OnInit {
  live_title: string = '';
  live_pic
  live_time
  live_person
  foreshow_intro
  live_state: string = '1'; // 默认显示
  live_person_id
  live_person_gender
  addSubscription: Subscription;

  avatarUrl
  beforeUpload
  radioValue

  constructor(private service: LiveAdministrationService,
              private _message: NzMessageService,
              private router: Router) {

  }

  ngOnInit() {

  }

  goback(): void {
    this.router.navigate(['/index/livePreview'])
  }

  previewSubmit(): void {
    const uid = window.localStorage.getItem('uid');
    this.service.addLivePre(
      uid,
      this.live_title,
      this.live_pic,
      this.live_time,
      this.live_person_id,
      this.live_person,
      this.live_person_gender,
      this.foreshow_intro,
      this.live_state
    )
    this.addSubscription = this.service.LivePreSubject.subscribe(res => {
      console.log(res)
      if (res.addmsg === undefined) {
        return;
      }
      if (res.addmsg.error_code === 0) {
        this._message.success(`创建成功!`);
        this.router.navigate(['/index/livePreview']);
        this.addSubscription.unsubscribe();
      }
    })
  }
}
