import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutePendingTasksComponent } from './execute-pending-tasks.component';

describe('ExecutePendingTasksComponent', () => {
  let component: ExecutePendingTasksComponent;
  let fixture: ComponentFixture<ExecutePendingTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutePendingTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutePendingTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
