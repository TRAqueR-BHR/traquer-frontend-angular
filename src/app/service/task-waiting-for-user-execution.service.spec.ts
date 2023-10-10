import { TestBed } from '@angular/core/testing';

import { TaskWaitingForUserExecutionService } from './task-waiting-for-user-execution.service';

describe('TaskWaitingForUserExecutionService', () => {
  let service: TaskWaitingForUserExecutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskWaitingForUserExecutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
