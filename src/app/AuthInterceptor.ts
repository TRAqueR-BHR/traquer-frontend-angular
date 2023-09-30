import {Injectable, Injector} from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Utils } from './util/utils';

// https://angular-academy.com/angular-jwt/
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

 intercept(req: HttpRequest<any>,
     next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken = localStorage.getItem(environment.jwt_name);
    const cryptPwd = localStorage.getItem(environment.cryptPwdLocalStorageKey)!;

    // console.log(`cryptPwd[${cryptPwd}]`);
    if (idToken && cryptPwd) {
        // console.log(req.headers);
        let cloned = req.clone({
            // The header key must be lower case (authorization not Authorization)
            //   because haproxy makes everything lower case
            headers: req.headers.append("authorization",
                                        "Bearer " + idToken)
                                .append("browser-timezone",
                                    Utils.getBrowserTimezone())
                                .append(environment.cryptPwdHttpHeaderKey,
                                        cryptPwd)
        });
        // console.log(cloned);
        return next.handle(cloned);
    }
    else if (idToken) {
        let cloned = req.clone({
            // The header key must be lower case (authorization not Authorization)
            //   because haproxy makes everything lower case
            headers: req.headers.append("authorization",
                                        "Bearer " + idToken)
        });
        console.log(cloned);
        return next.handle(cloned);
    }
    else {
        return next.handle(req);
    }
}

}
