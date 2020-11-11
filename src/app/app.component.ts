import { Component, OnInit } from '@angular/core';
import { LoginService } from './auth/login.service';
import { Router } from '@angular/router';
import { AliasApiService } from './alias-api/alias-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private api: AliasApiService
  ) {}
  isLogged: boolean;

  ngOnInit(): void {
    this.loginService.isConnected.subscribe((sub) => {
      this.isLogged = sub.valueOf();
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/home']);
  }
}
