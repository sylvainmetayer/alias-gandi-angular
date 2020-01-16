import { Component, OnInit } from '@angular/core';
import { LoginService } from '../auth/login.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  title = 'alias-gandi-angular';

  constructor(private loginService: LoginService) {}
  isLogged: boolean;

  ngOnInit(): void {
    this.loginService.isConnected.subscribe(sub => {
      this.isLogged = sub.valueOf();
    });
  }

}
