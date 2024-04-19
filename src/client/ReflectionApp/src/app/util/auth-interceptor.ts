import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, of, throwError } from "rxjs";


/**
 * 認証エラーが返ってきた場合、Loginページに飛ばす処理
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router){
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((er, caught)=>{
                console.info('AuthInterceptor Http Chatch', er, caught);
                console.info(er.status)
                if(er.status == 401){

                    console.info('Auth Error. jump to login page');
                    this.router.navigate(['/login'])
                }
                return throwError(()=>er);
            }),
        );
    }
}
