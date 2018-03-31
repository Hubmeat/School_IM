import { Component, OnInit } from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {ContactAdminService} from '../contactAdminService/contactAdmin.service';

@Component({
  selector: 'contactAdmin-component',
  templateUrl: './contactAdmin.component.html',
  styleUrls: [
    './contactAdmin.component.less'
  ]
})

export class ContactAdminComponent implements OnInit {
  dataList = [];
  schoolName = '';
  isVisible = false;
  isVisible1= false;
  isEditVisible= false;
  page: number = 1;
  searchParam:string = '';
  editName: '';
  editId: string = ''

  academy_name: string = ''; // 学院名
  msg: string = '';
  constructor(
    private service: ContactAdminService,
    private _message: NzMessageService,
    private router: Router
  ) {}
  ngOnInit() {
    this.dataList = [1,2,3,4,5,6,7,8,9,0];
  }
}
