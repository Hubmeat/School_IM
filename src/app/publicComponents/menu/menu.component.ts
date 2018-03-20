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
    // 校友管理
    alumniManagementList: any = [
      {
        name: '待审核',
        url: '/index/waitPending',
        active: false
      },
      {
        name: '审核记录',
        url: '/index/',
        active: false
      },
      {
        name: '校友记录',
        url: '/index/',
        active: false
      },
      {
        name: '群组管理',
        url: '/index/',
        active: false
      },
    ];
    // 联系管理员
    contactAdmin: any = [
      {
        name: '消息管理',
        url: '/index/',
        active: false
      }
    ];
    // 公告管理
    noticeAdministration: any = [
      {
        name: '公告管理',
        url: '/index/noticeAdmin',
        active: false
      }
    ];
    // 直播管理
    liveAdministration: any = [
      {
        name: '直播预告',
        url: '/index/livePreview',
        active: false
      },
      {
        name: '直播列表',
        url: '/index/liveList',
        active: false
      }
    ];
    // 资料设置
    dataSetting: any = [
      {
        name: '院系设置',
        url: '/index/departmentsSetup',
        active: false
      },
      {
        name: '行业设置',
        url: '/index/industrySetup',
        active: false
      }
    ];
    // 系统设置
    systemSetup: any = [
      {
        name: '帐号管理',
        url: '/index/accountManagement',
        active: false
      }
    ];
    service2: any;
    constructor(private service: publicService) {
        this.service2 = service
    }

    toggleCollapsed (name) {
        console.log(name)
    }

    openChange (name) {
        console.log(name)
        window.localStorage.setItem('openSign', name)

        const sign = window.localStorage.getItem('openSign')
        if (sign === 'alumniManagementListOpen') {
          this.service.alumniManagementListOpen = true;
          this.service.contactAdminOpen = false;
          this.service.noticeAdministrationOpen = false;
          this.service.liveAdministrationOpen = false;
          this.service.dataSettingOpen = false;
          this.service.systemSetupOpen = false;
        }

        if (sign === 'contactAdminOpen') {
          this.service.alumniManagementListOpen = false;
          this.service.contactAdminOpen = true;
          this.service.noticeAdministrationOpen = false;
          this.service.liveAdministrationOpen = false;
          this.service.dataSettingOpen = false;
          this.service.systemSetupOpen = false;
        }

        if (sign === 'noticeAdministrationOpen') {
          this.service.alumniManagementListOpen = false;
          this.service.contactAdminOpen = false;
          this.service.noticeAdministrationOpen = true;
          this.service.liveAdministrationOpen = false;
          this.service.dataSettingOpen = false;
          this.service.systemSetupOpen = false;
        }
        if (sign === 'liveAdministrationOpen') {
          this.service.alumniManagementListOpen = false;
          this.service.contactAdminOpen = false;
          this.service.noticeAdministrationOpen = false;
          this.service.liveAdministrationOpen = true;
          this.service.dataSettingOpen = false;
          this.service.systemSetupOpen = false;
        }
        if (sign === 'dataSettingOpen') {
          this.service.alumniManagementListOpen = false;
          this.service.contactAdminOpen = false;
          this.service.noticeAdministrationOpen = false;
          this.service.liveAdministrationOpen = false;
          this.service.dataSettingOpen = true;
          this.service.systemSetupOpen = false;
        }
        if (sign === 'systemSetupOpen') {
          this.service.alumniManagementListOpen = false;
          this.service.contactAdminOpen = false;
          this.service.noticeAdministrationOpen = false;
          this.service.liveAdministrationOpen = false;
          this.service.dataSettingOpen = false;
          this.service.systemSetupOpen = true;
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
