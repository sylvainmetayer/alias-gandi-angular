import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DomainComponent } from './domain/domain.component';
import { MailboxComponent } from './domain/mailbox/mailbox.component';
import { DomainsComponent } from './domains/domains.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DomainComponent,
    MailboxComponent,
    DomainsComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
