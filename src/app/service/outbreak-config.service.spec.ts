import { TestBed } from '@angular/core/testing';

import { OutbreakConfigService } from './outbreak-config.service';

describe('OutbreakConfigService', () => {
  let service: OutbreakConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutbreakConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
