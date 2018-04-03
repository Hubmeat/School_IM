import { Component, OnInit } from '@angular/core';
import { AMService } from '../alumniMgService/alumniMgService.component';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs/Subscription'

@Component({
    selector: 'groupManage-component',
    templateUrl: './groupManage.component.html',
    styleUrls: [
        './groupManage.component.less'
    ]
})

export class GroupManagementCom implements OnInit {
    groupName:string = '';
    beginTime = null;
    endTime = null;

    // 表格数据
    headerShow:boolean = true;    
    data = [];
    spinShow:boolean = false;
    borderShow:boolean = false;
    currentPage = 1;
    totalPage = 0;

    ngOnInit():void {

    }

    createGroup():void {

    }

    handlerSearch():void {

    }
}
