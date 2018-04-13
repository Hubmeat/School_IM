import { Component, OnInit } from '@angular/core';
import { AMService } from '../alumniMgService/alumniMgService.component';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'auditRecord-component',
    templateUrl: './auditRecord.component.html',
    styleUrls: [
        './auditRecord.component.less'
    ]
})

export class AuditRecordCom implements OnInit {
    registerBeginTime = null;
    registeEndrTime = null;
    joinBeginTime = null;
    joinEndrTime = null;

    constructor(
        private alumniMgService: AMService,
        private _message: NzMessageService
    ) {
    }

    // 搜索数据
    userName:string = '';
    IDcard:string = '';
    phone:string = '';

    // 学院选项框
    collegeOptions = [];
    collegeSelected = '';
    // 学院选项框
    majorOptions = [];
    majorSelected = '';
    // 学历选项框
    educationOptions = [
        { value: '全部', label: '全部' },
        { value: '专科', label: '专科' },
        { value: '本科', label: '本科'},
        { value: '硕士', label: '硕士'},
        { value: '博士', label: '博士'}
    ];
    educationSelected = '';
    // 审核状态下拉框
    auditStatusOptions = [
        { value: null, label: '全部'},
        { value: 1, label: '审核通过'},
        { value: 2, label: '审核不通过'}
    ];
    auditStatusSelected = this.auditStatusOptions[0].value;

    // 表格数据
    data = [];
    spinShow:boolean = false;
    borderShow:boolean = false;
    currentPage = 1;
    totalPage = 0;

    // 用户资料model
    inforVisible:boolean = false;
    userInfo:any = {};
    modelStyle:any = {
        width: '600px'
    }
    // 审核model
    auditVisible:boolean = false;
    acceptLoading:boolean = false;
    rejectLoading:boolean = false;

    ngOnInit():any {
        // 初始化下拉列表数据与表格数据
        this.getCollegeSelectData()
        this.loadData()

    }

    loadData() {
        this.spinShow = true;
        console.log("'joinBeginTime", this.joinBeginTime);
        console.log("'joinBeginTime", this.joinBeginTime === null);
        console.log("'joinBeginTime", this.joinBeginTime === 'null');
        console.log("'joinEndrTime", this.joinEndrTime);
        this.alumniMgService.getPendingData(
            2,
            this.majorSelected,
            this.educationSelected,
            this.collegeSelected,
            this.registerBeginTime,
            this.registeEndrTime,
            this.joinBeginTime,
            this.joinEndrTime,
            this.userName,
            this.IDcard,
            this.phone,
            this.currentPage,
            this.auditStatusSelected
        );
        this.alumniMgService.WaitPendingSubject.subscribe(
            res => {
                this.spinShow = false;
                console.log('this is 订阅的数据', res)
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

    // 获取下拉列表数据
    getCollegeSelectData ():void {
        this.alumniMgService.getCollegeSelectData();
        this.alumniMgService.waitPendingOfSelectSubject.subscribe(
            res => {
                if (res.college) {
                    console.log('selected data', res)
                    if (res.college.error_code === 0) {
                        this.collegeOptions = res.college.result;
                    }
                }
            }
        )
    }

    geMojorData (value) {
        this.alumniMgService.getMajorSelectData(value);
        this.alumniMgService.waitPendingOfSelectSubject.subscribe(
            res => {
                if (res.major) {
                    if (res.major.error_code === 0) {
                        this.majorOptions = res.major.result;
                    }
                }
            }
        )
    }

    collegeChange (value) {
        this.geMojorData(this.collegeSelected)
    }
    // 搜索、分页方法

    currentPageChange (currentPage) {
        this.currentPage = currentPage;
        this.loadData ()
    }

    handlerSearch ():void {
        this.currentPage = 1;
        this.loadData()
    }

    // 审核资料展示 方法
    showInfoModal = (data) => {
        console.log('data', data)
        this.userInfo = Object.assign({}, data);
        this.inforVisible = true;
    }

    closeInforModel = () => {
        this.inforVisible = false;
    }

}
