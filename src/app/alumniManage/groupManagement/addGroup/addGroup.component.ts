import { Component, OnInit } from '@angular/core';
import { AMService } from '../../alumniMgService/alumniMgService.component';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Subscription } from 'rxjs/Subscription';
import * as $ from 'jquery';
import {Router} from '@angular/router';

@Component({
    selector: 'addGroup-component',
    templateUrl: './addGroup.component.html',
    styleUrls: [
        './addGroup.component.less'
    ]
})

export class AddGroupCom implements OnInit {
    current = 0;
    current2 = 1;
    avatarUrl: string;
    groupName: string = '';
    groupIntro:string = '';
    groupRemark:string = '';
    nextStepFlag:boolean = true;

    // nextStep data
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
        { value: '全部', label: '全部' },
        { value: '专科', label: '专科' },
        { value: '本科', label: '本科'},
        { value: '硕士', label: '硕士'},
        { value: '博士', label: '博士'}
    ];
    educationSelected = '';
    // 审核状态下拉框
    industryOptions= [
        { value: '0', label: '全部'},
        { value: '1', label: '正常'},
        { value: '2', label: '已冻结'}
    ];
    industrySelected = this.industryOptions[0].value;

    // 性别下拉框
    sexOptions = [
        { value: '0', label: '全部'},
        { value: '1', label: '男'},
        { value: '2', label: '女'}
    ]
    sexSelected = this.sexOptions[0].value;

    // 民族下拉框
    nationOptions = [];
    nationSelected = '';

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

    _allChecked = false;
    _indeterminate = false;
    _displayData = [];


    constructor(
        private alumniMgService: AMService,
        private router: Router,
        private msg: NzMessageService
    ) {}

    ngOnInit():void {
        // $('.two_step').hide()
    }

    beforeUpload = (file: File) => {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.msg.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
      }
      return isJPG && isLt2M;
    }

    private getBase64(img: File, callback: (img: any) => void) {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    }

    handleChange(info: { file: UploadFile }) {
      if (info.file.status === 'uploading') {
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        this.getBase64(info.file.originFileObj, (img: any) => {
          this.avatarUrl = img;
        });
      }
    }

    nextStep():void {
        this.nextStepFlag = false;
        console.log('this.groupIntro', this.groupIntro)
    }

    lastStep():void {
        this.nextStepFlag = true;
    }

    completeAdd():void {

    }

    /**
     * 表格相关方法
     */


    loadData() {
        this.spinShow = true;
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

    _displayDataChange($event) {
        this._displayData = $event;
        this._refreshStatus();
      }

    _refreshStatus() {
    const allChecked = this._displayData.every(value => value.checked === true);
    const allUnChecked = this._displayData.every(value => !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
    }

    _checkAll(value) {
        if (value) {
            this._displayData.forEach(data => {
            data.checked = true;
            });
        } else {
            this._displayData.forEach(data => {
            data.checked = false;
            });
        }
        this._refreshStatus();
    }
    goback() {
        this.router.navigate(['/index/groupManagement']);
    }
}
