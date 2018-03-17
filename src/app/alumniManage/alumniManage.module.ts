// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { AMService } from './alumniMgService/alumniMgService.component';

import { WaitPendingComponent } from 'app/alumniManage/waitPending/waitPending.component';

// 导入事件模块的服务


const EventComponents = [
    WaitPendingComponent
];

const EVENTROUTES: Routes = [
    {
        path: 'waitPending',
        component: WaitPendingComponent
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
    providers: [ AMService]
})

export class AlumniManageModule {}
