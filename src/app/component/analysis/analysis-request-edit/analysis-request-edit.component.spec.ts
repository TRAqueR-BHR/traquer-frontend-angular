import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisRequestEditComponent } from './analysis-request-edit.component';

describe('AnalysisRequestEditComponent', () => {
  let component: AnalysisRequestEditComponent;
  let fixture: ComponentFixture<AnalysisRequestEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisRequestEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisRequestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
