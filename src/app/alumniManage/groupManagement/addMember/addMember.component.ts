import { Component, OnInit } from '@angular/core';
import { AMService } from '../../alumniMgService/alumniMgService.component';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Subscription } from 'rxjs/Subscription';
import * as $ from 'jquery';
import {Router} from '@angular/router';

@Component({
    selector: 'addMember-component',
    templateUrl: './addMember.component.html',
    styleUrls: [
        './addMember.component.less'
    ]
})

export class AddMemberComponent implements OnInit {
    current = 0;
    current2 = 1;
    avatarUrl: string;
    groupName: string = ''; // 姓名
    groupPhone: string = ''; // 手机
    groupIntro:string = '';
    groupRemark:string = '';
    nextStepFlag:boolean = true;

    // nextStep data
    registerBeginTime = null;
    registeEndrTime = null;
    joinBeginTime = '';
    joinEndrTime = '';

    // 搜索数据
    userName:string = '';
    IDcard:string = '';
    phone:string = '';

    // 学院选项框
    collegeOptions = [];
    collegeSelected: any;
    // 专业选项框
    majorOptions = [];
    majorSelected: any;
    // 学历选项框
    educationOptions = [
        { value: '全部', label: '全部' },
        { value: '专科', label: '专科' },
        { value: '本科', label: '本科'},
        { value: '硕士', label: '硕士'},
        { value: '博士', label: '博士'}
    ];
    educationSelected = '';

    // 性别下拉框
    sexOptions = [
        { value: 0, label: '全部'},
        { value: 1, label: '男'},
        { value: 2, label: '女'}
    ]
    sexSelected = this.sexOptions[0].value;

    // 民族下拉框
    nationOptions = [ "汉族", "满族","壮族", "回族", "苗族", "维吾尔族", "土家族", "彝族", "蒙古族", "藏族", "布依族", "侗族", "瑶族", "朝鲜族", "白族", "哈尼族",
      "哈萨克族", "黎族", "傣族", "畲族", "傈僳族", "仡佬族", "东乡族", "高山族", "拉祜族", "水族", "佤族", "纳西族", "羌族", "土族", "仫佬族", "锡伯族",
      "柯尔克孜族", "达斡尔族", "景颇族", "毛南族", "撒拉族", "布朗族", "塔吉克族", "阿昌族", "普米族", "鄂温克族", "怒族", "京族", "基诺族", "德昂族", "保安族",
      "俄罗斯族", "裕固族", "乌孜别克族", "门巴族", "鄂伦春族", "独龙族", "塔塔尔族", "赫哲族", "珞巴族"];
    nationSelected: any;

    // 省市下拉框
    provinceOptions = [];
    provinceSelected = '';

    cityOptions = [];
    citySelectde = '';

    areaOptions = [];
    areaSelected = '';

    // 行业下拉框
    industryOptions = [];
    industrySelected: any;

    // 表格数据
    data = [];
    spinShow:boolean = false;
    borderShow:boolean = false;
    currentPage = 1;
    totalPage = 0;

    _allChecked = false;
    _indeterminate = false;
    _displayData = [];

    addMemberList = []; // 欲添加成员list
    addMemberListcheckedList = [];

    ownName;
    ownPer;


    constructor(
        private alumniMgService: AMService,
        private router: Router,
        private msg: NzMessageService
    ) {}

    ngOnInit():void {
      console.log(this.alumniMgService.groupTid)
      this.ownName = this.alumniMgService.ownName;
      this.ownPer = this.alumniMgService.ownPer;
      if (this.alumniMgService.groupTid === undefined) {
        this.router.navigate(['/index/groupManagement'])
        return;
      }
      this.getAddMemberList();
      this.getProvinceSelectData(); // 所在地
      this.getCollegeSelectData() // 学院
      this.getIndustryData(); // 行业
    }

    beforeUpload = (file: File) => {
      const isJPG = file.type === 'image/jpeg' || 'png' || 'jpg' || 'jpeg';
      if (!isJPG) {
        this.msg.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 5MB!');
      }
      return isJPG && isLt2M;
    }


    /**
     * 表格相关方法
     */


    loadData() {
        this.spinShow = true;

    }

    // 获取下拉列表数据
    getProvinceSelectData ():void {
      // 获取省市区列表内
      this.alumniMgService.getProvinceList();
      this.alumniMgService.provinceCodeSubject.subscribe(
        res => {
          if (res.province) {
            this.provinceOptions = res.province.result;
          }
        })
    }
    provinceChange(provinceCode) {
      this.alumniMgService.getCityList(provinceCode);
      this.alumniMgService.provinceCodeSubject.subscribe(
        res => {
          if (res.city) {
            this.cityOptions = res.city.result;
          }
        })
    }
    cityChange(cityCode) {
      this.alumniMgService.getareaList(cityCode);
      this.alumniMgService.provinceCodeSubject.subscribe(
        res => {
          if (res.area) {
            this.areaOptions = res.area.result;
          }
        })
    }
    // 学院专业
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
    // 行业
    getIndustryData():void {
      this.alumniMgService.getIndustryList();
      this.alumniMgService.industrySubject.subscribe(
        res => {
          if (res.error_code === 0) {
            this.industryOptions = res.result;
          } else {
            this.industryOptions = [];
          }
        }
      )
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
      console.log($event)
      // this._refreshStatus();
    }

    _refreshStatus(data, index) {
      const arrList = this.addMemberList;
      const allChecked = this._displayData.every(value => value.checked === true);
      const allUnChecked = this._displayData.every(value => !value.checked);
      this._allChecked = allChecked;
      this._indeterminate = (!allChecked) && (!allUnChecked);

      if (data.checked) {
        this.addMemberListcheckedList.push(data);
        this.addMemberListcheckedList = Array.from(new Set(this.addMemberListcheckedList)); // 去重
      } else {
        // for (let i in this.transferOptions) {
        for (let i = 0; i < this.addMemberListcheckedList.length; i++) {
          if (this.addMemberListcheckedList[i] === data) {
            this.addMemberListcheckedList.splice(i, 1)
          }
        }
      }
    }

    _checkAll(value) {
      if (value) {
        this.addMemberListcheckedList = [];
        this._displayData.forEach(data => {
          data.checked = true;
          this._allChecked = value;
          this.addMemberListcheckedList.push(data);
        });
      } else {
        this._displayData.forEach(data => {
          data.checked = false;
          this._allChecked = value;
          this.addMemberListcheckedList.splice(0, 1);
        });
      }
      this._indeterminate = false
    }

    deleteItem(index, item) {
      this.addMemberListcheckedList.splice(index, 1);
      for (let i in this.addMemberList) {
        if (this.addMemberList[i] === item) {
          this.addMemberList[i].checked = false;
          break;
        }
      }
      // this.addMemberList[index].checked = false;
      this._displayData.forEach(data => {
        if (data.checked === true) {
          this._indeterminate = true;
        } else {
          this._allChecked = false;
          this._indeterminate = false;
        }
      })
    }
    goback() {
        this.router.navigate(['/index/groupManagement']);
    }

    // 添加提交
    submitAddMember() {
      const addList = this.addMemberListcheckedList;
      if (addList.length < 1) {
        this.msg.warning('至少选择一位成员');
        return;
      } else {
        for (let i in addList) {
          addList[i] = addList[i].id;
        }
      }
      this.alumniMgService.postAddMemberList(
        addList,
        this.alumniMgService.groupTid,
        this.alumniMgService.groupUid,
        this.alumniMgService.groupId,
      )
      this.alumniMgService.MemberServiceSubject.subscribe(res => {
         if (res.postAddMember) {
           if (res.postAddMember.error_code === 0) {
             this.msg.success('添加成功');
             this.goback();
           } else {
             this.msg.warning(res.postAddMember.error_msg || '添加未成功')
           }
         }
      })
    }

    // 获取可添加成员列表
    getAddMemberList() {
      this._allChecked = false;
      this._indeterminate = false;
      this.addMemberListcheckedList = [];
      this.alumniMgService.getAddMemberDataList(
        this.alumniMgService.groupTid,
        this.educationSelected,
        this.currentPage,
        this.majorSelected,
        this.collegeSelected,
        this.joinBeginTime,
        this.joinEndrTime,
        this.groupName,
        this.groupPhone,
        this.provinceSelected,
        this.citySelectde,
        this.areaSelected,
        this.sexSelected,
        this.nationSelected,
        this.industrySelected
      )
      this.alumniMgService.MemberServiceSubject.subscribe(res => {
        if (res.addDataList) {
          console.log(res);
          this.addMemberList = res.addDataList.result;
          this.totalPage = res.addDataList.total_count;
        }

      })
    }
}
