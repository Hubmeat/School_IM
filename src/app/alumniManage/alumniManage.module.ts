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
import { AuditRecordCom } from './auditRecord/auditRecord.component';
import { SchoolfellowListCom } from './schoolfellowList/schoolfellowList.component';
import { GroupManagementCom } from './groupManagement/groupManage.component';
import { AddGroupCom } from './groupManagement/addGroup/addGroup.component';
import {AddMemberComponent} from './groupManagement/addMember/addMember.component';

// 导入事件模块的服务


const EventComponents = [
    WaitPendingComponent,
    AuditRecordCom,
    SchoolfellowListCom,
    GroupManagementCom,
    AddGroupCom,
    AddMemberComponent
];

const EVENTROUTES: Routes = [
    {
        path: 'waitPending',
        component: WaitPendingComponent
    }, {
        path: 'auditRecord',
        component: AuditRecordCom
    }, {
        path: 'schoolfellow',
        component: SchoolfellowListCom
    },  {
        path: 'groupManagement',
        component: GroupManagementCom
    },  {
        path: 'addGroup',
        component: AddGroupCom
    },  {
        path: 'addMember',
        component: AddMemberComponent
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
