import { TestBed } from '@angular/core/testing';

import { ContactExposureService } from './contact-exposure.service';

describe('ContactExposureService', () => {
  let service: ContactExposureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactExposureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
