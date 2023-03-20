import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysesPageComponent } from './analyses-page.component';

describe('AnalysesPageComponent', () => {
  let component: AnalysesPageComponent;
  let fixture: ComponentFixture<AnalysesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
