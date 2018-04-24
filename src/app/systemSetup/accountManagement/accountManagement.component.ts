import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {SystemSetupService} from '../systemSetupService/systemSetup.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Subscription} from 'rxjs/Subscription'


@Component({
  selector: 'accountManagement-component',
  templateUrl: './accountManagement.component.html',
  styleUrls: [
    './accountManagement.component.less'
  ]
})

export class AccountManagementComponent implements OnInit {
  UserName: string = '';
  newUserPassword: string = '';
  repeatPassword: string = '';

  page = 1;
  totalPage = 0;
  user_name = '';
  contact_phone = '';
  a_data_state = '';

  stateSubscription: Subscription;
  editPassWordSubscription: Subscription;
  dataList = {};
  isShowTable: boolean = true;

  state: number;

  userPhone: string = '';
  firstPassword: string = '';
  lastPassword: string = '';
  radioState: string = 'start';
  selectedOption;
  newUserName
  uid


  _dataSet: any = [];
  options: any = [
    {
      label: '全部',
      option: false,
      a_data_state: '',
      disabled: false
    },
    {
      label: '可用',
      option: true,
      a_data_state: 1,
      disabled: false
    },
    {
      label: '不可用',
      option: false,
      a_data_state: 2,
      disabled: false
    }
  ]
  isVisible = false;
  showOwnerFlag: boolean = false;
  showOwnerList: any = [];

  constructor(
    private service: SystemSetupService,
    private _message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.service.editFlag = false;
    this.loadData()
  }
  loadData() {
    this.service.getListData(
      this.page,
      this.user_name,
      this.contact_phone,
      this.selectedOption
    )
    this.service.SystemListDataSubject.subscribe(res => {
      console.log(res);
      if (res.dataList === undefined) {
        return;
      }
      if (res.dataList.error_code === 0) {
        this._dataSet = res.dataList.result;
        this.totalPage = res.dataList.total_count;
        if (this._dataSet.length < 0) {
          this.isShowTable = false;
        }
      }
    })
  }


  showModal = (username, uid) => {
    this.UserName = username;
    this.uid = uid;
    this.newUserPassword = '';
    this.repeatPassword = '';
    this.isVisible = true;

  }
  // 重置密码
  handleOk = () => {
    if (this.newUserPassword === '' || this.repeatPassword === '') {
      this._message.warning('密码不能为空');
    }
    if (this.newUserPassword !== this.repeatPassword) {
      this._message.warning('请输入相同密码');
      return;
    }
    this.service.resetPassword(
      this.uid,
      this.newUserPassword
    )
    this.editPassWordSubscription = this.service.SystemResetPasswordSubject.subscribe(res => {
        if (res.editpassword === undefined) {
          return;
        }
        if (res.editpassword.error_code === 0) {
          this._message.success('修改成功');
          this.isVisible = false;
          this.editPassWordSubscription.unsubscribe();
        }else {
          this._message.warning(res.editpassword.error_msg);
          this.editPassWordSubscription.unsubscribe();
        }
    })
  }

  // 切换帐号状态
  toggle(id, state) {
    this.state = state === 1 ? 2 : 1;
    this.service.toggleAccounts(id, this.state);
    this.stateSubscription = this.service.SystemListDataSubject.subscribe(res => {
      console.log(res);
      if (res.state === undefined) {
        return;
      }
      if (res.state.error_code === 0) {
        if (res.state.is_owner === 1) {
          this.showOwnerList = res.state.result;
          this.showOwnerFlag = true;
        } else {
          this.loadData()
        }
        this.stateSubscription.unsubscribe();
      }
    })
  }

  // 编辑
  editData(id, username, state, contact_phone) {
    this.service.editFlag = true;
    this.service.editData.id = id;
    this.service.editData.username = username;
    this.service.editData.state = state;
    this.service.editData.contact_phone = contact_phone;
    this.router.navigate(['/index/addNewUser']);
  }

  pageChange(page) {
    console.log(page)
    this.page = page;
    this.loadData();
  }

  handleCancel = (e) => {
    console.log(e);
    this.isVisible = false;
    this.showOwnerFlag = false;
  }
  _console() {
    // ..
  }
}
