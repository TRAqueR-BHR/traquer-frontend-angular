import { TestBed } from '@angular/core/testing';

import { ExposedFunctionService } from './exposed-function.service';

describe('ExposedFunctionService', () => {
  let service: ExposedFunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExposedFunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
