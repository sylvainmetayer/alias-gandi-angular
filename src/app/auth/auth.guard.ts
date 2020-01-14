import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './login.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private routerService: Router
  ) { }

  canActivate(): Observable<boolean> {
    return this.loginService.isConnected.pipe<boolean>(
      map(isLogged => {
        if (!isLogged) {
          this.routerService.navigate(['/login']);
        }
        return isLogged;
      })
    );
  }
}
