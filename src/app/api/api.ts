import { Injectable } from '@angular/core';

@Injectable()

export class ApiModule {
    host: string;
    constructor () {
        // here is common api接口
        this.host = ''
    }
}
