import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild(NgForm, { static: true }) loginForm: NgForm;

  error = false;

  credentials: { password: string } = { password: null };

  constructor(
    private loginService: LoginService,
    private routerService: Router
  ) {}

  ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => {
      this.resetErrors();
    });
  }

  authenticate(): void {
    this.resetErrors();
    this.loginService.login(this.credentials.password).subscribe(
      res => {
        if (res) {
          this.routerService.navigate(['/domains']);
        }
      },
      err => {
        this.error = true;
      }
    );
  }

  private resetErrors() {
    this.error = false;
  }
}
