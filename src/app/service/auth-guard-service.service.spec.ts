import { TestBed } from '@angular/core/testing';

import { AuthGuardServiceService } from './auth-guard-service.service';

describe('AuthGuardServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthGuardServiceService = TestBed.inject(AuthGuardServiceService);
    expect(service).toBeTruthy();
  });
});
