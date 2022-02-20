import { TestBed } from '@angular/core/testing';

import { FrontendVersionService } from './frontend-version.service';

describe('FrontendVersionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FrontendVersionService = TestBed.get(FrontendVersionService);
    expect(service).toBeTruthy();
  });
});
