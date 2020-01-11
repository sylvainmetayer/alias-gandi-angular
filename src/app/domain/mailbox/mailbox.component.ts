import { Component, OnInit, Input } from '@angular/core';
import { GandiApiService } from 'src/app/gandi-api/gandi-api.service';
import { Mailbox } from './mailbox';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss']
})
export class MailboxComponent implements OnInit {

  @Input() mailBoxId: string;

  @Input() newAlias: string;

  mailbox: Mailbox;

  constructor(private api: GandiApiService) { }

  ngOnInit() {
    this.api.getMailboxDetails(this.mailBoxId).subscribe(mailbox => this.mailbox = mailbox);
    this.newAlias = this.generateId();
  }

  delete(alias: string) {
    this.api.updateAliases(this.mailBoxId,
      this.mailbox.aliases.filter(item => item !== alias)
    ).subscribe(result => {
      if (!result) {
        alert('ERROR');
      } else {
        this.mailbox.aliases = this.mailbox.aliases.filter(item => item !== alias);
      }
    });
  }

  add(alias: string) {
    this.api.updateAliases(this.mailBoxId,
      this.mailbox.aliases.concat[alias]
    ).subscribe(result => {
      if (!result) {
        alert('ERROR');
      } else {
        this.mailbox.aliases = this.mailbox.aliases.concat([alias]);
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
