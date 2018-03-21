import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';



@Component({
  selector: ' addPreview-component',
  templateUrl: './addPreview.component.html',
  styleUrls: [
    './addPreview.component.less'
  ]
})

export class AddPreviewComponent implements OnInit  {
  _dataSet = [];
  isVisible = false
  isVisible1= false
  constructor(
    private router: Router,
    private _message: NzMessageService
  ) {

  }
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
  goback(): void {
    this.router.navigate(['/index/livePreview'])
  }
  previewSubmit(): void {
    this.router.navigate(['/index/livePreview'])
    this._message.success(`创建成功!`);
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
