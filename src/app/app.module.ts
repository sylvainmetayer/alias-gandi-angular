import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { AppComponent } from './app.component';
import { DomainComponent } from './domain/domain.component';
import { MailboxComponent } from './domain/mailbox/mailbox.component';
import { DomainsComponent } from './domains/domains.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CopyClipboardDirective } from './copy-clipboard.directive';

@NgModule({
  declarations: [
    AppComponent,
    DomainComponent,
    MailboxComponent,
    DomainsComponent,
    HomepageComponent,
    CopyClipboardDirective
  ],
  imports: [
    MatTableModule,
    MatMenuModule,
    MatListModule,
    MatToolbarModule,
    MatInputModule,
    FlexLayoutModule,
    MatBadgeModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule,
    MatExpansionModule,
    MatSelectModule,
    AuthModule,
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
