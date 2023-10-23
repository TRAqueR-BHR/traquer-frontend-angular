import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysesRequestsComponent } from './analyses-requests.component';

describe('AnalysesRequestsComponent', () => {
  let component: AnalysesRequestsComponent;
  let fixture: ComponentFixture<AnalysesRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysesRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysesRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
