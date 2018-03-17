import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiModule } from '../api/api';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'login-component',
    templateUrl: './login.component.html',
    styleUrls: [
        './login.component.less'
    ]
})

export class LoginComponent implements OnInit {
    _isSpinning: Boolean;
    isUserTrue = true;
    isPasswordTrue = true;
    errFlag: Boolean = true;
    userInfo = {
        username: '',
        password: ''
    }

    constructor (private router:Router,
                 private _message: NzMessageService
                ) {
    }

    ngOnInit() {

    }


    login () {
        this._isSpinning = false;
        this.router.navigate(['index/waitPending'])
        this._message.success(`登录成功!`);
    }

    focusUser(){
        this.isUserTrue = true;
    }

    focusPass(){
        this.isPasswordTrue = true;
    }
}
