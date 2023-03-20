import { TestBed } from '@angular/core/testing';

import { InfectiousStatusEditCompIntService } from './infectious-status-edit-comp-int.service';

describe('InfectiousStatusEditCompIntService', () => {
  let service: InfectiousStatusEditCompIntService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfectiousStatusEditCompIntService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
