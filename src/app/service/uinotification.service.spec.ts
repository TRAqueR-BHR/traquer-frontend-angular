import { TestBed } from '@angular/core/testing';

import { UINotificationService } from './uinotification.service';

describe('UINotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UINotificationService = TestBed.get(UINotificationService);
    expect(service).toBeTruthy();
  });
});
