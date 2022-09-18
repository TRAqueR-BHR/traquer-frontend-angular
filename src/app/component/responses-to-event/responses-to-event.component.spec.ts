import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsesToEventComponent } from './responses-to-event.component';

describe('ResponsesToEventComponent', () => {
  let component: ResponsesToEventComponent;
  let fixture: ComponentFixture<ResponsesToEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponsesToEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsesToEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
