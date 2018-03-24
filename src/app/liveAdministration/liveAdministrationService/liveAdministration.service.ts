import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiModule } from '../../api/api';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/retry';

@Injectable()

export class LiveAdministrationService {
    constructor(
      private $HOST: ApiModule,
      private $http: HttpClient
    ) {}

    public LivePreviewSubject = new Subject<any>();

}
