import { TestBed } from '@angular/core/testing';

import { UINotificationService } from './uinotification.service';

describe('UINotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UINotificationService = TestBed.inject(UINotificationService);
    expect(service).toBeTruthy();
  });
});
