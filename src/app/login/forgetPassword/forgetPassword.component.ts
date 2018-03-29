import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'forgetPassword-component',
  templateUrl: './forgetPassword.component.html',
  styleUrls: [
    './forgetPassword.component.less'
  ]
})

export class ForgetPasswordComponent implements OnInit {
  username: '';
  validateCode: '';
  isPasswordTrue
  _isSpinning
  isUserTrue
  constructor(
    private router: Router,
    private _message: NzMessageService
  ) {}
  ngOnInit() {

  }
  focusPass() {}
  focusUser(){}
  submit() {
    this.router.navigate(['/login'])
    this._message.success(`重置成功!`);
  }
}
