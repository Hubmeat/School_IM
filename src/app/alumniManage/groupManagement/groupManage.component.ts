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
    detailsVisible:boolean = false;
    detailsData: any; // 详情；
    endTime = null;
    tid: any; // 群ID
    uid: any = window.localStorage.getItem('uid'); // 当前登录ID
    groupDataId: any; // 群数据ID
    groupAdminId: any; // 群主id

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
      custom: '',
      intro: '',
      icon: '',
      tname: '',
      created_at: '',
      person_count: ''
    }

    // 成员管理

    // 性别下拉列表
    sexOptions = [
      { value: 0, label: '全部'},
      { value: 1, label: '男'},
      { value: 2, label: '女'}
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
    showOwnerChangeFlag: boolean = false; // 群主转让
    showOwnerList: any = []; // 群主转让列表

    delSubscription: Subscription;
    editSubscription: Subscription;
    delMemberSubscription: Subscription;
    ownerChangeSubscription: Subscription;
    isReadOnly:boolean = true;

  ChangeTid: number;
  ChangeId: number;
  ChangeUid: number;
  ChangeNewowner: number;

    constructor(
        private router: Router,
        private alumniService: AMService,
        private _message: NzMessageService
    ) {}

    ngOnInit():void {
        this.alumniService.groupTid = null;
        this.alumniService.groupUid = null;
        this.alumniService.groupId = null;
        this.loadData();
        this.getCollegeSelectData()
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

                    for (let i in this.data) {
                      if (this.data[i].uid === this.uid) {
                        this.data['ownerChangeFlag'] = false;
                      } else {
                        this.data['ownerChangeFlag'] = true;
                      }
                    }
                } else {
                    this.data = [];
                    this.totalPage = 0;
                }
            }
        )
    }

    // 获取下拉列表数据
    getCollegeSelectData ():void {
    // 获取省市区列表内
      this.alumniService.getProvinceList();
      this.alumniService.provinceCodeSubject.subscribe(
        res => {
          if (res.province) {
            this.provinceOptions = res.province.result;
          }
        }
      )
    }
    provinceChange(provinceCode) {
      this.alumniService.getCityList(provinceCode);
      this.alumniService.provinceCodeSubject.subscribe(
        res => {
          if (res.city) {
            this.cityOptions = res.city.result;
          }
        }
      )
    }
    cityChange(cityCode) {
        this.alumniService.getareaList(cityCode);
        this.alumniService.provinceCodeSubject.subscribe(
          res => {
            if (res.area) {
              this.areaOptions = res.area.result;
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
        console.log(data);
        this.groupDataId = data.id;
        this.groupAdminId = data.uid;
        this.editVisible = true;
        this.editInfo = Object.assign({}, data);
        this.alumniService.groupTid = data.tid;
        this.alumniService.groupUid = data.uid;
        this.alumniService.groupId = data.id;
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

    saveEdit(): void {
      const members = [];
      this.alumniService.updataGroupInfo(
        members,
        this.editInfo.custom,
        this.editInfo.tname,
        this.uid,
        this.groupDataId,
        this.tid,
        this.editInfo.intro,
        this.editInfo.icon
      )
      this.editSubscription = this.alumniService.updataGroupSubject.subscribe(res => {
        console.log(res);
        if (res.error_code === 0) {
          this._message.success('修改成功');
          this.isReadOnly = true;
        } else {
          this._message.warning(res.error_msg || '修改失败');
        }
        this.editSubscription.unsubscribe();
      })
    }
    cancel = () => {}

    // 提出群
    deleteMenber(data) {
      console.log(data);
      const menubar_id = data.id; // 被踢人id
      const tid = this.alumniService.groupTid; // 群id
      const uid = this.groupAdminId; // 群主id
      const id = this.groupDataId;  // 群数据id
      this.alumniService.deleteMember(
        menubar_id,
        tid,
        uid,
        id
      )
      this.delMemberSubscription = this.alumniService.MemberServiceSubject.subscribe(res => {
        if (res.delmsg === undefined) {
          return;
        }
        if (res.delmsg.error_code === 0) {
          this._message.success('删除成功');
          this.getMemberList()
        }
        this.delMemberSubscription.unsubscribe();
      })
    }

    // 获取成员列表
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
      this.detailsVisible = true;
      this.detailsData = data;
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
      this.delSubscription = this.alumniService.MemberServiceSubject.subscribe(res => {
        if (res.removemsg === undefined) {
          return;
        }
        if (res.removemsg.error_code === 0) {
          console.log(res);
          this._message.success('解散群成功');
          this.loadData()
        } else {
          this._message.warning(res.removemsg.error_msg);
        }
        this.delSubscription.unsubscribe();
      })
    }

    goAddMember() {
      this.router.navigate(['/index/addMember']);
    }

    memberAdmin() {
        this.isReadOnly = true;
    }
    handleCancel = (e) => {
        this.detailsVisible = false;
        this.showOwnerChangeFlag = false;
    }
    // 群主转让show
    showOwnerChange(data) {
      console.log(data);
      this.ChangeTid = data.tid;
      this.ChangeId = data.id;
      this.ChangeUid = data.uid;
      this.alumniService.ownerChangeListSubject();
      this.alumniService.OwnerChangeSubject.subscribe(res => {
        if (res.error_code === 0) {
          this.showOwnerList = res.result;
          this.showOwnerChangeFlag = true;
        } else {
          this._message.warning(res.error_msg);
        }
      })
    }

    // 群主选择
    changOwner(data) {
        this.ChangeNewowner = data.id;
    }
    changeSubmit() {
        if (!this.ChangeNewowner) {
          return;
        }
        this.alumniService.ownerSubmit(
          this.ChangeNewowner,
          this.ChangeTid,
          this.ChangeUid,
          this.ChangeId
        )
      this.ownerChangeSubscription = this.alumniService.OwnerChangeSubmitSubject.subscribe(res => {
        if (res.error_code === 0) {
          this._message.success('转让成功');
          this.loadData();
          this.showOwnerChangeFlag = false;
        } else {
          this._message.warning(res.error_msg);
        }
        this.ownerChangeSubscription.unsubscribe();
      })
    }
}
