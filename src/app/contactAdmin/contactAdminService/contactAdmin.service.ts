
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/retry';
import {ApiModule} from '../../api/api';

@Injectable()

export class ContactAdminService {
  constructor(
    private $HOST: ApiModule,
    private $http: HttpClient
  ) {
  }

  public chatDataSubject = new Subject<any>();

  public getChatData():void {
    this.$http
    .post(this.$HOST.host + '/a/connect/manager', {})
    .subscribe(
        res => {
            this.chatDataSubject.next(res)
        },
        err => {
            this.chatDataSubject.next(err)
        }
    )
  }
}
