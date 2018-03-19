import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule, Routes } from '@angular/router';
import {HashLocationStrategy , LocationStrategy} from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/**
 * 第三方插件引入
 */
import * as $ from 'jquery';


/**
 * here is our components
 */
import { AppComponent } from './app.component';

// 公共组件模块
import { MenuComponent } from './publicComponents/menu/menu.component';
import { HeadComponent } from './publicComponents/head/head.component';
import { LoginComponent } from './login/login.component';
import {ForgetPasswordComponent} from './login/forgetPassword/forgetPassword.component';
import { NotFoundComponent } from './publicComponents/404NotFound/notFound-component';

// 导入事件中枢
import { AlumniManageModule } from './alumniManage/alumniManage.module';
import { SystemSetupModule } from './systemSetup/systemSetup.module';
/**
 * [============================   ******   ==================================]
 */

// 导入拦截器模块
import { NoopInterceptor } from './interCeptor/interCeptor.module';

// 导入host地址模块
import { ApiModule } from './api/api';

// 布局文件
import { NzDemoLayoutTopSide2Component } from './layout/layout.component';
// 导入自定义路由
import { appRoutes } from './baseRoutes/baseRoutes';
// 导入服务模块
import { publicService } from 'app/publicService/publicService.component';



@NgModule({
  declarations: [
    AppComponent,
    NzDemoLayoutTopSide2Component,
    MenuComponent,
    HeadComponent,
    LoginComponent,
    ForgetPasswordComponent,
    NotFoundComponent
  ],
  imports: [
    // EventAnalysisModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ],
  bootstrap: [AppComponent],
  providers: [publicService,
              {
                provide: LocationStrategy,
                useClass: HashLocationStrategy
              },
              {
                provide: HTTP_INTERCEPTORS,
                useClass: NoopInterceptor,
                multi: true,
              },
              ApiModule]
})
export class AppModule { }
