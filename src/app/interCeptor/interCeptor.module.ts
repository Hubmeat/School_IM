import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
// thorw方法需要单独引入
import 'rxjs/add/observable/throw';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';

@Injectable()
export class NoopInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const clonedRequest = req.clone({
            // content-type 登录传输报错text
            headers: req.headers.set('Content-Type', 'application/json;charset=UTF-8')
        });
        // console.log("new headers", clonedRequest.headers.keys());
        return next.handle(clonedRequest)
            .mergeMap((event: any) => {
                // if (event instanceof HttpResponse) {
                //     return Observable.create(Observable => Observable.error(event));
                // }
                return Observable.create(Observable => Observable.next(event));
            })
            .catch((res: HttpResponse<any>) => {

                return Observable.throw(res);
            })
    }
}
