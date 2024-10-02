import { TestBed } from '@angular/core/testing';

import { FireblogFacadeService } from './fireblog-facade.service';

describe('FireblogFacadeService', () => {
  let service: FireblogFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireblogFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
