import { Component, OnInit } from '@angular/core';
import { LoginService } from '../auth/login.service';
import { AliasApiService } from '../alias-api/alias-api.service';
import { MailboxInterface, Domain, Mailbox } from '../alias-api/entities';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private api: AliasApiService
  ) {}

  isLogged: boolean;
  domains: Array<Domain>;

  ngOnInit(): void {
    this.domains = null;
    this.loginService.isConnected.subscribe(sub => {
      this.isLogged = sub.valueOf();
      if (this.isLogged) {
        this.api.getDomains().subscribe((domains) => {
          this.domains = domains.map((domainResponse) => {
            const domain = new Domain(domainResponse.name, domainResponse.id);
            domainResponse.mailboxes.forEach((element: MailboxInterface) => {
              domain.addMailbox(
                new Mailbox(domain, element.label, element.id, element.aliases)
              );
            });
            return domain;
          });
        });
      } else {
        this.domains = [];
      }
    });
  }

}
