import { Component, OnInit } from '@angular/core';



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
      label: '全部'
    },
    {
      label: '显示'
    },
    {
      label: '隐藏'
    }
  ]
  selectedOption = this.options[0]
  isVisible = false
  isVisible1= false
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
