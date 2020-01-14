import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { LoginService } from './login.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { UnauthorizedInterceptor } from './unauthorized-interceptor';
import { FormsModule } from '@angular/forms';
import { reconnectInitializer } from './initializer/reconnect-initializer';
import { AuthInterceptor } from './interceptor/auth-interceptor';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    LoginService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: reconnectInitializer, deps: [LoginService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true },
  ]
})
export class AuthModule { }
