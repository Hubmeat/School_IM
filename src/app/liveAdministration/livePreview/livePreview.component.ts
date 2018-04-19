import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {LiveAdministrationService} from '../liveAdministrationService/liveAdministration.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Subscription} from 'rxjs/Subscription'



@Component({
  selector: 'livePreview-component',
  templateUrl: './livePreview.component.html',
  styleUrls: [
    './livePreview.component.less'
  ]
})

export class LivePreviewComponent implements OnInit  {
  _dataSet = [];
  live_title: string = '';
  searchParam: string = '';
  page: number = 1 ;
  detailData: any = {
    'id': 0,
    'uid': 0,
    'live_title': '',
    'live_pic': '',
    'live_time': 0,
    'live_person_id': 0,
    'live_person': 0,
    'live_person_gender': '',
    'publish_person': '',
    'foreshow_intro': '',
    'video_url': '',
    'video_type': 0,
    'live_state': 0,
    'live_type': 0
  }; // 详情数据
  isVisible = false
  isVisible1= false
  isDetailsModal = false;
  delSubscription: Subscription;
  togSubscription: Subscription;
  constructor(
    private service: LiveAdministrationService,
    private _message: NzMessageService,
    private router: Router
  ) {

  }
  ngOnInit() {
    this.service.editFlag = true;
    this.loadData()
  }
  loadData = () => {
    this.service.geiLivePreDataList(
      this.searchParam,
      this.live_title,
      this.page
    )
    this.service.LivePreSubject.subscribe(res => {
      console.log(res)
      if (res.dataList === undefined) {
        return;
      }
      if (res.dataList.error_code === 0) {
        console.log(res.dataList)
        this._dataSet = res.dataList.result;
      }
    })
}
  // 详情
  showDetailsModal = (id, index) => {
    this.isDetailsModal = true;
    this.service.geiLivePreDetail(id);
    this.service.LiveServiceSubject.subscribe(res => {
      console.log(index);
      if (res.detail === undefined) {
        return;
      }
      if (res.detail.error_code === 0) {
        this.detailData = res.detail.result[0];
      }
    })
  }
  // 切换状态
  toggleState(live_state, id) {
    const state = live_state === 1 ? 2 : 1;
    this.service.LivePreState(state, id);
    this.togSubscription = this.service.LiveServiceSubject.subscribe(res => {
      console.log(res);
      if (res.statemsg === undefined) {
        return;
      }
      if (res.statemsg.error_code === 0) {
        this._message.success('切换成功');
        this.togSubscription.unsubscribe();
        this.loadData();
      }
    })
  }
  // 删除
  deleteLive(id) {
    this.service.deleteLivePre(id);
    this.delSubscription = this.service.LiveServiceSubject.subscribe(res => {
      console.log(res);
      if (res.delmsg === undefined) {
        return
      }
      if (res.delmsg.error_code === 0) {
        this.loadData();
        this._message.success('删除成功');
        this.delSubscription.unsubscribe();
      }
    })
  }
  deleteLivecancel = () => {
    this.isDetailsModal = false;
  }

  getEdit(data) {
    console.log(data);
    this.service.editFlag = false;
    this.service.editData = data;
    console.log(this.service.editData)
    this.router.navigate(['/index/addPreview']);
  }
  showModal = () => {
    this.isVisible = true;
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
    this.isDetailsModal = false;
    this.isVisible = false;
    this.isVisible1 = false;
  }
}
