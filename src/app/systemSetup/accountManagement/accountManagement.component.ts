import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'accountManagement-component',
  templateUrl: './accountManagement.component.html',
  styleUrls: [
    './accountManagement.component.less'
  ]
})

export class AccountManagementComponent implements OnInit {
  newUserName: string = '';
  userPhone: string = '';
  firstPassword: string = '';
  lastPassword: string = '';
  radioState: string = 'start';
  selectedOption
  _dataSet: any = [];
  options: any = [
    {
      label: '可用',
      option: true,
      disabled: false
    },
    {
      label: '不可用',
      option: false,
      disabled: false
    }
  ]
  isVisible = false;

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

  handleOk = (e) => {
    console.log('点击了确定');
    this.isVisible = false;
  }

  handleCancel = (e) => {
    console.log(e);
    this.isVisible = false;
  }
  _console() {
    // ..
  }
}
