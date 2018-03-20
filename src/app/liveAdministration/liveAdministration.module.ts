// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';

import {LivePreviewComponent} from './livePreview/livePreview.component';
import {LiveListComponent} from './liveList/liveList.component';
import {LiveAdministrationService} from './liveAdministrationService/liveAdministration.service';
import {AddLiveComponent} from './liveList/addLive/addLive.component';
import {AddPreviewComponent} from './livePreview/addPreview/addPreview.component';

// 导入事件模块的服务


const EventComponents = [
  LivePreviewComponent,
  LiveListComponent,
  AddLiveComponent,
  AddPreviewComponent
];

const EVENTROUTES: Routes = [
  {
    path: 'livePreview',
    component: LivePreviewComponent
  },
  {
    path: 'liveList',
    component: LiveListComponent,
  },
  {
    path: 'addList',
    component: AddLiveComponent
  },
  {
    path: 'addPreview',
    component: AddPreviewComponent
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
  providers: [ LiveAdministrationService]
})

export class LiveAdministrationModule {}
