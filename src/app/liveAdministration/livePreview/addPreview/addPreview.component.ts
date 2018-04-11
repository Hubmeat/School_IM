import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
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
  upImgSubscription: Subscription;
  video_url
  video_type
  id

  editFlag: boolean = false;
  editData: any;


  avatarUrl: string;
  radioValue

  fileList: any = [];
  fileType

  constructor(private service: LiveAdministrationService,
              private _message: NzMessageService,
              private router: Router) {

  }

  ngOnInit() {
    console.log(this.avatarUrl)
      this.editFlag = this.service.editFlag;
      if (!this.editFlag) {

        this.editData = this.service.editData;
        console.log(this.editData)
          this.id = this.editData.id
          this.live_title = this.editData.live_title
          this.live_pic = this.editData.live_pic
          this.avatarUrl = this.editData.live_pic
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
    const isJPG = file.type === 'image/jpeg';
    if (isJPG) {
      this.fileType = 'image';
    }else {
      this.fileType = 'file';
    }
    if (!isJPG) {
      this._message.error('You can only upload JPG file!');
      this.fileList = [];
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this._message.error('Image must smaller than 2MB!');
      this.fileList = [];
    }
    return isJPG && isLt2M;
  }
}
