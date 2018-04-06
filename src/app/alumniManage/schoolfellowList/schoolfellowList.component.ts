import { Component, OnInit } from '@angular/core';
import { AMService } from '../alumniMgService/alumniMgService.component';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import {Subscription} from 'rxjs/Subscription'

@Component({
    selector: 'schoolfellow-component',
    templateUrl: './schoolfellowList.component.html',
    styleUrls: [
        './schoolfellowList.component.less'
    ]
})

export class SchoolfellowListCom implements OnInit {
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
    accountOptions= [
        { value: '0', label: '全部'},
        { value: '1', label: '正常'},
        { value: '2', label: '已冻结'}
    ];
    accountSelected = this.accountOptions[0].value;

    // 省市下拉框
    provinceOptions = [];
    provinceSelected = '';

    cityOptions = [];
    citySelectde = '';

    areaOptions = [];
    areaSelected = '';

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
        width: '700px'
    }
    // 审核model
    auditVisible:boolean = false;
    acceptLoading:boolean = false;
    rejectLoading:boolean = false;

    // 下载model
    uploadVisible:boolean = false;
    downLoading:boolean = false;

    handFreezeSubscription: Subscription;
    exportSubscbscription: Subscription;

    // 上传model
    fileList: UploadFile[] = [];
    progressFlag:boolean = false;

    progressValue:number = 0;

    ngOnInit():any {
        // 初始化下拉列表数据与表格数据
        this.getCollegeSelectData()
        this.loadData()

    }

    loadData() {
        this.spinShow = true;
        this.alumniMgService.getSchoolFwData(
            this.educationSelected,
            this.currentPage,
            this.majorSelected,
            this.collegeSelected,
            this.registerBeginTime,
            this.registeEndrTime,
            this.joinBeginTime,
            this.joinEndrTime,
            this.userName,
            this.IDcard,
            this.phone,
            this.accountSelected,
            this.provinceSelected,
            this.citySelectde
        );
        this.alumniMgService.schoolFWSubject.subscribe(
            res => {
                console.log('scres', res);
                this.spinShow = false;
                if (res.error_code === 0) {
                    this.data = res.result;
                    this.totalPage = res.total_count;
                } else {
                    this.data = [];
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

        // 获取省市区列表内
        this.alumniMgService.getProvinceList();
        this.alumniMgService.provinceCodeSubject.subscribe(
            res => {
                if (res.province) {
                    this.provinceOptions = res.province.result;
                }
            }
        )
    }

    provinceChange(provinceCode) {
        this.alumniMgService.getCityList(provinceCode);
        this.alumniMgService.provinceCodeSubject.subscribe(
            res => {
                if (res.city) {
                    this.cityOptions = res.city.result;
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
        this.auditVisible = true;
    }

    closeInforModel = () => {
        this.auditVisible = false;
    }

    // 处理解冻与冻结
    handleFreeze (data) {
        if (data.c_data_state === 1) {
            this.alumniMgService.dealFreeze(data.id, 0);
            this.handFreezeSubscription = this.alumniMgService.handleFreezeSubject.subscribe(
                res => {
                    if (res.error_code === 0) {
                        this._message.success('账号冻结成功！');
                        this.handFreezeSubscription.unsubscribe()
                        this.loadData();
                    }
                }
            )
        } else {
            this.alumniMgService.dealFreeze(data.id, 1);
            this.handFreezeSubscription = this.alumniMgService.handleFreezeSubject.subscribe(
                res => {
                    if (res.error_code === 0) {
                        this._message.success('账号解冻成功！');
                        this.handFreezeSubscription.unsubscribe()
                        this.loadData();
                    }
                }
            )

        }

    }
    closeAuditModel = () => {

    }


    downloadTemplate() {
        
    }

    closeUploadModel() {
        this.uploadVisible = false;
    }

    openUploadModel() {
        this.uploadVisible = true;
    } 

    exportWay () {
        this.alumniMgService.exportData(
            this.educationSelected,
            this.currentPage,
            this.majorSelected,
            this.collegeSelected,
            this.registerBeginTime,
            this.registeEndrTime,
            this.joinBeginTime,
            this.joinEndrTime,
            this.userName,
            this.IDcard,
            this.phone,
            this.accountSelected,
            this.provinceSelected,
            this.citySelectde
        );
        this.exportSubscbscription = this.alumniMgService.exportSubject.subscribe(
            res => {
                console.log('导出', res);
                if (res.status === 200) {
                    this._message.success('导出成功！')
                    window.open(res.url);
                    this.exportSubscbscription.unsubscribe()
                } else {
                    this._message.error('导出失败')
                    this.exportSubscbscription.unsubscribe()
                }
            }
        )
    }

    beforeUpload = (file: UploadFile): boolean => {
        console.log('file', file);
        this.fileList.push(file);
        console.log('fileList', this.fileList)
        return false;
    }
    
    handleUpload() {
        const formData = new FormData();
        this.progressFlag = true;
        this.fileList.forEach((file: any) => {
            console.log('file', file);
            this.alumniMgService.uploadFileList(this.fileList[0].uid, this.fileList[0]);
            var timer = setInterval( () => {
                this.progressValue += 5;
                if (this.progressValue >= 100) {
                    this.alumniMgService.uploadSubject.subscribe(
                        res => {
                            if (res.error_code) {

                            }
                        }
                    )
                    this.progressFlag = false;
                    this.progressValue = 0;
                    clearInterval(timer);
                    this._message.success('上传成功！')
                    this.fileList = [];
                    setTimeout( () => {
                        this.uploadVisible = false;
                    }, 1500)
                }
            }, 50)
            formData.append('files[]', file);
        });
    }
}
