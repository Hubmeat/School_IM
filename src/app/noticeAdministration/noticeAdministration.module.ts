// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';

import {NoticeAdminService} from './noticeAdministrationService/noticeAdmin.service';
import {NoticeAdminComponent} from './noticeAdmin/noticeAdmin.component';
import {AddNoticeComponent} from './addNotice/addNotice.component';
import {CkeditorComponent} from './addNotice/ckeditor/ckeditor';

// 导入事件模块的服务


const EventComponents = [
    NoticeAdminComponent,
    AddNoticeComponent,
    CkeditorComponent
];

const EVENTROUTES: Routes = [
  {
    path: 'noticeAdmin',
    component: NoticeAdminComponent
  },
  {
    path: 'addNotice',
    component: AddNoticeComponent
  }
]

@NgModule({
  declarations: [
    ...EventComponents
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule ,
    NgxEchartsModule,
    HttpClientModule,
    NgZorroAntdModule,
    RouterModule.forChild(EVENTROUTES)
  ],
  exports: [
    ...EventComponents,
    RouterModule
  ],
  bootstrap: [],
  providers: [ NoticeAdminService]
})

export class NoticeAdministrationModule {}
