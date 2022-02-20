import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetPasswordComponent } from './dataset-password.component';

describe('DatasetPasswordComponent', () => {
  let component: DatasetPasswordComponent;
  let fixture: ComponentFixture<DatasetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
