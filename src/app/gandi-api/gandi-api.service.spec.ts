import { TestBed } from '@angular/core/testing';

import { GandiApiService } from './gandi-api.service';

describe('GandiApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GandiApiService = TestBed.get(GandiApiService);
    expect(service).toBeTruthy();
  });
});
