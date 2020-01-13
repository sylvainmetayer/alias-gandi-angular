import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {LoginService} from './login.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService,
              private routerService: Router) {
  }

  canActivate() {
    return this.loginService.isConnected.pipe<boolean>(
      map((isLogged) => {
        console.log(isLogged);
        if (!isLogged) {
          this.routerService.navigate(['/login']);
        }
        return isLogged;
      })
    );
  }
}
