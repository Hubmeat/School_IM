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

  id;
  editFlag: boolean;
  editData: any;

  editor
  a
  ckeditorContent: string = ''
  config = {
    filebrowserBrowseUrl: '&&&&&',
    filebrowserUploadUrl: '&&&'
  };
  constructor(
    private router: Router,
    private service: NoticeAdminService,
    private _message: NzMessageService,
    // private wangeditor: WangEditor
  ) {}
  ngOnInit() {
    this.editFlag = this.service.editFlag;
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
    this.service.upFile(this.file, this.fileType);
    this.service.NoticeAdminSubject.subscribe(res => {
      console.log(res);
    })
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
          this.router.navigate(['/index/liveList']);
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

  // beforeUpload = (file: File) => {
    /*var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i; //控制格式
    var iMaxFilesize = 2097152; //控制大小2M
    var iMaxFilesize = 2097152; //控制大小2M

    var reader = new FileReader();
    if (!rFilter.test(file.type)) {
      alert("文件格式必须为图片");
      return;
    }
    if (file.size > iMaxFilesize) {
      alert("图片大小不能超过2M");
      return;
    }*/
    /*if(typeof FileReader == 'undefined'){
      result.InnerHTML="<p>你的浏览器不支持FileReader接口！</p>";
      //使选择控件不可操作
    }
    const reader = new FileReader();
    const res = reader.readAsDataURL(file);
    console.log("file", file);
    console.log("res", res);

    reader.onload = function (e) {

      const result = document.getElementById("result");
      // 显示文件
      console.log(result)
      this.avatarUrl = result;
    }
    reader.readAsDataURL(file);
    console.log('res', res)
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      this._message.error('上传格式有误!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      this._message.error('图片过大!');
    }
    return isJPG && isLt2M;
  }*/

    beforeUpload = (file: File) => {
      this.file = file;
      const isJPG = file.type === 'image/jpeg';
      if (isJPG) {
        this.fileType = 'image';
      }else {
        this.fileType = 'file';
      }
      if (!isJPG) {
        this._message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this._message.error('Image must smaller than 2MB!');
      }
      return isJPG && isLt2M;
    }

  private getBase64(img: File, callback: (img: any) => void) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }) {
    this.getBase64(info.file.originFileObj, (img: any) => {
      this.loading = false;
      this.avatarUrl = img;
    });
  }

  contentChange(e) {
      console.log(e);
      this.article_content = e;
  }
}
