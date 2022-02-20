import { TestBed } from '@angular/core/testing';

import { InfectiousStatusService } from './infectious-status.service';

describe('InfectiousStatusService', () => {
  let service: InfectiousStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfectiousStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
