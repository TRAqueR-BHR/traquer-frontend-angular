import { TestBed } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard-service.service';

describe('AuthGuardServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthGuardService = TestBed.inject(AuthGuardService);
    expect(service).toBeTruthy();
  });
});
