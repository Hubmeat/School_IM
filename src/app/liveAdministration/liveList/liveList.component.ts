import { Component, OnInit } from '@angular/core';



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
