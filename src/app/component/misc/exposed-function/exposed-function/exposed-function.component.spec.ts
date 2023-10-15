import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExposedFunctionComponent } from './exposed-function.component';

describe('ExposedFunctionComponent', () => {
  let component: ExposedFunctionComponent;
  let fixture: ComponentFixture<ExposedFunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExposedFunctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExposedFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
