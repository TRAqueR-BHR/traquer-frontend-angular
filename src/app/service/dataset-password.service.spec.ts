import { TestBed } from '@angular/core/testing';

import { DatasetPasswordService } from './dataset-password.service';

describe('DatasetPasswordService', () => {
  let service: DatasetPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
