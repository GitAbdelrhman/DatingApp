import {  Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorEnterceptor   implements HttpInterceptor {
    intercept(req: HttpRequest<any> , next: HttpHandler ): Observable<HttpEvent<any>> {
return next.handle(req).pipe(
    catchError(error => {
        if (error instanceof HttpErrorResponse ) {
            if( error.status === 401 ) {
                return throwError(error.statusText);
            }
            const applcationError = error.headers.get('Applcation-Error');
            if (applcationError) {
                console.error(applcationError);
                return throwError(applcationError);
            }
            const serverError = error.error.errors;
            let modelStateErrr = '';
            if  (serverError && typeof serverError === 'object') {
                for (const key in serverError ) {
                    if(serverError[key]) {
                        modelStateErrr += serverError[key] + '\n';
                    }
                }
            }
            return throwError(modelStateErrr || serverError || 'ServerError');
        }
    })
    );
    }
}

export const errorInterceptorProvide = {
    provide : HTTP_INTERCEPTORS,
    useClass : ErrorEnterceptor,
    multi : true
};

