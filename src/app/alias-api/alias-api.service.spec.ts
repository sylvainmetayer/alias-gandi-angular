import { TestBed } from '@angular/core/testing';

import { AliasApiService } from './alias-api.service';

describe('AliasApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AliasApiService = TestBed.inject(AliasApiService);
    expect(service).toBeTruthy();
  });
});
