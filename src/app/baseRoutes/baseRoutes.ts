import { AppComponent } from '../app.component'
import { NzDemoLayoutTopSide2Component } from '../layout/layout.component';
//  事件案例分析模块
// import { EventAanlysisComponent } from '../alumniManage/eventAanlysis/eventAanlysis.component';

// 登录模块路由
import { LoginComponent } from '../login/login.component';

// 404页面
import { NotFoundComponent } from '../publicComponents/404NotFound/notFound-component';
import {DataSettingModule} from '../dataSetting/dataSetting.module';
import {LiveAdministrationModule} from '../liveAdministration/liveAdministration.module';
import {ForgetPasswordComponent} from '../login/forgetPassword/forgetPassword.component';
import {NoticeAdministrationModule} from '../noticeAdministration/noticeAdministration.module';
import {ContactAdminModule} from '../contactAdmin/contactAdmin.module';


export const appRoutes = [
    //  事件案例分析模块
    {
        path: 'index',
        component: NzDemoLayoutTopSide2Component,
        children: [
            {
                path: '',
                loadChildren: './alumniManage/alumniManage.module#AlumniManageModule'
                // {
                    // path: 'eventAnalysis',
                    // component: EventAanlysisComponent
                // }
            },
            {
              path: '',
              loadChildren: './liveAdministration/liveAdministration.module#LiveAdministrationModule'
            },
            {
              path: '',
              loadChildren: './dataSetting/dataSetting.module#DataSettingModule'
            },
            {
              path: '',
              loadChildren: './systemSetup/systemSetup.module#SystemSetupModule'
            },
            {
              path: '',
              loadChildren: './noticeAdministration/noticeAdministration.module#NoticeAdministrationModule'
            },
            {
              path: '',
              loadChildren: './contactAdmin/contactAdmin.module#ContactAdminModule'
            }
        ]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
      path: 'forgetPassword',
      component: ForgetPasswordComponent
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: '**',
        component: NotFoundComponent
    }
]
