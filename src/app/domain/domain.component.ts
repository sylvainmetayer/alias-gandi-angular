import { Component, OnInit, Input } from '@angular/core';
import { GandiApiService } from '../gandi-api/gandi-api.service';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {

  @Input() domain: string;

  mailboxesIds: Array<string>;

  constructor(private api: GandiApiService) { }

  ngOnInit() {
    this.api.getMailboxesIds(this.domain).subscribe((ids => {
      this.mailboxesIds = ids;
    }));
  }

}
