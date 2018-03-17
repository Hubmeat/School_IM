import { Component, OnInit, OnChanges } from '@angular/core';
import { publicService } from 'app/publicService/publicService.component';


/**
 * 第三方插件引入
 */
import * as $ from 'jquery';

@Component({
    selector: 'menu-component',
    templateUrl: './menu.component.html',
    styleUrls: [
        './menu.component.less'
    ]
})

export class MenuComponent implements OnInit, OnChanges  {
    service2: any
    constructor(private service: publicService) {
        this.service2 = service
    }

    toggleCollapsed (name) {
        console.log(name) 
    }

    openChange (name) {
        console.log(name)
        window.localStorage.setItem('openSign', name)

        var sign = window.localStorage.getItem('openSign')
        if (sign === 'eventOpen') {
            this.service.eventOpen = true
            this.service.wayOpen = false
            this.service.reportOpen = false
        }

        if (sign === 'wayOpen') {
            this.service.eventOpen = false
            this.service.wayOpen = true
            this.service.reportOpen = false
        }

        if (sign === 'reportOpen') {
            this.service.eventOpen = false
            this.service.wayOpen = false
            this.service.reportOpen = true
        }      
    }

    ngOnInit () {
        if (window.localStorage.getItem('openSign') === null) {
            window.localStorage.setItem('openSign', 'eventOpen')
        } else {
            var sign = window.localStorage.getItem('openSign')
            this.service[sign] = true
        }

        // var allItem = $('#menuSignss').children().children()
        // var menuGroup = $('#oneFloor .secondFloor li.menuSign')
        // var menuGroup = $('#oneFloor')
        // var menuGroup = $();
        // console.log('menuGroup', menuGroup);
        // for (var i = 0; i < allItem.length; i++) {
        //     var nowRouter = this.service.routeSign
        //     var res = allItem.indexOf(nowRouter)
        // }
    }

    ngOnChanges ():void {
    }

}