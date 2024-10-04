import { TestBed } from '@angular/core/testing';

import { FireblogAnalyticsService } from './fireblog-analytics.service';

describe('FireblogAnalyticsService', () => {
  let service: FireblogAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireblogAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
