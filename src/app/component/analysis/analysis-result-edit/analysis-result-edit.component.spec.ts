import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisResultEditComponent } from './analysis-result-edit.component';

describe('AnalysisResultEditComponent', () => {
  let component: AnalysisResultEditComponent;
  let fixture: ComponentFixture<AnalysisResultEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisResultEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisResultEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
