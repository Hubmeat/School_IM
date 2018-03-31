
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
}
