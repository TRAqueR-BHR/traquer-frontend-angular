import { TestBed } from '@angular/core/testing';

import { SimulateProcessingAtPointInTimeService } from './simulate-processing-at-point-in-time.service';

describe('SimulateProcessingAtPointInTimeService', () => {
  let service: SimulateProcessingAtPointInTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulateProcessingAtPointInTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
