import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExposedFunctionArgumentComponent } from './exposed-function-argument.component';

describe('ExposedFunctionArgumentComponent', () => {
  let component: ExposedFunctionArgumentComponent;
  let fixture: ComponentFixture<ExposedFunctionArgumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExposedFunctionArgumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExposedFunctionArgumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
