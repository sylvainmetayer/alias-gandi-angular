import { Component, OnInit } from '@angular/core';
import { LoginService } from '../auth/login.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.login('test').subscribe(data => console.log(data));
  }

}
