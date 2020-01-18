import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { DomainsComponent } from './domains/domains.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { DomainComponent } from './domain/domain.component';
import { GandiComponent } from './auth/callback/gandi/gandi.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'domain/:domain',
    component: DomainComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomepageComponent
  },
  {
    path: 'callback/gandi',
    component: GandiComponent
  },
  {
    path: 'domains',
    component: DomainsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
