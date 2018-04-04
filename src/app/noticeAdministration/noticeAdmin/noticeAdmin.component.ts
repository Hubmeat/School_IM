import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NoticeAdminService} from '../noticeAdministrationService/noticeAdmin.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Subscription} from 'rxjs/Subscription'



@Component({
  selector: 'noticeAdmin-component',
  templateUrl: './noticeAdmin.component.html',
  styleUrls: [
    './noticeAdmin.component.less'
  ]
})

export class NoticeAdminComponent implements OnInit  {
  _dataSet = [];
  page: number = 1;
  affiche_state: number;
  affiche_title: number;
  dataSubscription: Subscription;
  delSubscription: Subscription;
  showDetailsSubscription: Subscription;
  toggleDetailsSubscription: Subscription;
  dataDetails: any = {
    affiche_pic: '',
    affiche_title: '',
    article_content: ''
  };
  options = [
    {
      label: '全部',
      state: '',
      disabled: false
    },
    {
      label: '显示',
      state: '1',
      disabled: false
    },
    {
      label: '隐藏',
      state: '2',
      disabled: false
    }
  ]
  selectedOption = this.options[0]
  isVisible = false
  isVisible1= false
  newUserName
  disabled
  constructor(
    private router: Router,
    private service: NoticeAdminService,
    private _message: NzMessageService
  ) {}
  ngOnInit() {
    this.service.editFlag = true;
    this.loadData();
  }
  loadData() {
    this.service.getNoticeList(
      this.page,
      this.affiche_state,
      this.affiche_title
    );
    this.dataSubscription = this.service.NoticeAdminSubject.subscribe(res => {
      if (res.dataList === undefined) {
        return;
      }
      if (res.dataList.error_code === 0) {
        this._dataSet = res.dataList.result;
        this.dataSubscription.unsubscribe();
      }
    })
  }
  deleteNot(id) {
    this.service.deleteNotice(id);
    this.delSubscription = this.service.NoticeAdminSubject.subscribe(res => {
      if (res.delmsg === undefined) {
        return;
      }
      if (res.delmsg.error_code === 0) {
        this._message.success('删除成功');
        this.delSubscription.unsubscribe();
        this.loadData();
      }
    })
  }
  toggleState(id, state) {
    state = state === 1 ? 2 : 1;
    this.service.toggleState(id, state);
    this.toggleDetailsSubscription = this.service.NoticeAdminSubject.subscribe(res => {
      console.log(res)
      if (res.togglemsg === undefined) {
        return;
      }
      if (res.togglemsg.error_code === 0) {
        this._message.success('状态修改成功');
        this.toggleDetailsSubscription.unsubscribe();
        this.loadData();
      }
    })
  }
  deleteNotcancel() {

  }
  addNewNotice(): void {
    this.router.navigate(['/index/addNotice'])
  }
  editNot(data) {
    console.log(data)
    this.service.editFlag = false;
    this.service.editData = data;
    this.router.navigate(['/index/addNotice']);
  }
  // 详情
  showDetailsModal = (id) => {
    this.isVisible = true;
    this.service.getNoticedetail(id);
    this.showDetailsSubscription = this.service.NoticeAdminSubject.subscribe(res => {
      if (res.detailmsg === undefined) {
        return;
      }
      if (res.detailmsg.error_code === 0) {
        this.dataDetails = res.detailmsg.result[0];
        this.showDetailsSubscription.unsubscribe();
      }
    })
  }
  showModal1 = () => {
    this.isVisible1 = true;
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
}
