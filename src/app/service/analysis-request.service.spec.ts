import { TestBed } from '@angular/core/testing';

import { AnalysisRequestService } from './analysis-request.service';

describe('AnalysisRequestService', () => {
  let service: AnalysisRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalysisRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
