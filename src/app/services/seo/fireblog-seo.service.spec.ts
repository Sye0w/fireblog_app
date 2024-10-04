import { TestBed } from '@angular/core/testing';

import { FireblogSeoService } from './fireblog-seo.service';

describe('FireblogSeoService', () => {
  let service: FireblogSeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireblogSeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
