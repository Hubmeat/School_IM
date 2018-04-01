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
  video_type: string = '1';
  live_state: string = '1';
  live_pic;
  live_person_id;
  live_person_gender;
  addSubscription: Subscription // 列表

  constructor(
    private service: LiveAdministrationService,
    private _message: NzMessageService,
    private router: Router
  ) {}
  ngOnInit() {

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
}
