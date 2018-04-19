import { Component, OnInit } from '@angular/core';
import {LiveAdministrationService} from '../liveAdministrationService/liveAdministration.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Subscription} from 'rxjs/Subscription'
import {Router} from '@angular/router';



@Component({
  selector: ' liveList-component',
  templateUrl: './liveList.component.html',
  styleUrls: [
    './liveList.component.less'
  ]
})

export class LiveListComponent implements OnInit  {
  _dataSet = [];
  isDetailsModal = false; // 详情弹窗
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
  options = [
    {
      label: '直播',
      value: '1'
    },
    {
      label: '回放',
      value: '2'
    }
  ]; // 视频状态下拉列表

  searchParam: string = '';
  page: number = 1;
  live_title: string = ''; // 直播标题
  video_type: string; // 视频类型：1 代表直播 2 代表回放

  listSubscription: Subscription // 列表
  delSubscription: Subscription; // 删除
  togSubscription: Subscription; // 切换状态


  constructor(
    private service: LiveAdministrationService,
    private _message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.service.editFlag = true;
    this.loadData();
  }

  loadData() {
    console.log(this.video_type)
    this.service.geiLiveListDataList(
      this.searchParam,
      this.live_title,
      this.page,
      this.video_type
    )
    this.listSubscription = this.service.LiveListSubject.subscribe(res => {
      console.log(res);
      if (res.dataList === undefined) {
        return;
      }
      if (res.dataList.error_code === 0) {
        this._dataSet = res.dataList.result;
        this.listSubscription.unsubscribe();
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

  getEdit(data) {
    this.service.editFlag = false;
    this.service.editData = data;
    this.router.navigate(['/index/addList'])
  }

  handleOk = (e) => {
    this.isDetailsModal = false;
  }
  deleteLivecancel() {
    this.isDetailsModal = false;
  }
  handleCancel = (e) => {
    console.log(e);
    this.isDetailsModal = false;
  }
}
