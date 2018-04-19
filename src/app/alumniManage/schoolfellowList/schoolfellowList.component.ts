import { Component, OnInit } from '@angular/core';
import { AMService } from '../alumniMgService/alumniMgService.component';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import {Subscription} from 'rxjs/Subscription'
import { ResponseContentType } from '@angular/http';
import {HttpClient} from '@angular/common/http';

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
        { value: '', label: '全部' },
        { value: '专科', label: '专科' },
        { value: '本科', label: '本科'},
        { value: '硕士', label: '硕士'},
        { value: '博士', label: '博士'}
    ];
    educationSelected = '';
    // 审核状态下拉框
    accountOptions= [
        { value: null, label: '全部'},
        { value: 1, label: '正常'},
        { value: 2, label: '已冻结'}
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
    userInfo = {
      company_batch: []
    };
    userInfoVisible:boolean = false;
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

    // 编辑功能模块
    editSubscription: Subscription;
    modelStyle:any = {
        width: '1000px'
    }
    editFlag:boolean = false;
    sexOptions = [
        {
            label: '全部',
            value: 0
        }, {
            label: '男',
            value: 1
        }, {
            label: '女',
            value: 2
        }
    ];
    sexSelected = '';
    editCityOptions = []; // 编辑功能城市列表
    industroyOptions = []; // 行业下拉列表数据
    editComCityOptions = []; // 编辑 公司地址
    uploadSubscription: Subscription;
    recordInfo: any = false;
    isShowResult: boolean = false;
    upload: any = {
      success: 0,
      defeat: 0
    };
    schoolApi: any;
    unique_identification: string = '';

    constructor(
        private alumniMgService: AMService,
        private _message: NzMessageService
    ) {
        this.editSubscription = new Subscription();
    }

    ngOnInit():any {
        this.schoolApi = this.alumniMgService.schoolApi;
        // 初始化下拉列表数据与表格数据
        this.getCollegeSelectData()
        // 获取行业数据
        this.getIndustryData();
        this.loadData();

    }

    getIndustryData():void {
        this.alumniMgService.getIndustryList();
        this.alumniMgService.industrySubject.subscribe(
            res => {
                if (res.error_code === 0) {
                    this.industroyOptions = res.result;
                } else {
                    this.industroyOptions = [];
                }
            }
        )
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
            this.citySelectde,
            this.areaSelected
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
    areaChange(areacode) {
        this.alumniMgService.getareaList(areacode);
        this.alumniMgService.provinceCodeSubject.subscribe(res => {
          if (res.area) {
            this.areaOptions = res.area.result;
          }
        })
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
        this.geMojorData(value)
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
        this.editFlag = false;
        var id = data.id;
        this.alumniMgService.getSchoolFwDetail(id);
        this.alumniMgService.schoolFwDeatilSubject.subscribe(
            res => {
                if (res.error_code === 0) {
                    console.log('detail res', res)
                    this.userInfo = res.result;
                    // 开启调用city下拉框方法
                    this.editProvinceChange(res.result.province_code);
                    if (res.result.company_batch.length > 0) {
                      this.editCompanyProvinceChange(res.result.company_batch[0].area_code);
                    }
                    // 调用获取专业联动方法
                    this.geMojorData(res.result.academy_id);

                    this.userInfoVisible = true;
                }
            }
        )
    }

    closeInforModel = () => {
        this.userInfoVisible = false;
    }

    // 处理解冻与冻结
    handleFreeze (data) {
        if (data.c_data_state === 1) {
            this.alumniMgService.dealFreeze(data.id, 2);
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
    deleteLivecancel() {
      // this.isDetailsModal = false;
    }


    downloadTemplate() {

    }

    closeUploadModel() {
        this.uploadVisible = true;
    }

    openUploadModel() {
        this.uploadVisible = true;
    }
    handleCancel = (e) => {
      this.isShowResult = false;
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
                    // window.open(res.url);
                  const ifram = window.document.getElementById('ifile');
                  ifram.setAttribute('src', res.url)
                } else {
                    this._message.error('导出失败')
                }
                this.exportSubscbscription.unsubscribe()
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
            formData.append('unique_identification', file.uid);
            formData.append('header_index', '1');
            formData.append('file', file);
            this.unique_identification = file.uid;
        });
        console.log('formData', formData)
        this.alumniMgService.uploadFileList(formData);
        this.uploadSubscription = this.alumniMgService.uploadSubject.subscribe(res => {
          var timer = setInterval( () => {
            this.progressValue += 5;
            if (this.progressValue >= 100) {
              clearInterval(timer);
              if (res.error_code === 0) {
                this.upload = res.return;
                this._message.success('上传成功！')
              }
              this.progressFlag = false;
              this.progressValue = 0;
              this.fileList = [];
              setTimeout( () => {
                this.uploadVisible = false;
                this.loadData()
                this.isShowResult = true;
              }, 1500)
              this.uploadSubscription.unsubscribe();
            }
          }, 50)
        })

    }

    // 编辑功能
    openEdit ():void {
        this.editFlag = true;
    }

    cancelEdit ():void {
        this.editFlag = false;
        this.loadData();
    }

    saveEdit ():void {
        this.editFlag = true;
        this.alumniMgService.updatedSchoolFw(this.userInfo);
        this.editSubscription = this.alumniMgService.schoolFwEditSubject.subscribe(
            res => {
                if (res.error_code === 0) {
                    this._message.success('修改成功')
                    this.editFlag = false;
                    this.editSubscription.unsubscribe();
                } else {
                    this._message.success('修改失败')
                }
            }
        )
    }

    editProvinceChange (id):void {
        this.alumniMgService.getCityList(id);
        this.alumniMgService.provinceCodeSubject.subscribe(
            res => {
                if (res.city) {
                    console.log('hhh res', res)
                    this.editCityOptions = res.city.result;
                }
            }
        )
    }

    editCompanyProvinceChange(id):void {
        this.alumniMgService.getCityList(id);
        this.alumniMgService.provinceCodeSubject.subscribe(
            res => {
                if (res.city) {
                    this.editComCityOptions = res.city.result;
                }
            }
        )
    }

  getDownRecord() {
    $("#downloadform").remove();
    var form = $("<form>"); // 定义一个form表单
    form.attr("id", "downloadform");
    form.attr("style", "display:none");
    form.attr("target", "");
    form.attr("method", "post");
    form.attr("unique_identification", this.unique_identification);
    form.attr("action", this.alumniMgService.RecordApi);
    var input1 = $("<input>");
    input1.attr("type", "hidden");
    input1.attr("name", "fileName");
    input1.attr("value", "threeBody.txt");
    form.append(input1);
    $("body").append(form); // 将表单放置在web中
    form.submit(); // 表单提交
  }
}
