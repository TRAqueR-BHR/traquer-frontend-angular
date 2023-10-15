import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExposedFunctionPageComponent } from './exposed-function-page.component';

describe('ExposedFunctionPageComponent', () => {
  let component: ExposedFunctionPageComponent;
  let fixture: ComponentFixture<ExposedFunctionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExposedFunctionPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExposedFunctionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
