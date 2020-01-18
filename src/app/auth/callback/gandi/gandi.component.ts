import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../login.service';

@Component({
  selector: 'app-gandi',
  template: '<ng-container ></ng-container>'
})
export class GandiComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.router.navigate(['/domains']);
    });
  }

}
