import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { GandiApiService } from '../gandi-api/gandi-api.service';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit, OnChanges {

  constructor(private api: GandiApiService) { }

  @Input() domain: string;

  mailboxesIds: Array<string>;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.domain.currentValue !== changes.domain.previousValue) {
      this.updateMailboxesIds();
    }
  }

  private updateMailboxesIds() {
    this.mailboxesIds = [];
    this.api.getMailboxesIds(this.domain).subscribe((ids => {
      this.mailboxesIds = ids;
    }));
  }

  ngOnInit() {
    this.updateMailboxesIds();
  }

}
