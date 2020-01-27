import { Component, OnInit } from '@angular/core';
import { LoginService } from './auth/login.service';
import { Router } from '@angular/router';
import { GandiApiService } from './gandi-api/gandi-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router, private api: GandiApiService) { }
  isLogged: boolean;
  domains: Array<string>;

  ngOnInit(): void {
    this.loginService.isConnected.subscribe(sub => {
      this.isLogged = sub.valueOf();
      if (this.isLogged) {
        this.api.getDomains().subscribe((domains) => {
          this.domains = domains;
        });
      }
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/home']);
  }



}
