import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoginService } from '../login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.loginService.getAuthTokenPromise())
      .pipe(
        switchMap((token) => {
          const authReq = req.clone({
            headers: req.headers
              .set('authorization', `Bearer ${token}`)
          });
          return next.handle(authReq);
        }),
        catchError(error => next.handle(req))
      );
  }
}
