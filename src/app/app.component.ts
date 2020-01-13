import { Component, OnInit } from '@angular/core';
import { LoginService } from './auth/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'alias-gandi-angular';

  constructor(private loginService: LoginService) {}

  logout() {
    this.loginService.logout();
  }

}
