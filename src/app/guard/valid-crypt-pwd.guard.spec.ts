import { TestBed } from '@angular/core/testing';

import { ValidCryptPwdGuard } from './valid-crypt-pwd.guard';

describe('ValidCryptPwdGuard', () => {
  let guard: ValidCryptPwdGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ValidCryptPwdGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
