import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { GandiApiService } from '../gandi-api/gandi-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {
  constructor(private api: GandiApiService, private route: ActivatedRoute) {}

  @Input() domain: string;

  mailboxesIds: Array<string>;

  private updateMailboxesIds() {
    this.mailboxesIds = [];
    this.api.getMailboxesIds(this.domain).subscribe(ids => {
      this.mailboxesIds = ids;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.domain = params.domain;
      this.updateMailboxesIds();
    });
  }
}
