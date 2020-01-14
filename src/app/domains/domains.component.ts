import { Component, OnInit } from '@angular/core';
import { GandiApiService } from '../gandi-api/gandi-api.service';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.scss']
})
export class DomainsComponent implements OnInit {

  domains: Array<string>;

  selectedDomain: string;

  constructor(private api: GandiApiService) { }

  ngOnInit(): void {
    this.api.getDomains().subscribe((domains) => {
      this.domains = domains;
    });
    this.selectedDomain = null;
  }

}
