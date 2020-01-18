import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../login.service';

@Component({
  selector: 'app-gandi',
  template: '<ng-container ></ng-container>'
})
export class GandiComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private loginService: LoginService) { }


  private code: string;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.loginService.gandiLogin(params.code).subscribe(res => {
        console.log(res);
        if (res) {
          this.router.navigate(['/domains']);
        } else {
          this.router.navigate(['/login']);
        }
      });
    });
  }

}
