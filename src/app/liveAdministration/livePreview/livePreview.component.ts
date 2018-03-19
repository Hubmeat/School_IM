import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'livePreview-component',
  templateUrl: './livePreview.component.html',
  styleUrls: [
    './livePreview.component.less'
  ]
})

export class LivePreviewComponent implements OnInit  {
  _dataSet = [];
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