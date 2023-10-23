import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysesRequestsPageComponent } from './analyses-requests-page.component';

describe('AnalysesRequestsPageComponent', () => {
  let component: AnalysesRequestsPageComponent;
  let fixture: ComponentFixture<AnalysesRequestsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysesRequestsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysesRequestsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
