import { Component, OnInit } from '@angular/core';
import {LiveAdministrationService} from '../liveAdministrationService/liveAdministration.service';
import {NzMessageService} from 'ng-zorro-antd';



@Component({
  selector: ' liveList-component',
  templateUrl: './liveList.component.html',
  styleUrls: [
    './liveList.component.less'
  ]
})

export class LiveListComponent implements OnInit  {
  _dataSet = [];
  isVisible = false
  isVisible1= false
  newUserName
  selectedOption
  options

  searchParam: string;
  page: 1;
  live_title: string; // 直播标题
  video_type: string; // 视频类型：1 代表直播 2 代表回放

  constructor(
    private service: LiveAdministrationService,
    private _message: NzMessageService

  ) {}

  ngOnInit() {
    for (let i = 0; i < 46; i++) {
      this._dataSet.push({
        key    : i,
        name   : `Edward King ${i}`,
        age    : 32,
        address: `London, Park Lane no. ${i}`,
      });
    }
    this.loadData();
  }

  loadData() {
    this.service.geiLiveListDataList(
      this.searchParam,
      this.live_title,
      this.page,
      this.video_type
    )
    this.service.LiveListSubject.subscribe(res => {
      console.log(res);
      this._dataSet = res.dataList.result;
    })
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
    this.isVisible = false;
    this.isVisible1 = false;
  }
}
