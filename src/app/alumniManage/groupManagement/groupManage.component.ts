import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    editVisible:boolean = false;
    endTime = null;

    // 表格数据
    headerShow:boolean = false;
    data = [];
    spinShow:boolean = false;
    borderShow:boolean = false;
    currentPage = 1;
    totalPage = 0;

    // 编辑模态框
    modelStyle:any = {
        width: '600px'
    };
    groupIntro:string = '';
    remarkInfo:string = '';

    editInfo = {

    }
    isReadOnly:boolean = true;

    constructor(
        private router: Router,
        private alumniService: AMService
    ) {}

    ngOnInit():void {
        this.loadData();
    }

    loadData ():void {
        this.spinShow = true;
        this.alumniService.getGroupData(
            this.currentPage,
            this.groupName,
            this.beginTime,
            this.endTime
        );
        this.alumniService.groupManageSubject.subscribe(
            res => {
                this.spinShow = false;
                if (res.error_code === 0) {
                    this.data = res.result;
                    this.totalPage = res.total_count;
                } else {
                    this.data = [];
                    this.totalPage = 0;
                }
            }
        )
    }

    createGroup():void {
        this.router.navigate(['index/addGroup'])
    }

    handlerSearch():void {
        this.currentPage = 1;
        this.loadData();
    }

    currentPageChange(currentPage):void {
        this.currentPage = currentPage;
        this.loadData();
    }

    openEditBox(data):void  {
        this.editVisible = true;
        this.editInfo = Object.assign({}, data);
        console.log('this.editInfo ', this.editInfo )
    }

    closeEditModel():void {
        this.editVisible = false;
    }

    editWay():void {
        this.isReadOnly = false;
    }

    cancelEdit():void {
        this.isReadOnly = true;
    }

    saveEdit():void {

    }

    // 提出群
    deleteMenber() {
      const menubar_id = '';
      const tid = '';
      const uid = '';
      const id = '';
      this.alumniService.deleteMember(
        menubar_id,
        tid,
        uid,
        id
      )
      this.alumniService.MemberServiceSubject.subscribe(res => {
        if (res.delmsg === undefined) {
          return;
        }
        if (res.delmsg.error_code === 0) {
          alert('删除成功');
          this.loadData()
        }
      })
    }


}
