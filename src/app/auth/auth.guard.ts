import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './login.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private routerService: Router
  ) {}

  canActivate() {
    // TODO https://stackoverflow.com/questions/42366316/using-behaviorsubject-in-auth-guards-canactivate
    return this.loginService.isConnected.pipe<boolean>(
      map(isLogged => {
        console.log(isLogged);
        console.log(this.loginService.isConnected);
        if (!isLogged && !this.routerService.isActive('/login', false)) {
          this.routerService.navigate(['/login']);
        }
        return isLogged;
      })
    );
  }
}
