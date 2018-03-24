import { Component, OnInit, DoCheck } from '@angular/core';
import { AMService } from '../alumniMgService/alumniMgService.component';
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'waitPending-component',
    templateUrl: './waitPending.component.html',
    styleUrls: [
        './waitPending.component.less'
    ]
})

export class WaitPendingComponent implements OnInit {
    registerBeginTime = null;
    registeEndrTime = null;
    joinBeginTime = null;
    joinEndrTime = null;

    constructor(
        private alumniMgService: AMService
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
            1,
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
            this.currentPage
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

    
    showInfoModal = (data) => {
        console.log('data', data)
        this.userInfo = Object.assign({}, data);
        this.inforVisible = true;
    }

    closeInforModel = () => {
        this.inforVisible = false;
    }

    currentPageChange (currentPage) {
        this.currentPage = currentPage;
        this.loadData ()
    }

    handlerSearch ():void {
        this.currentPage = 1;
        this.loadData()
    }

}
