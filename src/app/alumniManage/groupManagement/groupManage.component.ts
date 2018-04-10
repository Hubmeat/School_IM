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
    tid: any; // 群ID

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

    // 成员管理

    // 性别下拉列表
    sexOptions = [
      { value: '0', label: '全部'},
      { value: '1', label: '男'},
      { value: '2', label: '女'}
    ]
    // 省市下拉框
    provinceOptions = [];

    cityOptions = [];
    areaOptions = [];
    membergroupName: any = '';
    membergroupPhone: any = '';
    membersexSelected: number = 0;
    memberprovinceSelected: any = '';
    membercitySelected: any = '';
    memberareaSelected: any = '';
    membercurrentPage: any = 1;

    menubarList: any = []; // 成员列表

    // deleteSubscription = Subscription;
    isReadOnly:boolean = true;

    constructor(
        private router: Router,
        private alumniService: AMService,
        private _message: NzMessageService
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

    openEditBox(data): void  {
        this.editVisible = true;
        this.editInfo = Object.assign({}, data);
        this.alumniService.tid = data.tid;
        this.getMemberList();
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
    cancel = () => {}

    // 提出群
    deleteMenber(data) {
      console.log(data);
      const menubar_id = data.id;
      const tid = this.alumniService.tid;
      const uid = ''; // 群主id
      const id = '';  // 数据id
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

    getMemberList() {
      this.alumniService.getmemberList(
        this.membergroupName,
        this.membergroupPhone,
        this.membersexSelected,
        this.memberprovinceSelected,
        this.membercitySelected,
        this.memberareaSelected,
        this.membercurrentPage
      )
      this.alumniService.MemberServiceSubject.subscribe(res => {
        if (res.dataList === undefined) {
          return;
        }
        console.log(res);
        this.menubarList = res.dataList.result
      })
    }

    // 查看成员详情
    getDetails(data) {
      this.alumniService.getMemberDetails();
    }

    // 解散群
    groupDelete(data) {
      console.log(data);
      const uid = window.localStorage.getItem('uid');
      this.alumniService.groupRemove(
        uid,
        data.id,
        data.tid
      )
      this.alumniService.MemberServiceSubject.subscribe(res => {
        if (res.removemsg === undefined) {
          return;
        }
        if (res.removemsg.error_code === 0) {
          console.log(res);
          this._message.success('解散群成功');
          // this.deleteSubscription.unsubscribe();
          this.loadData()
        }
      })
    }


}
