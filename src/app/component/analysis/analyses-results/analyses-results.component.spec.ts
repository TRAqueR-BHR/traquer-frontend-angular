import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysesResultsComponent } from './analyses-results.component';

describe('AnalysesResultsComponent', () => {
  let component: AnalysesResultsComponent;
  let fixture: ComponentFixture<AnalysesResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysesResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysesResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
