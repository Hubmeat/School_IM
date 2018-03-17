import {  Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { publicService } from 'app/publicService/publicService.component';

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
    role: string;
    email: string;  
    // options = [
    //     { value: 'jack', label: 'Jack' },
    //     { value: 'lucy', label: 'Lucy' },
    //     { value: 'disabled', label: 'Disabled', disabled: true }
    // ];

    constructor(
        private service: publicService,
        private router: Router
    ) {}

    ngOnInit ():void {

    }

    toggleCollapsed() {
        console.log('isCollapsed', this.isCollapsed)
        this.isCollapsed = !this.isCollapsed;
        this.service.status = this.isCollapsed;
    }


    signOut ():void {
        this.router.navigate(['/login']);
    }


}