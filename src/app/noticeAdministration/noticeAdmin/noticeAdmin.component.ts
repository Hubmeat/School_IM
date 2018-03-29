import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';



@Component({
  selector: 'noticeAdmin-component',
  templateUrl: './noticeAdmin.component.html',
  styleUrls: [
    './noticeAdmin.component.less'
  ]
})

export class NoticeAdminComponent implements OnInit  {
  _dataSet = [];
  options = [
    {
      label: '全部',
      disabled: false
    },
    {
      label: '显示',
      disabled: false
    },
    {
      label: '隐藏',
      disabled: false
    }
  ]
  selectedOption = this.options[0]
  isVisible = false
  isVisible1= false
  newUserName
  disabled
  constructor(
    private router: Router
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
  }

  addNewNotice(): void {
    this.router.navigate(['/index/addNotice'])
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
