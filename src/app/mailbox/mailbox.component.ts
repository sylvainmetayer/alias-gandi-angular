import { Component, OnInit, Input } from '@angular/core';
import { AliasApiService } from 'src/app/alias-api/alias-api.service';
import { Mailbox, Domain } from 'src/app/alias-api/entities';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
})
export class MailboxComponent implements OnInit {
  @Input() mailBoxId: string;

  @Input() domain: string;

  @Input() newAlias: string;

  mailbox: null | Mailbox = null;

  constructor(private api: AliasApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.domain = params.domain;
      this.mailBoxId = params.id;
      this.api
        .getMailboxDetails(this.domain, this.mailBoxId)
        .subscribe((mailbox) => {
          if (mailbox.aliases === undefined) {
            mailbox.aliases = [];
          }
          this.mailbox = new Mailbox(
            new Domain(this.domain),
            mailbox.label,
            mailbox.id,
            mailbox.aliases
          );
        });
    });
    this.newAlias = this.generateId();
  }

  delete(alias: string) {
    this.api
      .updateAliases(
        this.domain,
        this.mailBoxId,
        this.mailbox.getAliases().filter((item) => item !== alias)
      )
      .subscribe((result) => {
        if (!result) {
          alert('ERROR');
        } else {
          this.mailbox.setAliases(result);
        }
      });
  }

  getAliasEmail(alias: string) {
    return `${alias}@${this.domain}`;
  }

  add(alias: string) {
    this.api
      .updateAliases(
        this.domain,
        this.mailBoxId,
        this.mailbox.getAliases().concat([alias])
      )
      .subscribe((result) => {
        if (!result) {
          alert('ERROR');
        } else {
          this.mailbox.setAliases(result);
          this.newAlias = this.generateId();
        }
      });
  }

  /**
   * @see https://gist.github.com/gordonbrander/2230317
   */
  generateId(): string {
    return Math.random().toString(36).substr(2, 16);
  }
}
