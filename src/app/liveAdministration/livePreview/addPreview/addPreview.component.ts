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
  live_state: number = 1; // 默认显示
  live_person_id
  live_person_gender
  addSubscription: Subscription;
  editSubscription: Subscription;
  video_url
  video_type
  id

  editFlag: boolean = false;
  editData: any;


  avatarUrl
  beforeUpload
  radioValue

  constructor(private service: LiveAdministrationService,
              private _message: NzMessageService,
              private router: Router) {

  }

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
          this.router.navigate(['/index/livePreview']);
        } else {
          this._message.warning('编辑失败');
        }
        this.editSubscription.unsubscribe();
      }
    })
  }
  handleChange = (e) => {}
}
