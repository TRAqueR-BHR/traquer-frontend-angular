import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulateProcessingAtPointInTimeComponent } from './simulate-processing-at-point-in-time.component';

describe('SimulateProcessingAtPointInTimeComponent', () => {
  let component: SimulateProcessingAtPointInTimeComponent;
  let fixture: ComponentFixture<SimulateProcessingAtPointInTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulateProcessingAtPointInTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulateProcessingAtPointInTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
