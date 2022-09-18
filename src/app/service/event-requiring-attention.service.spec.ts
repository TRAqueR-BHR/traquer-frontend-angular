import { TestBed } from '@angular/core/testing';

import { EventRequiringAttentionService } from './event-requiring-attention.service';

describe('EventRequiringAttentionService', () => {
  let service: EventRequiringAttentionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventRequiringAttentionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
