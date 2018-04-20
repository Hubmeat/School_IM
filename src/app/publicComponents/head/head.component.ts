import {  Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { publicService } from 'app/publicService/publicService.component';
import {NzMessageService} from 'ng-zorro-antd';
import {Subscription} from 'rxjs/Subscription'

@Component({
    selector: 'head-component',
    templateUrl: './head.component.html',
    styleUrls: [
        './head.component.less'
    ]
})

export class HeadComponent implements OnInit {
    isCollapsed = false;
    userName: string;
    uid;
    role: string;
    email: string;
    // options = [
    //     { value: 'jack', label: 'Jack' },
    //     { value: 'lucy', label: 'Lucy' },
    //     { value: 'disabled', label: 'Disabled', disabled: true }
    // ];
    editSubscription: Subscription;
    isVisible: boolean = false;
    oldPassword: any;
    newPassword: any;
    repeatPassword: any;

    constructor(
        private service: publicService,
        private _message: NzMessageService,
        private router: Router
    ) {}

    ngOnInit (): void {
      this.userName = window.localStorage.getItem('userName')
      this.uid = window.localStorage.getItem('uid')
    }

    toggleCollapsed() {
        console.log('isCollapsed', this.isCollapsed)
        this.isCollapsed = !this.isCollapsed;
        this.service.status = this.isCollapsed;
    }


    signOut (): void {
        this.router.navigate(['/login']);
    }

    editPass() {
      const flag = this.checkPass();
      if (!flag) {
        return
      }
      this.service.editPassword(
        this.uid,
        this.oldPassword,
        this.newPassword
      );
      this.editSubscription = this.service.EditPasswordSubject.subscribe(res => {
        if (res.error_code === 0) {
          this._message.success('修改成功');
          this.editSubscription.unsubscribe();
        } else {
          this._message.warning(res.code_msg);
        }
        this.editSubscription.unsubscribe();
      })
    }

    checkPass() {
      if (this.oldPassword !== this.newPassword) {
        this._message.warning('密码不一致');
        return false;
      } else {
        return true;
      }
    }
    showModal = () => {
      this.isVisible = true;
    }
    handleCancel = (e) => {
      this.isVisible = false;
    }
}
