import { Component, OnInit } from '@angular/core';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
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
  live_person: any;
  postLive_person: string = ''; // 提交直播人姓名
  video_url: string = '';
  avatarUrl: string;
  video_type: number = 1;
  live_state: number = 1;
  live_pic;
  live_person_id;
  live_person_gender;
  addSubscription: Subscription; // 添加
  editSubscription: Subscription; // 编辑
  upImgSubscription: Subscription; // 上传
  fileList: any = [];
  live_personOptions: any = []; // 直播人搜索列表
  LiveStartTime = null
  LiveEndTime = null
  showpersonList: boolean = false

  id;
  live_time;
  foreshow_intro;
  fileType

  editFlag;
  editData;

  constructor(
    private service: LiveAdministrationService,
    private _message: NzMessageService,
    private router: Router
  ) {}
  ngOnInit() {
    this.getLive_personsList(this.live_person);
    this.editFlag = this.service.editFlag;
    if (!this.editFlag) {

      this.editData = this.service.editData;
      console.log(this.editData);
      this.id = this.editData.id;
      this.live_title = this.editData.live_title;
      this.avatarUrl = this.editData.live_pic;
      this.live_pic = this.editData.live_pic;
      this.LiveStartTime = this.editData.live_time
      this.LiveEndTime = this.editData.live_end_time
      this.live_person_id = this.editData.live_person_id;
      this.live_person = this.editData.live_person;
      this.live_person_gender = this.editData.live_person_gender;
      this.foreshow_intro = this.editData.foreshow_intro;
      this.live_state = this.editData.live_state;
      this.video_url = this.editData.video_url;
      this.video_type = this.editData.video_type;
    }
  }

  searchChange(event) {
    this.getLive_personsList(event)
    window.setTimeout(() => {
      this.showpersonList = true;
    }, 500)
    this.live_person = event
  }
  cancle() {
    window.setTimeout(() => {
      this.showpersonList = false;
    }, 500)
  }
  selectUserNmae(data) {
    console.log(data);
    this.live_person = data.user_name;
    this.live_person_gender = data.gender;
    this.live_person_id = data.id;
    this.showpersonList = false
  }
  // 获取直播人list
  getLive_personsList(son) {
      this.service.getLivePersonsList(son);
      this.service.LiveServiceSubject.subscribe(res => {
        if (res.personList) {
          if (res.personList.error_code === 0) {
            this.live_personOptions = res.personList.result;
          }
        }
      })
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
      this.live_person_id,
      this.live_person,
      this.live_person_gender,
      this.foreshow_intro,
      this.live_state,
      this.video_url,
      this.video_type,
      this.LiveStartTime,
      this.LiveEndTime
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
    this.upImgSubscription = this.service.LivePreSubject.subscribe(res => {
      console.log(res);
      if (!res.error_code) {
        this.avatarUrl = res.file.original_pic;
        this.live_pic = res.file.original_pic;
      } else {
        this.fileList = [];
      }
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
      this.fileList = [];
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      this._message.error('Image must smaller than 5MB!');
      this.fileList = [];
    }
    return isJPG && isLt2M;
  }
}
