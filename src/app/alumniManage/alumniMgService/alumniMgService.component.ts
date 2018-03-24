
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiModule } from '../../api/api';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/retry';
import * as moment from 'moment';

@Injectable()

export class AMService {    
    constructor (
        private $HOST: ApiModule,
        private $http: HttpClient
    ) {
        
    }

    public WaitPendingSubject = new Subject<any>();

    public getPendingData():void {
        var formData = {
            "list_type": 1,
            "education": "专科",
            "page": 1,
            "profession_id": 1705616188964869,
            "academy_id": 1705577148383233,
            "registe_start": 1521724069159,
            "registe_end": 1521724069159,
            "academic_start": 1521705972777,
            "academic_end": 1521705972777,
            "user_name": "小明",
            "id_number": "140332122333233321",
            "contact_phone": "18333608366",
            "examine_state": 1
        };

        this.$http
            .post(this.$HOST.host + '/a/user/examinelist', formData)
            .subscribe(
                res => {
                    this.WaitPendingSubject.next(res)
                },
                err => {
                    this.WaitPendingSubject.next(err)
                }
            )
    }
}