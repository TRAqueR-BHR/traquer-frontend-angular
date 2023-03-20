import { TestBed } from '@angular/core/testing';

import { ResponsesToEventCompIntService } from './responses-to-event-comp-int.service';

describe('ResponsesToEventCompIntService', () => {
  let service: ResponsesToEventCompIntService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsesToEventCompIntService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
