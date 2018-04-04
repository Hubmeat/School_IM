import { Component, OnInit } from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {LiveAdministrationService} from '../../liveAdministrationService/liveAdministration.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription'


@Component({
  selector: ' addLive-component',
  templateUrl: './addLive.component.html',
  styleUrls: [
    './addLive.component.less'
  ]
})

export class AddLiveComponent implements OnInit  {
  live_title: string = '';
  live_person: string = '';
  video_url: string = '';
  avatarUrl: string = '';
  video_type: number = 1;
  live_state: number = 1;
  live_pic;
  live_person_id;
  live_person_gender;
  addSubscription: Subscription // 添加
  editSubscription: Subscription // 编辑
  id;
  live_time;
  foreshow_intro;

  editFlag;
  editData;

  constructor(
    private service: LiveAdministrationService,
    private _message: NzMessageService,
    private router: Router
  ) {}
  ngOnInit() {
    this.editFlag = this.service.editFlag;
    if (!this.editFlag) {

      this.editData = this.service.editData;
      console.log(this.editData)
      this.id = this.editData.id
      this.live_title = this.editData.live_title
      this.live_pic = this.editData.live_pic
      this.live_time = this.editData.live_time
      this.live_person_id = this.editData.live_person_id
      this.live_person = this.editData.live_person
      this.live_person_gender = this.editData.live_person_gender
      this.foreshow_intro = this.editData.foreshow_intro
      this.live_state = this.editData.live_state
      this.video_url = this.editData.video_url
      this.video_type = this.editData.video_type
    }
  }

  goback() {
    this.router.navigate(['/index/liveList']);
  }
  submitLive() {
    const uid = window.localStorage.getItem('uid');

    this.service.addLiveList(
      uid,
      this.live_title,
      this.live_pic,
      this.live_person_id,
      this.live_person,
      this.live_person_gender,
      this.live_state,
      this.video_url,
      this.video_type
    )
    this.addSubscription = this.service.LiveListSubject.subscribe(res => {
      console.log(res);
      if (res.addmsg === undefined) {
        return;
      }
      if (res.addmsg.error_code === 0) {
        this._message.success('添加成功');
        this.router.navigate(['/index/liveList']);
        this.addSubscription.unsubscribe();
      }
    })
  }

  editSubmit() {
    this.service.editLivePre(
      this.id,
      this.live_title,
      this.live_pic,
      this.live_time,
      this.live_person_id,
      this.live_person,
      this.live_person_gender,
      this.foreshow_intro,
      this.live_state,
      this.video_url,
      this.video_type,
    )
    this.editSubscription = this.service.LiveServiceSubject.subscribe(res => {
      if (res.editmsg) {
        if (res.editmsg.error_code === 0) {
          this._message.success('编辑成功');
          this.router.navigate(['/index/liveList']);
        } else {
          this._message.warning('编辑失败');
        }
        this.editSubscription.unsubscribe();
      }
    })
  }
}
