import { TestBed } from '@angular/core/testing';

import { OutbreakUnitAssoService } from './outbreak-unit-asso.service';

describe('OutbreakUnitAssoService', () => {
  let service: OutbreakUnitAssoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutbreakUnitAssoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
